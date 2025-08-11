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
    protected NewMaraicherService $maraicherService;
    protected SendMessageService $sendMessage;
    protected ListMaraicherService $listMaraicherService;
    protected MaraicherCommand $maraicherCommand;

    public function __construct(Api $telegram, NewMaraicherService $maraicherService, SendMessageService $sendMessageService, ListMaraicherService $listMaraicherService, MaraicherCommand $maraicherCommand)
    {
        $this->telegram = $telegram;
        $this->maraicherService = $maraicherService;
        $this->sendMessage = $sendMessageService;
        $this->listMaraicherService = $listMaraicherService;
        $this->maraicherCommand = $maraicherCommand;
    }

    public function handleCurrentPage($chatId)
    {
        return true;
    }

    public function handleMaraicher($chatId)
    {
        $this->maraicherCommand->sendMaraicherMenu($this->telegram, $chatId);
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

    public function handleNewInstallations($chatId, $userId){
        $existingSession = DB::table('telegram_sessions')
            ->where('user_id', $userId)
            ->where('command', 'new_installation')
            ->where('completed', false)
            ->first();

        if (!$existingSession) {
            DB::table('telegram_sessions')->insert([
                'user_id' => $userId,
                'chat_id' => $chatId,
                'command' => 'new_installation',
                'step' => 'client_id',
                'data' => json_encode([]),
                'completed' => false,
                'created_at' => now(),
                'updated_at' => now()
            ]);

            $this->sendMessage->sendMessage(
                $chatId,
                "🌱 *Enregistrement d'un nouveau installation*\n\nVeuillez entrer le *numero* du maraîcher :",
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
        $this->listMaraicherService->showFullList($chatId);
    }

    public function handleListPage($chatId, $page)
    {
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

    public function handleMainMenu($chatId)
    {
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

    // Ajoutez cette méthode dans votre CallBackService pour tester
    public function handleSearchMaraicher($chatId, $userId)
    {
        try {
            $existingSession = DB::table('telegram_sessions')
                ->where('user_id', $userId)
                ->where('command', '=', 'search_maraicher')
                ->where('completed', false)
                ->first();

            if (!$existingSession) {
                DB::table('telegram_sessions')->insert([
                    'user_id' => $userId,
                    'chat_id' => $chatId,
                    'command' => 'search_maraicher',
                    'step' => 'awaiting_search_term',
                    'data' => json_encode([]),
                    'completed' => false,
                    'created_at' => now(),
                    'updated_at' => now()
                ]);

                $message = "🔍 **Recherche de Maraîchers**\n\n" .
                        "Entrez les critères de recherche (nom, localisation, type de produits, etc.) :\n\n" .
                        "Exemple : _tomates Antananarivo_ ou _légumes bio Toamasina_\n\n" .
                        "Tapez /cancel pour annuler à tout moment.";

                $this->sendMessage->sendMessage(
                    $chatId,
                    $message,
                    'Markdown'
                );
                return;
            }

            $this->sendMessage->sendMessage(
                $chatId,
                "⚠️ **Session en cours**\n\n" .
                "Vous avez déjà une session de recherche active.\n\n" .
                "Veuillez compléter la session actuelle ou tapez /cancel pour l'annuler.",
                'Markdown'
            );

        } catch (\Exception $e) {
            \Log::error('Error in handleSearchMaraicher: ' . $e->getMessage(), [
                'user_id' => $userId,
                'chat_id' => $chatId,
                'trace' => $e->getTraceAsString()
            ]);

            $this->sendMessage->sendMessage(
                $chatId,
                "❌ Une erreur est survenue lors de l'initialisation de la recherche.\n\nVeuillez réessayer plus tard.",
                'Markdown'
            );
        }
    }
}

