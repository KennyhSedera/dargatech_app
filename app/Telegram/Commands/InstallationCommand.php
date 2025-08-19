<?php

namespace App\Telegram\Commands;

use Log;
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
        $userId = $this->getUpdate()->getMessage()->getFrom()->getId();

        $this->sendInstallationMenu($this->telegram, $chatId, $userId);
    }

    public function sendInstallationMenu(Api $telegram, $chatId, $userId = null)
    {
        if ($userId === null) {
            $userId = $this->getUserIdFromContext($chatId);
        }

        $secureToken = $this->generateSecureToken($userId, 'create_installation', $chatId);

        $keyboard = Keyboard::make()
            ->inline()
            ->row([
                Keyboard::inlineButton([
                    'text' => '➕ Nouveau Installation',
                    'url' => route('telegram.installation.form', ['token' => $secureToken])
                ]),
                Keyboard::inlineButton([
                    'text' => '🏭 Liste Installations',
                    'callback_data' => 'list_installation'
                ]),
            ])
            ->row([
                Keyboard::inlineButton([
                    'text' => '🔍 Rechercher',
                    'callback_data' => 'search_installation'
                ]),
            ]);

        $telegram->sendMessage([
            'chat_id' => $chatId,
            'text' => "🏭 <b>Menu Principal Installation</b>\n\n" .
                "📋 Choisissez une action :",
            'reply_markup' => $keyboard,
            'parse_mode' => 'HTML',
        ]);
    }

    private function generateSecureToken($userId, $action, $chatId)
    {
        $payload = [
            'user_id' => $userId,
            'chat_id' => $chatId,
            'action' => $action,
            'created_at' => now()->timestamp,
            'expires_at' => now()->addHours(2)->timestamp,
            'random' => bin2hex(random_bytes(16)),
            'source' => 'telegram_command'
        ];

        return encrypt(json_encode($payload));
    }
}
