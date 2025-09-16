<?php

namespace App\Telegram\Commands;

use App\Services\SendMessageService;
use DB;
use Telegram\Bot\Commands\Command;

class GenererRecuCommande extends Command
{
    protected string $name = 'generer_recu';
    protected string $description = 'Générer un reçu 💸';

    public function handle()
    {
        $update = $this->getUpdate();
        $message = $update->getMessage();
        $chatId = $message->getChat()->getId();

        $this->handleGenerateRecu($chatId);
    }

    public function handleGenerateRecu($chatId)
    {
        try {
            $existingSessionRecu = DB::table('telegram_sessions')
                ->where('chat_id', $chatId)
                ->where('command', 'generate_recu')
                ->where('completed', false)
                ->first();

            if (!$existingSessionRecu) {
                DB::table('telegram_sessions')->insert([
                    'user_id' => $chatId,
                    'chat_id' => $chatId,
                    'command' => 'generate_recu',
                    'step' => 'awaiting_recu',
                    'data' => json_encode([]),
                    'completed' => false,
                    'created_at' => now(),
                    'updated_at' => now()
                ]);

                $message = "🌱 Genérer un recu\nVeuillez entrer le numero du recu ou facture à générer: \n\n" .
                    "Tapez /cancel pour annuler à tout moment.";

                $this->getSendMessageService()->sendMessage(
                    $chatId,
                    $message,
                    'Markdown'
                );
                return;
            }

            $this->getSendMessageService()->sendMessage(
                $chatId,
                "❌ Session de generation de recu en cours.\nVeuillez  entrer le numero du recu ou facture à générer.\n\n" .
                "Tapez /cancel pour annuler à tout moment.",
                'Markdown'
            );
        } catch (\Throwable $th) {
            $this->getSendMessageService()->sendMessage(
                $chatId,
                "❌ Erreur lors de la generation du recu.\n\n Veuillez  réessayer plus tard.",
                'Markdown'
            );
        }
    }

    private function getSendMessageService(): SendMessageService
    {
        return app(SendMessageService::class);
    }
}
