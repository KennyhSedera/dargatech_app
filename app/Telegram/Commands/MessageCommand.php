<?php
namespace App\Telegram\Commands;

use App\Services\SendMessageService;
use Log;
use Telegram\Bot\Commands\Command;

class MessageCommand extends Command
{
    protected string $name = 'message';
    protected string $description = 'Commande message';

    public function handle()
    {
        $update = $this->getUpdate();
        $text = $update->getMessage()->getText();
        $userId = $update->getMessage()->getFrom()->getId();

        Log::info('Commande message', ['text' => $text, 'userId' => $userId]);

        $this->replyMessage($userId, $text);
    }

    public function replyMessage($userId, $text)
    {
        $sendService = app(SendMessageService::class);
        $sendService->sendErrorMessage($userId, $text);
    }

}
