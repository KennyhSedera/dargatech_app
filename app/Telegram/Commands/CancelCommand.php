<?php

namespace App\Telegram\Commands;

use App\Services\SessionService;
use DB;
use Log;
use Telegram\Bot\Commands\Command;

class CancelCommand extends Command
{
    protected string $name = 'cancel';
    protected string $description = 'Annuler la session en cours ❌';

    public function __construct()
    {

    }

    public function handle()
    {
        $chatId = $this->getUpdate()->getMessage()->getChat()->getId();
        $userId = $this->getUpdate()->getMessage()->getFrom()->getId();

        $sessionService = app(SessionService::class);

        $command = DB::table('telegram_sessions')
            ->where('user_id', $userId)
            ->where('chat_id', $chatId)
            ->where('completed', false)
            ->get();

        if ($command->count() > 0) {
            foreach ($command as $c) {
                $sessionService->cancelSession($userId, $c->command);
            }

            $this->replyWithMessage(['text' => '✅ Session annulée.']);
        } else {
            $this->replyWithMessage(use_sendMessage_parameters: ['text' => '❌ Aucune session en cours.']);
        }
    }
}
