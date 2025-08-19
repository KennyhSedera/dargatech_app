<?php

namespace App\Telegram\Keyboard;

use Telegram\Bot\Keyboard\Keyboard;

class StartKeyboard
{
    public static function getStartKeyboard()
    {
        $keyboard = Keyboard::make()
            ->inline()
            ->row([
                Keyboard::inlineButton(params: ['text' => '👨‍🌾 Menu Maraîchers', 'callback_data' => 'maraicher']),
                Keyboard::inlineButton(['text' => '🏭 Menu Installation', 'callback_data' => 'installation']),
            ])
            ->row([
                Keyboard::inlineButton(['text' => '🔧 Menu Intervention', 'callback_data' => 'intervention']),
                Keyboard::inlineButton(['text' => '📋 Rapport Maintenance', 'callback_data' => 'rapport_maintenance']),
            ])
            ->row([
                Keyboard::inlineButton(['text' => '💰 Enregistrer Paiement', 'callback_data' => 'enregistrer_paiement']),
                Keyboard::inlineButton(['text' => '📄 Générer Reçu', 'callback_data' => 'generer_recu']),
            ])
            ->row([
                Keyboard::inlineButton(['text' => 'ℹ Obtenir de l\'aide', 'callback_data' => 'help']),
            ]);

        return $keyboard;
    }
}
