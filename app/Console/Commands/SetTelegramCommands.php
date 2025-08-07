<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Telegram\Bot\Api;

class SetTelegramCommands extends Command
{
    protected $signature = 'telegram:commands:set';
    protected $description = 'Définit les commandes du bot Telegram (menu)';

    public function handle()
    {
        $botToken = config('telegram.bots.mybot.token') ?? env('TELEGRAM_BOT_TOKEN');
        if (!$botToken) {
            $this->error('TELEGRAM_BOT_TOKEN non défini dans .env ou config/telegram.php');
            return 1;
        }

        $telegram = new Api($botToken);

        $commands = [
            [
                'command' => 'start',
                'description' => 'Accueil du bot 🚀',
            ],
            [
                'command' => 'help',
                'description' => 'Obtenir de l’aide 🆘',
            ],
            [
                'command' => 'new_maraicher',
                'description' => 'Nouvelle maraicher 🚜',
            ],
        ];

        $response = $telegram->setMyCommands(['commands' => $commands]);
        $this->info('Réponse Telegram : ' . json_encode($response));
        $this->info('Menu des commandes Telegram mis à jour !');
        return 0;
    }
}
