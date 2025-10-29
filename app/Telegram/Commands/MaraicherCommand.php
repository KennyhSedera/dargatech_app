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

    public function sendMaraicherMenu(Api $telegram, $chatId, $messageId = null)
    {
        $keyboard = Keyboard::make()
            ->inline()
            ->row([
                Keyboard::inlineButton(['text' => '➕ Nouveau Maraîcher', 'callback_data' => 'button_create_maraicher']),
                Keyboard::inlineButton(['text' => '👨‍🌾 Liste Maraîchers', 'callback_data' => 'list_maraicher']),
            ])
            ->row([
                Keyboard::inlineButton(['text' => '🔍 Rechercher', 'callback_data' => 'search_maraicher']),
            ]);

        $params = [
            'chat_id' => $chatId,
            'text' => '📋 <b>Menu Principal Maraîcher</b> — Choisissez une action :',
            'reply_markup' => $keyboard,
            'parse_mode' => 'HTML',
        ];

        if ($messageId) {
            $params['message_id'] = $messageId;
            $telegram->editMessageText($params);
        } else {
            $telegram->sendMessage($params);
        }
    }

}
