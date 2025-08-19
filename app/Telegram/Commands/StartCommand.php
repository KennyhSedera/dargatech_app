<?php
namespace App\Telegram\Commands;

use App\Services\SendMessageService;
use App\Telegram\Keyboard\StartKeyboard;
use Telegram\Bot\Commands\Command;

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
        $keyboard = StartKeyboard::getStartKeyboard();

        $sendMessage->sendMessageWithKeyboard(
            $chatId,
            "⚡ *SISAM - Système Avancé DargaTech*\n\n🎯 *Connexion établie avec succès !*\n\nVotre assistant intelligent est prêt.\n\n📋 *Menu principal* :",
            $keyboard,
            'Markdown'
        );
    }
}
