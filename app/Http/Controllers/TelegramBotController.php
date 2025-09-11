<?php

namespace App\Http\Controllers;

use App\Services\CallBackService;
use App\Services\SessionService;
use App\Telegram\Commands\StartCommand;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Telegram\Bot\Api;
use Telegram\Bot\Laravel\Facades\Telegram;

class TelegramBotController extends Controller
{
    protected Api $telegram;
    protected CallBackService $callBackService;
    protected SessionService $sessionService;
    protected StartCommand $startCommand;

    public function __construct(
        Api $telegram,
        CallBackService $callBackService,
        SessionService $sessionService,
        StartCommand $startCommand,
    ) {
        $this->telegram = $telegram;
        $this->callBackService = $callBackService;
        $this->sessionService = $sessionService;
        $this->startCommand = $startCommand;
    }

    public function webhook(Request $request)
    {
        try {
            $update = $this->telegram->getWebhookUpdate();
            $chatId = $update->getMessage()->getChat()->getId();
            $userId = $update->getMessage()->getFrom()->getId();

            $this->sessionService->cleanupSessionsSuccess(1, $chatId);

            if ($update->isType('callback_query')) {
                $callback = $update->getCallbackQuery();
                $chatId = $callback->getMessage()->getChat()->getId();
                $userId = $callback->getFrom()->getId();
                $data = $callback->getData();
                $callbackId = $callback->getId();

                if (preg_match('/^(\w+)_page_(\d+)$/', $data, $matches)) {
                    $entityType = $matches[1];
                    $page = (int) $matches[2];

                    $this->callBackService->handleEntityListPage($chatId, $entityType, $page);

                    $this->telegram->answerCallbackQuery([
                        'callback_query_id' => $callbackId,
                        'text' => "📄 Page {$page}",
                        'show_alert' => false
                    ]);

                    return response('Pagination handled', 200);
                }

                try {
                    match ($data) {
                        'maraicher' => $this->callBackService->handleMaraicher($chatId),
                        'installation' => $this->callBackService->handleInstallations($chatId),
                        'intervention' => $this->callBackService->handleIntervention($chatId),
                        'rapport_maintenance' => $this->callBackService->handleRapportMaintenance($chatId),
                        'new_maraicher' => $this->callBackService->handleNewMaraicher($chatId, $userId),
                        'new_installation' => $this->callBackService->handleNewInstallations($chatId, $userId),
                        'list_installation' => $this->callBackService->handleListInstallation($chatId),
                        'list_maraicher' => $this->callBackService->handleListFull($chatId),
                        'list_interventions' => $this->callBackService->handleListInterventions($chatId),
                        'list_rapport_maintenance' => $this->callBackService->handleListRapportsMaintenance($chatId),
                        'enregistrer_paiement' => $this->callBackService->handlePaiement($chatId, $userId),
                        // 'generer_recu'          => $this->callBackService->handleRecu($chatId),
                        'help' => $this->callBackService->handleHelp($chatId),
                        'list_detailed' => $this->callBackService->handleListDetailed($chatId),
                        'search_maraicher' => $this->callBackService->handleSearch($chatId, $userId, 'search_maraicher', 'de Maraîcher'),
                        'search_installation' => $this->callBackService->handleSearch($chatId, $userId, 'search_installation', 'd\'Installation'),
                        'search_intervention' => $this->callBackService->handleSearch($chatId, $userId, 'search_intervention', 'd\'Intervention'),
                        'search_rapport' => $this->callBackService->handleSearch($chatId, $userId, 'search_rapport', 'de Rapport de maintenance'),
                        'menu' => $this->startCommand->handleKeyboardMenu($chatId),
                        'current_page' => $this->callBackService->handleCurrentPage($chatId),
                        'button_create_installation' => $this->callBackService->handleSendButtonNewIntsallation($chatId, $userId),
                        'button_create_maraicher' => $this->callBackService->handleSendButtonNewMaraichers($chatId, $userId),
                        'button_create_intervention' => $this->callBackService->handleSendButtonNewInterventions($chatId, $userId),
                        'button_create_rapport_maintenance' => $this->callBackService->handleSendButtonNewPapports($chatId, $userId),
                        default => $this->callBackService->sendUnknownCommand($chatId),
                    };

                    $this->telegram->answerCallbackQuery([
                        'callback_query_id' => $callbackId,
                        'text' => '✅',
                        'show_alert' => false
                    ]);

                } catch (\Exception $e) {
                    \Log::error('Erreur callback: ' . $e->getMessage());

                    $this->telegram->answerCallbackQuery([
                        'callback_query_id' => $callbackId,
                        'text' => '❌ Erreur: ' . $e->getMessage(),
                        'show_alert' => true
                    ]);
                }

                return response('Callback handled', 200);
            }

            if ($update->getMessage()) {
                $messageText = $update->getMessage();

                if (!str_starts_with($messageText->getText(), '/')) {
                    $userId = $update->getMessage()->getFrom()->getId();
                    $chatId = $update->getMessage()->getChat()->getId();

                    $activeSession = DB::table('telegram_sessions')
                        ->where('user_id', $userId)
                        ->where('completed', false)
                        ->orderBy('created_at', 'desc')
                        ->first();

                    if ($activeSession) {
                        $this->sessionService->handleActiveSession($activeSession, $messageText, $userId, $chatId);
                        return response('Session handled', 200);
                    } else {
                        Log::info('No active session found for user ' . $userId);
                        $this->sessionService->cancelAllUserSessions($userId, $chatId);
                    }
                }

                if ($messageText->getText() === '👨‍🌾 Nouveau Maraîcher') {
                    $this->callBackService->handleNewMaraicher($chatId, $userId);
                }
            }

            Telegram::commandsHandler(true);

            return response('OK', 200);
        } catch (\Exception $e) {
            \Log::error('Telegram webhook error: ' . $e->getMessage());
            return response('Error', 500);
        }
    }

    public function setWebhook()
    {
        try {
            $response = Telegram::setWebhook([
                'url' => env('TELEGRAM_WEBHOOK_URL')
            ]);

            return response()->json([
                'response' => $response,
                "ok" => true,
                "result" => true,
                "description" => "Webhook is already set"
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function getWebhookInfo()
    {
        try {
            $response = Telegram::getWebhookInfo();
            return response()->json($response);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function deleteWebhook()
    {
        try {
            $response = Telegram::deleteWebhook();
            return response()->json([
                'success' => true,
                'response' => $response,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
