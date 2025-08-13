<?php
namespace App\Telegram\Commands;

use App\Services\SendMessageService;
use Telegram\Bot\Commands\Command;
use Telegram\Bot\Keyboard\Keyboard;

class StartCommand extends Command
{
    protected string $name = 'start';
    protected string $description = 'Afficher le menu principal 🏠';



    public function handle()
    {
        $chatId = $this->getUpdate()->getMessage()->getChat()->getId();

        return $this->handleKeyboardMenu($chatId);
    }

    public function handleKeyboardMenu($chatId)
    {
        $sendMessage = app(SendMessageService::class);
        $keyboard = Keyboard::make()
            ->inline()
            ->row([
                Keyboard::inlineButton(['text' => '👨‍🌾 Menu Maraîchers', 'callback_data' => 'maraicher']),
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

        $sendMessage->sendMessageWithKeyboard(
            $chatId,
            "⚡ *SISAM - Système Avancé DargaTech*\n\n🎯 *Connexion établie avec succès !*\n\nVotre assistant intelligent est prêt.\n\n📋 *Menu principal* :",
            $keyboard,
            'Markdown'
        );
    }
}
