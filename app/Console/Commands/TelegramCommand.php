<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Telegram\Bot\Laravel\Facades\Telegram;

class TelegramCommand extends Command
{
    protected $signature = 'telegram:send {message}';
    protected $description = 'Envoie un message à Telegram';

    public function handle()
    {
        $message = $this->argument('message');
        Telegram::sendMessage([
            'chat_id' => env('TELEGRAM_CHAT_ID'),
            'text' => $message
        ]);
        $this->info("Message envoyé : $message");
    }
}
