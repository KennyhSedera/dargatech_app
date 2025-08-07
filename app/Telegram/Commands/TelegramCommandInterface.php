<?php
namespace App\Telegram\Commands;

interface TelegramCommandInterface
{
    /**
     * Traite la commande initiale (ex: callback button)
     */
    public function handle(int $chatId);

    /**
     * Traite une étape de session pour cette commande (formulaire pas à pas)
     */
    public function handleSessionStep(object $session, string $messageText, int $userId, int $chatId);
}
