<?php

namespace App\Telegram\Commands;

use Telegram\Bot\Api;
use Telegram\Bot\Commands\Command;
use Telegram\Bot\Keyboard\Keyboard;

class InstallationCommand extends Command
{
    protected string $name = 'installation';
    protected string $description = 'Menu installation 🏭';

    public function handle()
    {
        $chatId = $this->getUpdate()->getMessage()->getChat()->getId();
        $this->sendInstallationMenu($this->telegram, $chatId);
    }

    public function sendInstallationMenu(Api $telegram, $chatId)
    {
        $keyboard = Keyboard::make()
            ->inline()
            ->row([
                Keyboard::inlineButton(['text' => '➕ Nouveau Installation', 'callback_data' => 'new_installation']),
                Keyboard::inlineButton(['text' => '🏭 Liste Installations', 'callback_data' => 'list_installation']),
            ])
            ->row([
                Keyboard::inlineButton(['text' => '🔍 Rechercher', 'callback_data' => 'search_installation']),
            ]);

        $telegram->sendMessage([
            'chat_id' => $chatId,
            'text' => '📋 <b>Menu Principal Installation</b> — Choisissez une action :',
            'reply_markup' => $keyboard,
            'parse_mode' => 'HTML',
        ]);
    }
}
