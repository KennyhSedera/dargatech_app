<?php

namespace App\Services;

use App\Models\rapportMaintenances;
use App\Services\SendMessageService;
use App\Telegram\Commands\HelpCommand;
use App\Telegram\Commands\InstallationCommand;
use App\Telegram\Commands\InterventionCommand;
use App\Telegram\Commands\MaraicherCommand;
use App\Telegram\Commands\RapportMaintenanceCommand;
use DB;
use Log;
use Telegram\Bot\Api;


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
    protected StepService $stepService;

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
        DashboardService $dashboardService,
        StepService $stepService,
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
        $this->stepService = $stepService;
    }

    public function handleCurrentPage($chatId)
    {
        return true;
    }

    public function handleMaraicher($chatId, $messageId = null)
    {
        $this->maraicherCommand->sendMaraicherMenu($this->telegram, $chatId, $messageId);
    }

    private function getExistingSession($chatId, $userId)
    {
        $this->stepService->initializeStepConfigurations();

        $existingSession = DB::table('telegram_sessions')
            ->where('user_id', $userId)
            ->where('completed', false)
            ->first();

        if ($existingSession) {
            $command = $existingSession->command;
            $step = $existingSession->step;

            $searchCommands = [
                'search_maraicher',
                'search_installation',
                'search_intervention',
                'search_rapport_maintenance'
            ];

            if (in_array($command, $searchCommands)) {
                $extractedCommand = ucfirst(str_replace('search_', '', $command));

                $this->sendMessage->sendMessage(
                    $chatId,
                    "⚠️ *Session en cours*\n\n" .
                    "Vous avez déjà une session de *recherche {$extractedCommand}* active.\n\n" .
                    "Veuillez compléter la session actuelle ou tapez /cancel pour l'annuler.",
                    'Markdown'
                );

                return $existingSession;
            }

            $commandsMap = [
                'new_maraicher' => 'Maraicher',
                'new_installation' => 'Installation',
                'new_intervention' => 'Intervention',
            ];

            $commandLabel = $commandsMap[$command] ?? ucfirst($command);

            $currentPrompt = $this->stepService->stepConfigurations[$command]['prompts'][$step]
                ?? "Complétez l'étape : {$step}";

            $this->sendMessage->sendMessage(
                $chatId,
                "⚠️ *Session en cours*\n\n" .
                "Vous avez déjà une session *d'enregistrement du nouveau {$commandLabel}* active. Tapez /cancel pour l' annuller ou \n\n" .
                "{$currentPrompt}\n",
                'Markdown'
            );
        }

        return $existingSession;
    }

    public function handleNewMaraicher($chatId, $userId)
    {
        $existingSession = $this->getExistingSession($chatId, $userId);
        if ($existingSession) {
            return;
        }
        if (!$existingSession) {
            DB::table('telegram_sessions')->insert([
                'user_id' => $userId,
                'chat_id' => $chatId,
                'command' => 'new_maraicher',
                'step' => 'data_maraicher',
                'data' => json_encode([]),
                'completed' => false,
                'created_at' => now(),
                'updated_at' => now()
            ]);

            $this->sendMessage->sendMessage(
                $chatId,
                "🌱 *Enregistrement d'un nouveau maraîcher*\n\nVeillez entrer les informations successivement : \n nom;\n prenom;\n telephone;\n email;\n CIN;\n genre (Homme/Femme);\n adress;\n  type_activite_agricole;\n surface_cultivee (en hectares);\n date_contrat (AAAA-MM-JJ) \n\n👤 *Par exemple:*\n nom example;\n prenom example;\n 03424...;\n example@gmail.com;\n 202...;\n Homme;\n Rue...;\n Légumes;\n 0.5;\n 2025-01-01",
                'Markdown'
            );
            return;
        }
    }

    public function handleNewInstallations($chatId, $userId)
    {
        $existingSession = $this->getExistingSession($chatId, $userId);
        if ($existingSession) {
            return;
        }
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

    public function handleNewIntervention($chatId, $userId)
    {
        $existingSession = $this->getExistingSession($chatId, $userId);
        if ($existingSession) {
            return;
        }
        if (!$existingSession) {
            DB::table('telegram_sessions')->insert([
                'user_id' => $userId,
                'chat_id' => $chatId,
                'command' => 'new_intervention',
                'step' => 'installation_id',
                'data' => json_encode([]),
                'completed' => false,
                'created_at' => now(),
                'updated_at' => now()
            ]);

            $this->sendMessage->sendMessage(
                $chatId,
                "🌱 *Enregistrement d'un nouveau Intervention*\n\n📦 Veuillez entrer la *code de l'installation * :",
                'Markdown'
            );
            return;
        }
    }

    public function handleNewRapportMaintenance($chatId, $userId)
    {
        $existingSession = $this->getExistingSession($chatId, $userId);
        if ($existingSession) {
            return;
        }
        if (!$existingSession) {
            DB::table('telegram_sessions')->insert([
                'user_id' => $userId,
                'chat_id' => $chatId,
                'command' => 'new_rapport_maintenance',
                'step' => 'maintenanceId',
                'data' => json_encode([]),
                'completed' => false,
                'created_at' => now(),
                'updated_at' => now()
            ]);

            $this->sendMessage->sendMessage(
                $chatId,
                "🌱 *Enregistrement d'un nouveau rapport de maintenance*\n\n📦 Veuillez entrer la *code de l'installation * :",
                'Markdown'
            );
            return;
        }
    }

    public function handleInstallations($chatId, $messageId = null)
    {
        $this->installationCommand->sendInstallationMenu($this->telegram, $chatId, $messageId);
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

    public function handleListInstallation($chatId, $messageId = null)
    {
        $this->listInstallationService->showFullList($chatId, $messageId);
    }

    public function handleIntervention($chatId, $messageId = null)
    {
        $this->interventionCommand->sendInterventionMenu($this->telegram, $chatId, $messageId);
    }

    public function handleRapportMaintenance($chatId, $messageId = null)
    {
        $this->rapportMaintenanceCommand->sendRapportMaintenanceMenu($this->telegram, $chatId, $messageId);
    }

    public function handleListFull($chatId, $messageId = null)
    {
        $this->listMaraicherService->showFullList($chatId, $messageId);
    }

    public function handleListInterventions($chatId, $messageId = null)
    {
        $this->interventionService->showFullList($chatId, $messageId);
    }

    public function handleListRapportsMaintenance($chatId, $messageId = null)
    {
        $this->rapportMaintenanceService->showFullList($chatId, $messageId);
    }

    public function handleHelp($chatId, $messageId = null)
    {
        $this->helpCommand->sendHelpMenu($this->telegram, $chatId, $messageId);
    }

    public function handleListDetailed($chatId, $messageId = null)
    {
        $this->listMaraicherService->showFullList($chatId, $messageId);
    }

    public function handleMaraicherListPage($chatId, $page, $messageId = null)
    {
        try {
            $this->listMaraicherService->showPaginatedList($chatId, null, (int) $page, $messageId);
        } catch (\Exception $e) {
            $message = "❌ Erreur lors de l'affichage de la page.";

            if ($messageId) {
                $this->sendMessage->editMessage($chatId, $messageId, $message, 'Markdown');
            } else {
                $this->sendMessage->sendMessage($chatId, $message, 'Markdown');
            }
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
        $existingSession = $this->getExistingSession($chatId, $userId);
        if ($existingSession) {
            return;
        }
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
                "⚠️ *Session en cours*\n\n" .
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

    public function handleEntityListPage($chatId, $entityType, $page, $messageId = null)
    {
        switch ($entityType) {
            case 'maraicher':
                return $this->handleMaraicherListPage($chatId, $page, $messageId);

            case 'installation':
                return $this->handleInstallationListPage($chatId, $page, $messageId);

            case 'intervention':
                return $this->handleInterventionListPage($chatId, $page, $messageId);

            case 'rapport':
                return $this->handleRapportListPage($chatId, $page, $messageId);

            default:
                Log::warning("Unknown entity type for pagination: {$entityType}");
                return $this->sendMessage->sendErrorMessage($chatId, "Type d'entité non reconnu");
        }
    }

    public function handleInstallationListPage($chatId, $page, $messageId = null)
    {
        try {
            $this->listInstallationService->showPaginatedList($chatId, null, (int) $page, $messageId);
        } catch (\Exception $e) {
            $message = "❌ Erreur lors de l'affichage de la page.";

            if ($messageId) {
                $this->sendMessage->editMessage($chatId, $messageId, $message, 'Markdown');
            } else {
                $this->sendMessage->sendMessage($chatId, $message, 'Markdown');
            }
        }
    }

    public function handleInterventionListPage($chatId, $page, $messageId = null)
    {
        try {
            $this->interventionService->showPaginatedList($chatId, null, (int) $page, $messageId);
        } catch (\Exception $e) {
            $message = "❌ Erreur lors de l'affichage de la page.";

            if ($messageId) {
                $this->sendMessage->editMessage($chatId, $messageId, $message, 'Markdown');
            } else {
                $this->sendMessage->sendMessage($chatId, $message, 'Markdown');
            }
        }
    }

    public function handleRapportListPage($chatId, $page, $messageId = null)
    {
        try {
            $this->rapportMaintenanceService->showPaginatedList($chatId, null, (int) $page, $messageId);
        } catch (\Exception $e) {
            $message = "❌ Erreur lors de l'affichage de la page.";

            if ($messageId) {
                $this->sendMessage->editMessage($chatId, $messageId, $message, 'Markdown');
            } else {
                $this->sendMessage->sendMessage($chatId, $message, 'Markdown');
            }
        }
    }

    public function handlePaiement($chatId, $userId, $messageId = null)
    {
        $this->listInstallationService->sendButtonNew($chatId, text: "🌱 Enregistrer une nouvelle paiement \n\n Choississez une option :", userId: $userId, action: 'create_paiement', route: 'telegram.paiement.form', callack_data: 'new_paiement', messageId: $messageId);
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
