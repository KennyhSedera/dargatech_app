<?php

namespace App\Telegram\Commands;

use Telegram\Bot\Api;
use Telegram\Bot\Commands\Command;
use Telegram\Bot\Keyboard\Keyboard;

class RapportMaintenanceCommand extends Command
{
    protected string $name = "rapport_maintenance";

    protected string $description = "Menu rapport maintenance 📋";

    public function handle()
    {
        $chatId = $this->getUpdate()->getMessage()->getChat()->getId();
        $this->sendRapportMaintenanceMenu($this->telegram, $chatId);
    }

    public function sendRapportMaintenanceMenu(Api $telegram, $chatId, $messageId = null)
    {
        $keyboard = Keyboard::make()
            ->inline()
            ->row([
                Keyboard::inlineButton(['text' => '➕ Nouveau Rapport', 'callback_data' => 'button_create_rapport_maintenance']),
                Keyboard::inlineButton(['text' => '📋 Liste Rapports', 'callback_data' => 'list_rapport_maintenance']),
            ])
            ->row([
                Keyboard::inlineButton(['text' => '🔍 Rechercher', 'callback_data' => 'search_rapport']),
            ]);

        $params = [
            'chat_id' => $chatId,
            'text' => '📋 <b>Menu Principal Rapport Maintenance</b> - Choisissez une action :',
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
