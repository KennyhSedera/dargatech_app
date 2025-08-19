<?php

namespace App\Services;

use App\Services\MaraicherService;
use App\Services\SendMessageService;
use App\Telegram\Commands\InstallationCommand;
use App\Telegram\Commands\MaraicherCommand;
use DB;
use Log;
use Telegram\Bot\Api;
use Telegram\Bot\Commands\HelpCommand;
use Telegram\Bot\Keyboard\Keyboard;

class CallBackService
{
    protected Api $telegram;
    protected NewMaraicherService $maraicherService;
    protected SendMessageService $sendMessage;
    protected ListMaraicherService $listMaraicherService;
    protected MaraicherCommand $maraicherCommand;
    protected HelpCommand $helpCommand;
    protected InstallationCommand $installationCommand;
    protected ListInstallationService $listInstallationService;

    public function __construct(
        Api $telegram,
        NewMaraicherService $maraicherService,
        SendMessageService $sendMessageService,
        ListMaraicherService $listMaraicherService,
        MaraicherCommand $maraicherCommand,
        HelpCommand $helpCommand,
        InstallationCommand $installationCommand,
        ListInstallationService $listInstallationService,
    ) {
        $this->telegram = $telegram;
        $this->maraicherService = $maraicherService;
        $this->sendMessage = $sendMessageService;
        $this->listMaraicherService = $listMaraicherService;
        $this->maraicherCommand = $maraicherCommand;
        $this->helpCommand = $helpCommand;
        $this->installationCommand = $installationCommand;
        $this->listInstallationService = $listInstallationService;
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

    public function handleNewInstallations($chatId, $userId)
    {
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

    public function handleInstallations($chatId, $userId)
    {
        $this->installationCommand->sendInstallationMenu($this->telegram, $chatId, $userId);
    }

    public function handleListInstallation($chatId)
    {
        $this->listInstallationService->showFullList($chatId);
    }

    public function handleListFull($chatId)
    {
        $this->listMaraicherService->showFullList($chatId);
    }

    public function handleHelp($chatId)
    {
        $command = $this->helpCommand->getAllCommandsText();
        $this->sendMessage->sendMessage(
            $chatId,
            $command,
            'Markdown'
        );
    }

    public function handleListDetailed($chatId)
    {
        $this->listMaraicherService->showFullList($chatId);
    }

    public function handleMaraicherListPage($chatId, $page)
    {
        try {
            $maraichers = DB::table('clients')->orderBy('created_at', 'desc')->get();
            $this->listMaraicherService->showPaginatedList($chatId, $maraichers, (int) $page);
        } catch (\Exception $e) {
            $this->sendMessage->sendMessage(
                $chatId,
                "❌ Erreur lors de l'affichage de la page.",
                'Markdown'
            );
        }
    }


    public function sendUnknownCommand($chatId)
    {
        $this->sendMessage->sendMessage(
            $chatId,
            "❌ Commande inconnue. Veuillez utiliser le menu principal.",
            'Markdown'
        );
    }

    public function handleSearch($chatId, $userId, $command = 'search_maraicher', $name = 'name')
    {
        try {
            $existingSession = DB::table('telegram_sessions')
                ->where('user_id', $userId)
                ->where('command', '=', $command)
                ->where('completed', false)
                ->first();

            if (!$existingSession) {
                DB::table('telegram_sessions')->insert([
                    'user_id' => $userId,
                    'chat_id' => $chatId,
                    'command' => $command,
                    'step' => 'awaiting_search_term',
                    'data' => json_encode([]),
                    'completed' => false,
                    'created_at' => now(),
                    'updated_at' => now()
                ]);

                $message = "🔍 **Recherche {$name} **\n\n" .
                    "Entrez les critères de recherche :\n\n" .
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
                "Vous avez déjà une session de *recherche* active.\n\n" .
                "Veuillez compléter la session actuelle ou tapez /cancel pour l'annuler.",
                'Markdown'
            );

        } catch (\Exception $e) {
            Log::error('Error in handleSearchMaraicher: ' . $e->getMessage(), [
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

    public function handleEntityListPage($chatId, $entityType, $page)
    {
        switch ($entityType) {
            case 'maraicher':
                return $this->handleMaraicherListPage($chatId, $page);

            case 'installation':
                return $this->handleInstallationListPage($chatId, $page);

            // case 'client':
            //     return $this->handleClientListPage($chatId, $page);

            // case 'commande':
            //     return $this->handleCommandeListPage($chatId, $page);

            default:
                Log::warning("Unknown entity type for pagination: {$entityType}");
                return $this->sendMessage->sendErrorMessage($chatId, "Type d'entité non reconnu");
        }
    }

    public function handleInstallationListPage($chatId, $page)
    {
        try {
            $installations = DB::table('installations')->orderBy('created_at', 'desc')->get();
            $this->listInstallationService->showPaginatedList($chatId, $installations, (int) $page);
        } catch (\Exception $e) {
            $this->sendMessage->sendMessage(
                $chatId,
                "❌ Erreur lors de l'affichage de la page.",
                'Markdown'
            );
        }
    }
}

