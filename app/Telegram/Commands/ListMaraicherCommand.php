<?php

namespace App\Telegram\Commands;

use DB;
use Log;
use Telegram\Bot\Commands\Command;
use Telegram\Bot\Keyboard\Keyboard;

class ListMaraicherCommand extends Command
{
    protected string $name = 'list_maraicher';
    protected string $description = 'Liste des Maraîchers enregistrés';

    public function handle()
    {
        try {
            // Récupérer tous les maraîchers
            $maraichers = DB::table('clients')->get();

            if ($maraichers->isEmpty()) {
                $this->replyWithMessage([
                    'text' => "📋 *Liste des Maraîchers*\n\n❌ Aucun maraîcher enregistré pour le moment.\n\nUtilisez /start pour accéder au menu principal et ajouter un nouveau maraîcher.",
                    'parse_mode' => 'Markdown',
                ]);
                return;
            }

            // Construire le message avec la liste des maraîchers
            $message = "📋 *Liste des Maraîchers Enregistrés*\n";
            $message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

            foreach ($maraichers as $index => $maraicher) {
                $numero = $index + 1;
                $message .= "👨‍🌾 *#{$numero} - {$maraicher->prenom} {$maraicher->nom}*\n";
                $message .= "📍 *Localisation:* {$maraicher->localisation}\n";
                $message .= "📞 *Téléphone:* {$maraicher->telephone}\n";
                $message .= "📧 *Email:* {$maraicher->email}\n";
                $message .= "🌱 *Activité:* {$maraicher->type_activite_agricole}\n";
                $message .= "📐 *Surface:* {$maraicher->surface_cultivee} ha\n";
                $message .= "👤 *Genre:* {$maraicher->genre}\n";
                $message .= "📄 *CIN:* {$maraicher->CIN}\n";
                $message .= "📅 *Date contrat:* " . date('d/m/Y', strtotime($maraicher->date_contrat)) . "\n";
                $message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
            }

            $totalMaraichers = $maraichers->count();
            $message .= "📊 *Total:* {$totalMaraichers} maraîcher(s) enregistré(s)\n\n";
            $message .= "💡 *Astuce:* Utilisez /start pour retourner au menu principal";

            // Si le message est trop long, le diviser en plusieurs messages
            if (strlen($message) > 4096) {
                $this->sendLongMessage($maraichers);
            } else {
                $this->replyWithMessage([
                    'text' => $message,
                    'parse_mode' => 'Markdown',
                ]);
            }

            // Ajouter un clavier pour navigation rapide
            $keyboard = Keyboard::make()
                ->row([
                    Keyboard::inlineButton(['text' => '🏠 Menu Principal', 'callback_data' => 'main_menu']),
                    Keyboard::inlineButton(['text' => '➕ Nouveau Maraîcher', 'callback_data' => 'new_maraicher'])
                ])
                ->row([
                    Keyboard::inlineButton(['text' => '🔍 Rechercher', 'callback_data' => 'recherche']),
                    Keyboard::inlineButton(['text' => '📊 Statistiques', 'callback_data' => 'statistiques'])
                ]);

            $this->replyWithMessage([
                'text' => "🎯 *Actions disponibles:*",
                'parse_mode' => 'Markdown',
                'reply_markup' => $keyboard
            ]);

            Log::info('Liste des Maraîchers affichée avec succès', [
                'total_maraichers' => $totalMaraichers,
                'user_id' => $this->getUpdate()->getMessage()->getFrom()->getId()
            ]);

        } catch (\Exception $e) {
            Log::error('Erreur lors de l\'affichage de la liste des maraîchers: ' . $e->getMessage());

            $this->replyWithMessage([
                'text' => "❌ *Erreur*\n\nUne erreur s'est produite lors de la récupération de la liste des maraîchers.\n\nVeuillez réessayer plus tard ou contacter l'administrateur.",
                'parse_mode' => 'Markdown',
            ]);
        }
    }

    /**
     * Envoyer un message long en le divisant en plusieurs parties
     */
    private function sendLongMessage($maraichers)
    {
        $messagesPerBatch = 5; // Nombre de maraîchers par message
        $totalMaraichers = $maraichers->count();
        $batches = $maraichers->chunk($messagesPerBatch);

        foreach ($batches as $batchIndex => $batch) {
            $message = "📋 *Liste des Maraîchers* (Partie " . ($batchIndex + 1) . "/" . $batches->count() . ")\n";
            $message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

            foreach ($batch as $index => $maraicher) {
                $numero = ($batchIndex * $messagesPerBatch) + $index + 1;
                $message .= "👨‍🌾 *#{$numero} - {$maraicher->prenom} {$maraicher->nom}*\n";
                $message .= "📍 *Localisation:* {$maraicher->localisation}\n";
                $message .= "📞 *Téléphone:* {$maraicher->telephone}\n";
                $message .= "📧 *Email:* {$maraicher->email}\n";
                $message .= "🌱 *Activité:* {$maraicher->type_activite_agricole}\n";
                $message .= "📐 *Surface:* {$maraicher->surface_cultivee} ha\n";
                $message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
            }

            if ($batchIndex === $batches->count() - 1) {
                $message .= "📊 *Total:* {$totalMaraichers} maraîcher(s) enregistré(s)";
            }

            $this->replyWithMessage([
                'text' => $message,
                'parse_mode' => 'Markdown',
            ]);

            // Petite pause entre les messages pour éviter le spam
            usleep(500000); // 0.5 secondes
        }
    }
}
