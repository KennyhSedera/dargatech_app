<?php

namespace App\Telegram\Commands;

use Telegram\Bot\Api;
use Telegram\Bot\Commands\Command;
use Telegram\Bot\Keyboard\Keyboard;

class InterventionCommand extends Command
{
    protected string $name = "intervention";

    protected string $description = "Menu intervention 📋";

    public function handle()
    {
        $chatId = $this->getUpdate()->getMessage()->getChat()->getId();
        $this->sendInterventionMenu($this->telegram, $chatId);
    }

    public function sendInterventionMenu(Api $telegram, $chatId)
    {
        $keyboard = Keyboard::make()
            ->inline()
            ->row([
                Keyboard::inlineButton(['text' => '➕ Nouvelle Intervention', 'callback_data' => 'button_create_intervention']),
                Keyboard::inlineButton(['text' => '🔧 Liste Interventions', 'callback_data' => 'list_interventions']),
            ])
            ->row([
                Keyboard::inlineButton(['text' => '🔍 Rechercher', 'callback_data' => 'search_intervention']),
            ]);
        $telegram->sendMessage([
            'chat_id' => $chatId,
            'text' => '📋 <b>Menu Principal Intervention</b> — Choisissez une action :',
            'reply_markup' => $keyboard,
            'parse_mode' => 'HTML',
        ]);
    }

}
