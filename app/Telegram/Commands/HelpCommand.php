<?php

namespace App\Telegram\Commands;

use Telegram\Bot\Api;
use Telegram\Bot\Commands\Command;

class HelpCommand extends Command
{
    protected string $name = 'help';
    protected string $description = 'Affiche le menu d\'aide 🆘';

    public function handle()
    {
        $chatId = $this->getUpdate()->getMessage()->getChat()->getId();

        $this->sendHelpMenu($this->telegram, $chatId);
    }

    public function sendHelpMenu(Api $telegram, $chatId, $messageId = null)
    {
        $commands = [
            [
                'command' => 'start',
                'description' => 'Accueil du bot 🚀',
            ],
            [
                'command' => 'maraicher',
                'description' => 'Menu maraicher 👨‍🌾',
            ],
            [
                'command' => 'installation',
                'description' => 'Menu installation 🏭',
            ],
            [
                'command' => 'intervention',
                'description' => 'Menu intervention 📋',
            ],
            [
                'command' => 'rapport_maintenance',
                'description' => 'Rapport maintenance 📋',
            ],
            [
                'command' => 'enregistrer_paiement',
                'description' => 'Enregistrer paiement 💰',
            ],
            [
                'command' => 'generer_recu',
                'description' => 'Generer recu 📄',
            ],
            [
                'command' => 'cancel',
                'description' => 'Annuler une commande 🚫',
            ],
            [
                'command' => 'help',
                'description' => 'Obtenir de l\'aide 🆘',
            ],
        ];

        $helpText = "🆘 <b>Menu d'aide</b>\n\n📋 <b>Commandes disponibles :</b>\n\n";

        foreach ($commands as $cmd) {
            $helpText .= "/{$cmd['command']} - {$cmd['description']}\n";
        }

        $helpText .= "\n💡 <i>Tapez une commande pour commencer !</i>";

        $params = [
            'chat_id' => $chatId,
            'text' => $helpText,
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
