<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class NewMaraicherService
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
            'new_maraicher',
            [$this, 'finalizeMaraicher']
        );
    }

    public function finalizeMaraicher($data, $userId, $chatId)
    {
        try {
            $id = DB::table('clients')->insertGetId([
                'nom' => $data['nom'],
                'prenom' => $data['prenom'],
                'telephone' => $data['telephone'],
                'localisation' => $data['localisation'],
                'genre' => $data['genre'],
                'email' => $data['email'],
                'CIN' => $data['CIN'],
                'date_contrat' => $data['date_contrat'],
                'type_activite_agricole' => $data['type_activite_agricole'],
                'surface_cultivee' => $data['surface_cultivee'],
                'created_at' => now(),
                'updated_at' => now(),
                'created_via' => 'telegram_bot'
            ]);

            $this->sendMessage->sendMessage($chatId,
                "🎉 *Maraîcher enregistré avec succès !*\n\n",
                'Markdown'
            );

            DB::table('telegram_sessions')
                ->where('user_id', $userId)
                ->where('command', 'new_maraicher')
                ->where('completed', false)
                ->update(['completed' => true]);

        } catch (\Exception $e) {
            Log::error("Erreur enregistrement maraîcher : " . $e->getMessage());

            $this->sendMessage->sendMessage($chatId,
                "❌ Une erreur s'est produite lors de l'enregistrement. Tapez /new_maraicher pour recommencer."
            );

            DB::table('telegram_sessions')
                ->where('user_id', $userId)
                ->where('command', 'new_maraicher')
                ->where('completed', false)
                ->delete();
        }
    }
}
