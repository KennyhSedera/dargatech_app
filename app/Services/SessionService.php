<?php

namespace App\Services;

use App\Services\ListMaraicherService;
use App\Services\MaraicherService;
use App\Services\SendMessageService;
use DB;
use Illuminate\Support\Facades\Log;

class SessionService
{
    protected SendMessageService $sendMessage;
    protected NewMaraicherService $maraicherService;
    protected ListMaraicherService $listMaraicherService;
    protected NewInstallationService $newInstallationService;
    protected ListInstallationService $listInstallationService;
    protected SearchServices $searchServices;
    protected PaiementService $paiementService;
    protected InterventionService $interventionService;
    protected RapportMaintenanceService $rapportMaintenanceService;

    public function __construct(
        SendMessageService $sendMessage,
        NewMaraicherService $maraicherService,
        ListMaraicherService $listMaraicherService,
        NewInstallationService $newInstallationService,
        ListInstallationService $listInstallationService,
        SearchServices $searchServices,
        PaiementService $paiementService,
        InterventionService $interventionService,
        RapportMaintenanceService $rapportMaintenanceService,
    ) {
        $this->sendMessage = $sendMessage;
        $this->maraicherService = $maraicherService;
        $this->listMaraicherService = $listMaraicherService;
        $this->newInstallationService = $newInstallationService;
        $this->listInstallationService = $listInstallationService;
        $this->searchServices = $searchServices;
        $this->paiementService = $paiementService;
        $this->interventionService = $interventionService;
        $this->rapportMaintenanceService = $rapportMaintenanceService;
    }

    public function handleActiveSession($activeSession, $messageText, $userId, $chatId)
    {
        try {
            $data = json_decode($activeSession->data, true) ?? [];

            switch ($activeSession->command) {
                case 'new_maraicher':
                    $this->handleNewMaraicherSession($activeSession, $messageText, $data, $userId, $chatId);
                    break;

                case 'new_installation':
                    $this->handleNewInstallationSession($activeSession, $messageText, $data, $userId, $chatId);
                    break;

                case 'new_intervention':
                    $this->handleNewInterventionSession($activeSession, $messageText, $data, $userId, $chatId);
                    break;

                case 'new_rapport_maintenance':
                    $this->handleNewRapportMaintenanceSession($activeSession, $messageText, $data, $userId, $chatId);
                    break;

                case 'search_installation':
                    $this->handleSearchSession($activeSession, $messageText, $data, $userId, $chatId);
                    break;

                case 'search_maraicher':
                    $this->handleSearchSession($activeSession, $messageText, $data, $userId, $chatId);
                    break;

                case 'search_intervention':
                    $this->handleSearchSession($activeSession, $messageText, $data, $userId, $chatId);
                    break;

                case 'search_rapport':
                    $this->handleSearchSession($activeSession, $messageText, $data, $userId, $chatId);
                    break;

                case 'generate_recu':
                    $this->handleGenerateRecuSession($messageText, $userId, $chatId);
                    break;

                default:
                    $this->sendMessage->sendMessage($chatId, "❌ Session inconnue. Utilisez /cancel pour annuler.");
                    $this->cancelSession($userId, $activeSession->command);
                    break;
            }
        } catch (\Exception $e) {
            Log::error('Error in handleActiveSession: ' . $e->getMessage(), [
                'user_id' => $userId,
                'chat_id' => $chatId,
                'session_command' => $activeSession->command ?? 'unknown',
                'trace' => $e->getTraceAsString()
            ]);

            $this->sendMessage->sendMessage(
                $chatId,
                "❌ Une erreur est survenue. Votre session a été annulée.\n\nVeuillez réessayer avec la commande appropriée."
            );

            $this->cancelSession($userId, $activeSession->command ?? '');
        }
    }

    private function handleNewMaraicherSession($activeSession, $messageText, $data, $userId, $chatId)
    {
        $this->maraicherService->handleStep($activeSession->step, $messageText, $data, $userId, $chatId);
    }

