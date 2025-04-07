<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Telegram\Bot\Laravel\Facades\Telegram;
use App\Models\Paiement;
use App\Models\Intervention;
use Carbon\Carbon;

class TelegramRappelCommand extends Command
{
    protected $signature = 'telegram:rappel';
    protected $description = 'Envoie des rappels automatiques aux clients pour paiements et maintenance';

    public function handle()
    {
        // Rappel des paiements en retard
        $paiementsEnRetard = Paiement::where('date_paiement', '<', Carbon::now()->subMonths(3))->get();
        foreach ($paiementsEnRetard as $paiement) {
            Telegram::sendMessage([
                'chat_id' => $paiement->client->telegram_chat_id,
                'text' => "⚠️ Votre paiement de {$paiement->montant} est en retard. Merci de régulariser !"
            ]);
        }

        // Rappel des maintenances prévues
        $interventionsPrevues = Intervention::where('date', '>=', Carbon::now())->get();
        foreach ($interventionsPrevues as $intervention) {
            Telegram::sendMessage([
                'chat_id' => $intervention->installation->client->telegram_chat_id,
                'text' => "🔧 Une maintenance est prévue le {$intervention->date}."
            ]);
        }

        $this->info("Rappels envoyés !");
    }
}
