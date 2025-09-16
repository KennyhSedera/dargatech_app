<?php

namespace App\Services;

use App\Models\rapportMaintenances;
use App\Services\MaraicherService;
use App\Services\SendMessageService;
use App\Telegram\Commands\InstallationCommand;
use App\Telegram\Commands\InterventionCommand;
use App\Telegram\Commands\MaraicherCommand;
use App\Telegram\Commands\RapportMaintenanceCommand;
use DB;
use Log;
use SebastianBergmann\CodeCoverage\Report\Html\Dashboard;
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
    protected InterventionCommand $interventionCommand;
    protected InterventionService $interventionService;
    protected RapportMaintenanceCommand $rapportMaintenanceCommand;
    protected RapportMaintenanceService $rapportMaintenanceService;
    protected DashboardService $dashboardService;

    public function __construct(
        Api $telegram,
        NewMaraicherService $maraicherService,
        SendMessageService $sendMessageService,
        ListMaraicherService $listMaraicherService,
        MaraicherCommand $maraicherCommand,
        HelpCommand $helpCommand,
        InstallationCommand $installationCommand,
        ListInstallationService $listInstallationService,
        InterventionCommand $interventionCommand,
        RapportMaintenanceCommand $rapportMaintenanceCommand,
        InterventionService $interventionService,
        RapportMaintenanceService $rapportMaintenanceService,
        DashboardService $dashboardService
    ) {
        $this->telegram = $telegram;
        $this->maraicherService = $maraicherService;
        $this->sendMessage = $sendMessageService;
        $this->listMaraicherService = $listMaraicherService;
        $this->maraicherCommand = $maraicherCommand;
        $this->helpCommand = $helpCommand;
        $this->installationCommand = $installationCommand;
        $this->listInstallationService = $listInstallationService;
        $this->interventionCommand = $interventionCommand;
        $this->rapportMaintenanceCommand = $rapportMaintenanceCommand;
        $this->interventionService = $interventionService;
        $this->rapportMaintenanceService = $rapportMaintenanceService;
        $this->dashboardService = $dashboardService;
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

    public function handleInstallations($chatId)
    {
        $this->installationCommand->sendInstallationMenu($this->telegram, $chatId);
    }

    public function handleSendButtonNewIntsallation($chatId, $userId)
    {
        $this->listInstallationService->sendButtonNew($chatId, text: "🌱 Enregistrer une nouvelle installation \n\n Choississez une option :", userId: $userId, action: 'create_installation', route: 'telegram.installation.form', callack_data: 'new_installation');
    }

    public function handleSendButtonNewMaraichers($chatId, $userId)
    {
        $this->listInstallationService->sendButtonNew($chatId, text: "🌱 Enregistrer un nouveau maraîcher \n\n Choississez une option :", userId: $userId, action: 'create_maraicher', route: 'telegram.client.form', callack_data: 'new_maraicher');
    }

    public function handleSendButtonNewInterventions($chatId, $userId)
    {
        $this->listInstallationService->sendButtonNew($chatId, text: "🌱 Enregistrer une nouvelle intervention \n\n Choississez une option :", userId: $userId, action: 'create_intervention', route: 'telegram.intervention.form', callack_data: 'new_intervention');
    }

    public function handleSendButtonNewPapports($chatId, $userId)
    {
        $this->listInstallationService->sendButtonNew($chatId, text: "🌱 Enregistrer une nouvelle rapport intervention \n\n Choississez une option :", userId: $userId, action: 'create_rapport', route: 'telegram.rapport.form', callack_data: 'new_rapport_maintenance');
    }

    public function handleListInstallation($chatId)
    {
        $this->listInstallationService->showFullList($chatId);
    }

    public function handleIntervention($chatId)
    {
        $this->interventionCommand->sendInterventionMenu($this->telegram, $chatId);
    }

    public function handleRapportMaintenance($chatId)
    {
        $this->rapportMaintenanceCommand->sendRapportMaintenanceMenu($this->telegram, $chatId);
    }

    public function handleListFull($chatId)
    {
        $this->listMaraicherService->showFullList($chatId);
    }

    public function handleListInterventions($chatId)
    {
        $this->interventionService->showFullList($chatId);
    }

    public function handleListRapportsMaintenance($chatId)
    {
        $this->rapportMaintenanceService->showFullList($chatId);
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
            $searchCommands = ['search_maraicher', 'search_installation', 'search_intervention', 'search_rapport_maintenance'];
            $existingSession = DB::table('telegram_sessions')
                ->where('user_id', $userId)
                ->whereIn('command', $searchCommands)
                ->where('completed', false)
                ->first();

            $extractedCommand = '';
            if ($existingSession) {
                $extractedCommand = substr($existingSession->command, 7);
                $extractedCommand = str_replace('_', ' ', $extractedCommand);
            }

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
                "Vous avez déjà une session de *recherche {$extractedCommand}* active.\n\n" .
                "Veuillez compléter la session actuelle ou tapez /cancel pour l'annuler."
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

            case 'intervention':
                return $this->handleInterventionListPage($chatId, $page);

            case 'rapport':
                return $this->handleRapportListPage($chatId, $page);

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

    public function handleInterventionListPage($chatId, $page)
    {
        try {
            $interventions = DB::table('maintenances')
                ->leftJoin('installations', 'maintenances.installation_id', '=', 'installations.id')
                ->select(
                    'maintenances.*',
                    'installations.code_installation as installation_code',
                    'installations.numero_serie as installation_numero_serie',
                    'installations.source_eau'
                )
                ->orderBy('maintenances.created_at', 'desc')
                ->get();
            $this->interventionService->showPaginatedList($chatId, $interventions, (int) $page);
        } catch (\Exception $e) {
            $this->sendMessage->sendMessage(
                $chatId,
                "❌ Erreur lors de l'affichage de la page.",
                'Markdown'
            );
        }
    }

    public function handleRapportListPage($chatId, $page)
    {
        try {
            $rapports = rapportMaintenances::with('client', 'maintenance')
                ->whereHas('maintenance')
                ->orderBy('created_at', 'desc')
                ->get();
            $this->rapportMaintenanceService->showPaginatedList($chatId, $rapports, (int) $page);
        } catch (\Exception $e) {
            $this->sendMessage->sendMessage(
                $chatId,
                "❌ Erreur lors de l'affichage de la page.",
                'Markdown'
            );
        }
    }

    public function handlePaiement($chatId, $userId)
    {
        $this->listInstallationService->sendButtonNew($chatId, text: "🌱 Enregistrer une nouvelle paiement \n\n Choississez une option :", userId: $userId, action: 'create_paiement', route: 'telegram.paiement.form', callack_data: 'new_paiement');
    }

    public function handleGenerateRecu($chatId)
    {
        try {
            $existingSessionRecu = DB::table('telegram_sessions')
                ->where('chat_id', $chatId)
                ->where('command', 'generate_recu')
                ->where('completed', false)
                ->first();

            if (!$existingSessionRecu) {
                DB::table('telegram_sessions')->insert([
                    'user_id' => $chatId,
                    'chat_id' => $chatId,
                    'command' => 'generate_recu',
                    'step' => 'awaiting_recu',
                    'data' => json_encode([]),
                    'completed' => false,
                    'created_at' => now(),
                    'updated_at' => now()
                ]);

                $message = "🌱 Genérer un recu\nVeuillez entrer le numero du recu ou facture à générer: \n\n" .
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
                "❌ Session de generation de recu en cours.\nVeuillez  entrer le numero du recu ou facture à générer.\n\n" .
                "Tapez /cancel pour annuler à tout moment.",
                'Markdown'
            );
        } catch (\Throwable $th) {
            $this->sendMessage->sendMessage(
                $chatId,
                "❌ Erreur lors de la generation du recu.\n\n Veuillez  réessayer plus tard.",
                'Markdown'
            );
        }
    }

    public function handleDashboard($chatId)
    {
        $this->dashboardService->showDashboard($chatId);
    }
}

