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

    public function __construct(
        SendMessageService $sendMessage,
        NewMaraicherService $maraicherService,
        ListMaraicherService $listMaraicherService,
        NewInstallationService $newInstallationService
    ) {
        $this->sendMessage = $sendMessage;
        $this->maraicherService = $maraicherService;
        $this->listMaraicherService = $listMaraicherService;
        $this->newInstallationService = $newInstallationService;
    }

    public function handleActiveSession($activeSession, $messageText, $userId, $chatId)
    {
        try {
            $data = json_decode($activeSession->data, true) ?? [];

            switch ($activeSession->command) {
                case 'new_maraicher':
                    $this->handleNewMaraicherSession($activeSession, $messageText, $data, $userId, $chatId);
                    break;

                case 'search_maraicher':
                    $this->handleSearchSession($activeSession, $messageText, $data, $userId, $chatId);
                    break;

                case 'new_installation':
                    $this->handleNewInstallationSession($activeSession, $messageText, $data, $userId, $chatId);
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

    private function handleSearchSession($activeSession, $messageText, $data, $userId, $chatId)
    {
        if ($activeSession->step === 'awaiting_search_term') {
            $this->processSearchTerm($messageText, $userId, $chatId);
        } else {
            $this->sendMessage->sendMessage(
                $chatId,
                "❌ Étape de recherche inconnue. Utilisez /cancel pour annuler."
            );
            $this->cancelSession($userId, 'search_maraicher');
        }
    }

    private function processSearchTerm($messageText, $userId, $chatId)
    {
        try {
            $searchTerm = $this->sanitizeSearchTerm($messageText);

            $validation = $this->validateSearchTerm($searchTerm);
            if (!$validation['valid']) {
                $this->sendMessage->sendMessage($chatId, $validation['message']);
                return;
            }

            $updated = DB::table('telegram_sessions')
                ->where('user_id', $userId)
                ->where('command', 'search_maraicher')
                ->where('completed', false)
                ->update([
                    'completed' => true,
                    'updated_at' => now()
                ]);

            if (!$updated) {
                throw new \Exception('Failed to update session status');
            }

            $this->listMaraicherService->searchMaraichers($chatId, $searchTerm);

        } catch (\Exception $e) {
            Log::error('Error in processSearchTerm: ' . $e->getMessage(), [
                'user_id' => $userId,
                'chat_id' => $chatId,
                'search_term' => $messageText,
                'trace' => $e->getTraceAsString()
            ]);

            $this->sendMessage->sendMessage(
                $chatId,
                "❌ Erreur lors de la recherche. Veuillez réessayer."
            );

            // Annuler la session en cas d'erreur
            $this->cancelSession($userId, 'search_maraicher');
        }
    }

    private function sanitizeSearchTerm($searchTerm)
    {
        $cleaned = trim($searchTerm);
        $cleaned = preg_replace('/\s+/', ' ', $cleaned);
        $cleaned = strip_tags($cleaned);
        $cleaned = htmlspecialchars($cleaned, ENT_QUOTES, 'UTF-8');

        return $cleaned;
    }

    private function validateSearchTerm($searchTerm)
    {
        if (empty($searchTerm)) {
            return [
                'valid' => false,
                'message' => "❌ Le terme de recherche ne peut pas être vide.\n\n" .
                           "Veuillez entrer un terme valide ou tapez /cancel pour annuler."
            ];
        }

        if (strlen($searchTerm) < 2) {
            return [
                'valid' => false,
                'message' => "❌ Le terme de recherche doit contenir au moins 2 caractères.\n\n" .
                           "Veuillez entrer un terme plus long ou tapez /cancel pour annuler."
            ];
        }

        if (strlen($searchTerm) > 100) {
            return [
                'valid' => false,
                'message' => "❌ Le terme de recherche est trop long (maximum 100 caractères).\n\n" .
                           "Veuillez raccourcir votre recherche ou tapez /cancel pour annuler."
            ];
        }

        if (preg_match('/[<>{}[\]\\\\|`]/', $searchTerm)) {
            return [
                'valid' => false,
                'message' => "❌ Le terme de recherche contient des caractères non autorisés.\n\n" .
                           "Veuillez utiliser uniquement des lettres, chiffres, espaces et tirets."
            ];
        }

        return ['valid' => true];
    }

    private function cancelSession($userId, $command)
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
                ->where('completed', false)
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
