<?php

namespace App\Telegram\Commands;

use Telegram\Bot\Commands\Command;
use Illuminate\Support\Facades\DB;
use App\Services\NewMaraicherService;

class NewMaraicherCommand extends Command
{
    protected string $name = 'new_maraicher';
    protected string $description = 'Enregistrement de nouveau Maraîcher.';

    public function handle()
    {
        $chatId = $this->getUpdate()->getMessage()->getChat()->getId();
        $userId = $this->getUpdate()->getMessage()->getFrom()->getId();
        $messageText = $this->getUpdate()->getMessage()->getText();

        $service = app(NewMaraicherService::class);

        $existingSession = DB::table('telegram_sessions')
            ->where('user_id', $userId)
            ->where('command', 'new_maraicher')
            ->where('completed', false)
            ->first();

        if ($existingSession) {
            $data = json_decode($existingSession->data, true) ?? [];
            $service->handleStep($existingSession->step, $messageText, $data, $userId, $chatId);
        } else {
            $this->startNewSession($chatId, $userId);
        }

    }

    private function startNewSession($chatId, $userId)
    {
        DB::table('telegram_sessions')->insert([
            'user_id' => $userId,
            'chat_id' => $chatId,
            'command' => 'new_maraicher',
            'step' => 'nom',
            'data' => json_encode([]),
            'completed' => false,
            'created_at' => now(),
            'updated_at' => now()
        ]);

        $this->replyWithMessage([
            'text' => "🌱 *Enregistrement d'un nouveau maraîcher*\n\nVeuillez entrer le *nom* du maraîcher :",
            'parse_mode' => 'Markdown'
        ]);
    }
}