    private function handleNewInstallationSession($activeSession, $messageText, $data, $userId, $chatId)
    {
        $this->newInstallationService->handleStep($activeSession->step, $messageText, $data, $userId, $chatId);
    }

    private function handleNewInterventionSession($activeSession, $messageText, $data, $userId, $chatId)
    {
        $this->interventionService->handleStep($activeSession->step, $messageText, $data, $userId, $chatId);
    }

    public function handleNewRapportMaintenanceSession($activeSession, $messageText, $data, $userId, $chatId)
    {
        $this->rapportMaintenanceService->handleStep($activeSession->step, $messageText, $data, $userId, $chatId);
    }

    private function handleSearchSession($activeSession, $messageText, $data, $userId, $chatId)
    {
        if ($activeSession->step === 'awaiting_search_term') {
            $entityType = $this->searchServices->extractEntityType($activeSession->command);
            $this->searchServices->processSearchTerm($messageText, $userId, $chatId, $entityType);
        } else {
            $this->sendMessage->sendMessage(
                $chatId,
                "❌ Étape de recherche inconnue. Utilisez /cancel pour annuler."
            );
            $this->cancelSession($userId, $activeSession->command);
        }
    }

    private function handleGenerateRecuSession($messageText, $userId, $chatId)
    {
        $this->paiementService->handleGenerateRecu($messageText, $userId, $chatId);
    }
    public function cancelSession($userId, $command)
    {
        try {
            DB::table('telegram_sessions')
                ->where('user_id', $userId)
                ->where('command', $command)
                ->where('completed', false)
                ->delete();
        } catch (\Exception $e) {
            Log::error('Error canceling session: ' . $e->getMessage(), [
                'user_id' => $userId,
                'command' => $command
            ]);
        }
    }

    public function cancelAllUserSessions($userId, $chatId)
    {
        try {
            $canceledCount = DB::table('telegram_sessions')
                ->where('user_id', $userId)
                ->where('completed', false)
                ->delete();

            if ($canceledCount > 0) {
                $this->sendMessage->sendMessage(
                    $chatId,
                    "✅ Session(s) annulée(s) avec succès."
                );

                Log::info('User sessions canceled', [
                    'user_id' => $userId,
                    'canceled_count' => $canceledCount
                ]);
            } else {
                $this->sendMessage->sendMessage(
                    $chatId,
                    "ℹ️ Aucune session active à annuler."
                );
            }

            return $canceledCount;

        } catch (\Exception $e) {
            Log::error('Error canceling all sessions: ' . $e->getMessage(), [
                'user_id' => $userId,
                'chat_id' => $chatId,
                'trace' => $e->getTraceAsString()
            ]);

            $this->sendMessage->sendMessage(
                $chatId,
                "❌ Erreur lors de l'annulation des sessions."
            );

            return false;
        }
    }

    public function cleanupOldSessions($hoursOld = 24)
    {
        try {
            $deleted = DB::table('telegram_sessions')
                ->where('created_at', '<', now()->subHours($hoursOld))
                ->where('completed', operator: false)
                ->delete();

            if ($deleted > 0) {
                Log::info("Cleaned up $deleted old sessions");
            }

            return $deleted;
        } catch (\Exception $e) {
            Log::error('Error cleaning up old sessions: ' . $e->getMessage());
            return false;
        }
    }

    public function cleanupSessionsSuccess($hoursOld = 72, $userId)
    {
        $cutoff = now()->subHours((int) $hoursOld)->toDateTimeString();

        try {
            $deleted = DB::table('telegram_sessions')
                ->where('created_at', '<', $cutoff)
                ->where('user_id', $userId)
                ->where('completed', 1)
                ->delete();

            if ($deleted > 0) {
                Log::info("Cleaned up $deleted old sessions");
            }

            return $deleted;
        } catch (\Exception $e) {
            Log::error('Error cleaning up old sessions: ' . $e->getMessage());
            return false;
        }
    }

}
