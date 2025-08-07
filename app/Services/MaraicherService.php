<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class MaraicherService {
    protected SendMessageService $sendMessage;

    public function __construct(SendMessageService $sendMessage)
    {
        $this->sendMessage = $sendMessage;
    }

    public function handleStep($step, $messageText, $data, $userId, $chatId)
    {
        $messageText = trim($messageText);

        if (empty($messageText)) {
            $this->sendMessage->sendMessage($chatId, "❌ Ce champ est obligatoire. Veuillez fournir une valeur valide :");
            return;
        }

        $data[$step] = $messageText;
        $nextStep = $this->getNextStep($step);

        Log::info('Step: ' . $step);
        Log::info('Message Text: ' . $messageText);
        Log::info('Data: ' . json_encode($data));
        Log::info('Next Step: ' . $nextStep);

        if ($nextStep) {
            DB::table('telegram_sessions')
                ->where('user_id', $userId)
                ->where('command', 'new_maraicher')
                ->where('completed', false)
                ->update([
                    'step' => $nextStep,
                    'data' => json_encode($data),
                    'updated_at' => now()
                ]);

            $this->sendMessage->sendMessage($chatId, $this->getPromptForStep($nextStep), 'Markdown');
        } else {
            $this->finalizeMaraicher($data, $userId, $chatId);
        }
    }

    private function getNextStep($currentStep)
    {
        $steps = [
            'nom', 'prenom', 'telephone', 'localisation', 'genre',
            'email', 'CIN', 'date_contrat', 'type_activite_agricole', 'surface_cultivee'
        ];

        $index = array_search($currentStep, $steps);
        return $steps[$index + 1] ?? null;
    }

    private function getPromptForStep($step)
    {
        return match($step) {
            'nom' => "🌱 Veuillez entrer le *nom* du maraîcher :",
            'prenom' => "✍️ Entrez maintenant le *prénom* :",
            'telephone' => "📞 Entrez le *téléphone* :",
            'localisation' => "📍 Entrez la *localisation* :",
            'genre' => "👤 Entrez le *genre* (Homme/Femme) :",
            'email' => "📧 Entrez l'*email* :",
            'CIN' => "🪪 Entrez le *CIN* :",
            'date_contrat' => "📅 Entrez la *date de contrat* (AAAA-MM-JJ) :",
            'type_activite_agricole' => "🌾 Entrez le *type d'activité agricole* :",
            'surface_cultivee' => "📏 Entrez la *surface cultivée* (en hectares, ex : 0.5) :",
            default => ""
        };
    }

    public function finalizeMaraicher($data, $userId, $chatId)
    {
        try {
            $id = DB::table(table: 'clients')->insertGetId([
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

            DB::table('telegram_sessions')
                ->where('user_id', $userId)
                ->where('command', 'new_maraicher')
                ->where('completed', false)
                ->update([
                    'completed' => true,
                    'updated_at' => now()
                ]);

            $this->sendMessage->sendMessage($chatId,
                "🎉 *Maraîcher enregistré avec succès !*\n\n" .
                "🆔 ID: #$id\n" .
                "• Nom : {$data['nom']}\n" .
                "• Prénom : {$data['prenom']}\n" .
                "• Téléphone : {$data['telephone']}\n" .
                "• Localisation : {$data['localisation']}\n" .
                "• Genre : {$data['genre']}\n" .
                "• Email : {$data['email']}\n" .
                "• CIN : {$data['CIN']}\n" .
                "• Date contrat : {$data['date_contrat']}\n" .
                "• Activité : {$data['type_activite_agricole']}\n" .
                "• Surface : {$data['surface_cultivee']} ha",
                'Markdown'
            );

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
