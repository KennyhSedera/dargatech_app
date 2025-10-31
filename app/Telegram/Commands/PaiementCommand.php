<?php

namespace App\Telegram\Commands;

use App\Services\ListInstallationService;
use Telegram\Bot\Commands\Command;

class PaiementCommand extends Command
{
    protected string $name = 'enregistrer_paiement';
    protected string $description = 'Commande de paiement 📋';

    public function handle()
    {
        $chatId = $this->getUpdate()->getMessage()->getChat()->getId();
        $userId = $this->getUpdate()->getMessage()->getFrom()->getId();

        $listInstallationService = app(ListInstallationService::class);

        return $listInstallationService->sendButtonNew($chatId, text: "🌱 Enregistrer une nouvelle paiement \n\n Choississez une option :", userId: $userId, action: 'create_paiement', route: 'telegram.paiement.form', callack_data: 'new_paiement');

    }


}
