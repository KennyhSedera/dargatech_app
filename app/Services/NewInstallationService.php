<?php

namespace App\Services;

use App\Telegram\Keyboard\NewChoiceKeyboard;
use Illuminate\Support\Facades\DB;
use Log;
use PhpParser\Node\Stmt\TryCatch;
use Telegram\Bot\Api;

class NewInstallationService
{
    protected SendMessageService $sendMessage;
    protected StepService $globalStepService;

    public function __construct(SendMessageService $sendMessage, StepService $globalStepService)
    {
        $this->sendMessage = $sendMessage;
        $this->globalStepService = $globalStepService;
    }

    public function handleStep($step, $messageText, $data, $userId, $chatId)
    {
        $this->globalStepService->handleStep(
            $step,
            $messageText,
            $data,
            $userId,
            $chatId,
            'new_installation',
            [$this, 'finalizeInstallation']
        );
    }

    public function finalizeInstallation($data, $userId, $chatId)
    {
        DB::beginTransaction();

        try {
            $locationService = new LocationService();
            $locationdata = json_decode($data['localisation']);

            $location = $locationService->getLocationDetails(lat: $locationdata[0], lon: $locationdata[1]);

            $pays = ($location['pays'] !== 'Erreur') ? $location['pays'] : null;
            $ville = ($location['adresse'] !== 'Erreur lors de la récupération') ? $location['adresse'] : null;

            $localisation_id = DB::table('localisations')->insertGetId([
                'latitude' => $locationdata[0],
                'longitude' => $locationdata[1],
                'pays' => $pays,
                'ville' => $ville,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $code_installation = $this->generateNextCodeInstallation();

            DB::table('installations')->insertGetId([
                'client_id' => $data['client_id'],
                'code_installation' => $code_installation,
                'puissance_pompe' => $data['puissance_pompe'],
                'numero_serie' => $data['numero_serie'],
                'debit_nominal' => $data['debit_nominal'],
                'profondeur_forage' => $data['profondeur_forage'],
                'source_eau' => $data['source_eau'],
                'photos_installation' => $data['photo'],
                'hmt' => $data['hmt'],
                'localisation_id' => $localisation_id,
                'date_installation' => $data['date_installation'],
                'created_via' => 'telegram_bot',
                'statuts' => 'installée',
                'created_at' => now(),
                'updated_at' => now(),
                'qte_eau' => $data['qte_eau'],
                'qte_co2' => $data['qte_co2'],
            ]);

            DB::commit();

            DB::table('telegram_sessions')
                ->where('user_id', $userId)
                ->where('command', 'new_installation')
                ->where('completed', false)
                ->delete();

            $successMessage = "\n✅ L'installation *`{$code_installation}`* a été enregistrée dans le système.";

            $this->sendMessage->sendMessage($chatId, $successMessage, 'Markdown');


        } catch (\Throwable $e) {
            DB::rollBack();

            Log::error("Erreur lors de l'enregistrement de l'installation", [
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString(),
                'user_id' => $userId,
                'chat_id' => $chatId,
                'data' => $data
            ]);

            $errorMessage = "❌ Une erreur s'est produite lors de l'enregistrement.\n\n";
            $errorMessage .= "🔄 Vous pouvez :\n";
            $errorMessage .= "• Tapez /new_installation pour recommencer\n";
            $errorMessage .= "• Contactez le support si le problème persiste\n\n";
            $errorMessage .= "📝 *Code d'erreur :* `" . substr(md5($e->getMessage()), 0, 8) . "`";

            $this->sendMessage->sendMessage($chatId, $errorMessage, 'Markdown');

            DB::table('telegram_sessions')
                ->where('user_id', $userId)
                ->where('command', 'new_installation')
                ->where('completed', false)
                ->delete();
        }
    }

    private function generateNextCodeInstallation()
    {
        $lastCode = DB::table('installations')
            ->orderBy('code_installation', 'desc')
            ->value('code_installation');

        if (!$lastCode) {
            return 'I0001';
        }

        $lastNumber = (int) substr($lastCode, 1);

        $nextNumber = $lastNumber + 1;

        return 'I' . str_pad($nextNumber, 4, '0', STR_PAD_LEFT);
    }
}
