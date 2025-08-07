<?php

namespace App\Services;

use App\Services\MaraicherService;
use App\Services\SendMessageService;
use App\Telegram\Commands\MaraicherCommand;
use DB;
use Telegram\Bot\Api;
use Telegram\Bot\Keyboard\Keyboard;

class CallBackService
{
    protected Api $telegram;
    protected MaraicherService $maraicherService;
    protected SendMessageService $sendMessage;
    protected ListMaraicherService $listMaraicherService;
    protected MaraicherCommand $maraicherCommand;

    public function __construct(Api $telegram, MaraicherService $maraicherService, SendMessageService $sendMessageService, ListMaraicherService $listMaraicherService, MaraicherCommand $maraicherCommand)
    {
        $this->telegram = $telegram;
        $this->maraicherService = $maraicherService;
        $this->sendMessage = $sendMessageService;
        $this->listMaraicherService = $listMaraicherService;
        $this->maraicherCommand = $maraicherCommand;
    }

    public function handleMaraicher($chatId )
    {
        $this->maraicherCommand->sendMaraicherMenu( $this->telegram, $chatId);
    }

    public function handleNewMaraicher($chatId, $userId)
    {
        $existingSession = DB::table('telegram_sessions')
            ->where('user_id', $userId)
            ->where('command', 'new_maraicher')
            ->where('completed', false)
            ->first();

        if (!$existingSession) {
            DB::table('telegram_sessions')->insert([
                'user_id' => $userId,
                'chat_id' => $chatId,
                'command' => 'new_maraicher',
                'step' => 'nom',
                'data' => json_encode([]),
                'completed' => false,
                'created_at' => now(),
                'updated_at' => now()
            ]);

            $this->sendMessage->sendMessage(
                $chatId,
                "🌱 *Enregistrement d'un nouveau maraîcher*\n\nVeuillez entrer le *nom* du maraîcher :",
                'Markdown'
            );
            return;
        }

        $this->sendMessage->sendMessage(
            $chatId,
            "⚠️ Vous avez déjà une session d'enregistrement en cours.\n\nVeuillez compléter la session actuelle ou tapez /cancel pour l'annuler.",
            'Markdown'
        );
    }

    public function handleNewInstallation($chatId)
    {
        $this->sendMessage->sendMessage(
            $chatId,
            "🔧 *Nouvelle Installation*\n\nFonctionnalité en cours de développement...",
            'Markdown'
        );
    }


    public function handleNewIntervention($chatId)
    {
        // Logique pour nouvelle intervention
        $this->sendMessage->sendMessage(
            $chatId,
            "🛠️ *Nouvelle Intervention*\n\nFonctionnalité en cours de développement...",
            'Markdown'
        );
    }

    public function handleRapportMaintenance($chatId)
    {
        $this->sendMessage->sendMessage(
            $chatId,
            "📋 *Rapport de Maintenance*\n\nFonctionnalité en cours de développement...",
            'Markdown'
        );
    }

    public function handlePaiement($chatId)
    {
        $this->sendMessage->sendMessage(
            $chatId,
            "💳 *Paiement*\n\nFonctionnalité en cours de développement...",
            'Markdown'
        );
    }

    public function handleRecu($chatId)
    {
        $this->sendMessage->sendMessage(
            $chatId,
            "🧾 *Reçu*\n\nFonctionnalité en cours de développement...",
            'Markdown'
        );
    }

    public function handleHistorique($chatId)
    {
        $this->sendMessage->sendMessage(
            $chatId,
            "📚 *Historique*\n\nFonctionnalité en cours de développement...",
            'Markdown'
        );
    }

    public function handleRecherche($chatId)
    {
        $this->sendMessage->sendMessage(
            $chatId,
            "🔍 *Recherche*\n\nFonctionnalité en cours de développement...",
            'Markdown'
        );
    }

    public function handleAide($chatId)
    {
        // Logique pour aide
        $this->sendMessage->sendMessage(
            $chatId,
            "❓ *Aide*\n\nFonctionnalité en cours de développement...",
            'Markdown'
        );
    }


    public function handleListFull($chatId)
    {
        $this->listMaraicherService->showFullList($chatId);
    }

    public function handleListSummary($chatId)
    {
        $this->listMaraicherService->showSummary($chatId);
    }

    public function handleListDetailed($chatId)
    {
        // Pour une vue détaillée, on peut utiliser la même méthode mais avec plus d'infos
        $this->listMaraicherService->showFullList($chatId);
    }

    public function handleListPage($chatId, $page)
    {
        // Récupérer tous les maraîchers et afficher la page demandée
        try {
            $maraichers = DB::table('clients')->orderBy('created_at', 'desc')->get();
            $this->listMaraicherService->showPaginatedList($chatId, $maraichers, (int)$page);
        } catch (\Exception $e) {
            $this->sendMessage->sendMessage(
                $chatId,
                "❌ Erreur lors de l'affichage de la page.",
                'Markdown'
            );
        }
    }

    public function handleSearchMaraicher($chatId, $userId)
    {
        // Créer une session de recherche
        DB::table('telegram_sessions')->updateOrInsert(
            [
                'user_id' => $userId,
                'command' => 'search_maraicher',
                'completed' => false
            ],
            [
                'chat_id' => $chatId,
                'step' => 'awaiting_search_term',
                'data' => json_encode([]),
                'created_at' => now(),
                'updated_at' => now()
            ]
        );

        $this->sendMessage->sendMessage(
            $chatId,
            "🔍 *Recherche de Maraîcher*\n\nVeuillez entrer le terme à rechercher :\n\n• Nom ou prénom\n• Localisation\n• Numéro de téléphone\n\nTapez /cancel pour annuler la recherche.",
            'Markdown'
        );
    }

    public function handleMainMenu($chatId)
    {
        // Afficher le menu principal
        $keyboard = Keyboard::make()
            ->row([
                Keyboard::inlineButton(['text' => '👨‍🌾 Nouveau Maraîcher', 'callback_data' => 'new_maraicher']),
                Keyboard::inlineButton(['text' => '📋 Liste Maraîchers', 'callback_data' => 'list_full'])
            ])
            ->row([
                Keyboard::inlineButton(['text' => '🔧 Installation', 'callback_data' => 'new_installation']),
                Keyboard::inlineButton(['text' => '🛠️ Intervention', 'callback_data' => 'new_intervention'])
            ])
            ->row([
                Keyboard::inlineButton(['text' => '📊 Maintenance', 'callback_data' => 'rapport_maintenance']),
                Keyboard::inlineButton(['text' => '💳 Paiement', 'callback_data' => 'paiement'])
            ])
            ->row([
                Keyboard::inlineButton(['text' => '🔍 Rechercher', 'callback_data' => 'search_maraicher']),
                Keyboard::inlineButton(['text' => '❓ Aide', 'callback_data' => 'aide'])
            ]);

        $this->sendMessage->sendMessageWithKeyboard(
            $chatId,
            "🏠 *Menu Principal*\n\nChoisissez une action :",
            $keyboard,
            'Markdown'
        );
    }

    public function sendUnknownCommand($chatId)
    {
        $this->sendMessage->sendMessage(
            $chatId,
            "❌ Commande inconnue. Veuillez utiliser le menu principal.",
            'Markdown'
        );
    }

}
