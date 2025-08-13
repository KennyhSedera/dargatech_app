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
        $chatId = $this->getUpdate()->getMessage()->getChat()->getId();
        $this->sendMaraicherMenu($this->telegram, $chatId);
    }

    public function sendMaraicherMenu(Api $telegram, $chatId)
    {
        $keyboard = Keyboard::make()
            ->inline()
            ->row([
                Keyboard::inlineButton(['text' => '➕ Nouveau Maraîcher', 'callback_data' => 'new_maraicher']),
                Keyboard::inlineButton(['text' => '👨‍🌾 Liste Maraîchers', 'callback_data' => 'list_maraicher']),
            ])
            ->row([
                Keyboard::inlineButton(['text' => '🔍 Rechercher', 'callback_data' => 'search_maraicher']),
            ]);

        $telegram->sendMessage([
            'chat_id' => $chatId,
            'text' => '📋 <b>Menu Principal Maraîcher</b> — Choisissez une action :',
            'reply_markup' => $keyboard,
            'parse_mode' => 'HTML',
        ]);
    }


}
