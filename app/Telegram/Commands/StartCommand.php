<?php
namespace App\Telegram\Commands;

use App\Services\SendMessageService;
use Telegram\Bot\Commands\Command;
use Telegram\Bot\Keyboard\Keyboard;

class StartCommand extends Command
{
    protected string $name = 'start';
    protected string $description = 'Afficher le menu principal';



    public function handle()
    {
        $sendMessage = app(SendMessageService::class);
        $chatId = $this->getUpdate()->getMessage()->getChat()->getId();

        $keyboard = Keyboard::make()
            ->inline()
            ->row([
                Keyboard::inlineButton(['text' => '👨‍🌾 Menu Maraîchers', 'callback_data' => 'maraicher']),
                Keyboard::inlineButton(['text' => '🏭 Nouvelle Installation', 'callback_data' => 'new_installation']),
            ])
            ->row([
                Keyboard::inlineButton(['text' => '🔧 Nouvelle Intervention', 'callback_data' => 'new_intervention']),
                Keyboard::inlineButton(['text' => '📋 Rapport Maintenance', 'callback_data' => 'rapport_maintenance']),
            ])
            ->row([
                Keyboard::inlineButton(['text' => '💰 Enregistrer Paiement', 'callback_data' => 'enregistrer_paiement']),
                Keyboard::inlineButton(['text' => '📄 Générer Reçu', 'callback_data' => 'generer_recu']),
            ])
            ->row([
                Keyboard::inlineButton(['text' => '📊 Mes Interventions', 'callback_data' => 'mes_interventions']),
                Keyboard::inlineButton(['text' => '🔍 Rechercher Installation', 'callback_data' => 'rechercher_installation']),
            ])
            ->row([
                Keyboard::inlineButton(['text' => '🏠 Menu Principal', 'callback_data' => 'main_menu']),
                Keyboard::inlineButton(['text' => 'ℹ Aide', 'callback_data' => 'help']),
            ]);

        $sendMessage->sendMessageWithKeyboard(
            $chatId,
            "⚡ *SISAM - Système Avancé DargaTech*\n\n🎯 *Connexion établie avec succès !*\n\nVotre assistant intelligent est prêt.\n\n📋 *Menu principal* :",
            $keyboard,
            'Markdown'
        );
    }
}
