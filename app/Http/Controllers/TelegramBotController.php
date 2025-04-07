<?php
namespace App\Http\Controllers;

use Telegram\Bot\Laravel\Facades\Telegram;

class TelegramBotController extends Controller
{
    public function handle()
    {
        $update = Telegram::commandsHandler(true);

        $message = $update->getMessage();
        $text    = $message->getText();
        $chatId  = $message->getChat()->getId();

        if ($text === '/start') {
            Telegram::sendMessage([
                'chat_id' => $chatId,
                'text'    => 'Bonjour ! Bienvenue sur mon bot Telegram.',
            ]);
        }

        return response()->json(['status' => 'success']);
    }
}
