<?php

namespace App\Telegram\Commands;

use Telegram\Bot\Api;
use Telegram\Bot\Commands\Command;
use Telegram\Bot\Keyboard\Keyboard;

class MaraicherCommand extends Command
{

    protected string $name = 'maraicher';
    protected string $description = 'Affiche le menu pour les Maraîchers 👨‍🌾';

    public function handle()
    {
        $keyboard = Keyboard::make()
            ->inline()
            ->row([
                Keyboard::inlineButton(['text' => '👨‍🌾 Nouveau Maraîcher', 'callback_data' => 'new_maraicher']),
                Keyboard::inlineButton(['text' => '👨‍🌾 Liste Maraîcher', 'callback_data' => 'list_full']),
            ]);

        $this->replyWithMessage([
            'text' => '📋 <b>Menu Principal</b> — Choisissez une action :',
            'reply_markup' => $keyboard,
            'parse_mode' => 'HTML',
        ]);
    }

    public function sendMaraicherMenu(Api $telegram, $chatId)
    {
        $keyboard = Keyboard::make()
            ->inline()
            ->row([
                Keyboard::inlineButton(['text' => '👨‍🌾 Nouveau Maraîcher', 'callback_data' => 'new_maraicher']),
                Keyboard::inlineButton(['text' => '👨‍🌾 Liste Maraîcher', 'callback_data' => 'list_full']),
            ]);

        $telegram->sendMessage([
            'chat_id' => $chatId,
            'text' => '📋 <b>Menu Principal</b> — Choisissez une action :',
            'reply_markup' => $keyboard,
            'parse_mode' => 'HTML',
        ]);
    }


}
