<?php

namespace App\Http\Controllers;

use App\Services\CallBackService;
use App\Services\SessionService;
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

    public function __construct(Api $telegram, CallBackService $callBackService, SessionService $sessionService)
    {
        $this->telegram = $telegram;
        $this->callBackService = $callBackService;
        $this->sessionService = $sessionService;
    }

    public function webhook(Request $request)
    {
        try {
            $update = $this->telegram->getWebhookUpdate();

            if ($update->isType('callback_query')) {
                $callback = $update->getCallbackQuery();
                $chatId = $callback->getMessage()->getChat()->getId();
                $userId = $callback->getFrom()->getId();
                $data = $callback->getData();
                $callbackId = $callback->getId();

                if (preg_match('/^list_page_(\d+)$/', $data, $matches)) {
                    $page = (int)$matches[1];

                    $this->callBackService->handleListPage($chatId, $page);

                    $this->telegram->answerCallbackQuery([
                        'callback_query_id' => $callbackId,
                        'text' => "📄 Page {$page}",
                        'show_alert' => false
                    ]);

                    return response('Pagination handled', 200);
                }

                try {
                    $result = match ($data) {
                        'maraicher'             => $this->callBackService->handleMaraicher($chatId),
                        'new_maraicher'         => $this->callBackService->handleNewMaraicher($chatId, $userId),
                        'new_installation'      => $this->callBackService->handleNewInstallations($chatId, $userId),
                        // 'new_intervention'      => $this->callBackService->handleNewIntervention($chatId),
                        // 'rapport_maintenance'   => $this->callBackService->handleRapportMaintenance($chatId),
                        // 'enregistrer_paiement'  => $this->callBackService->handlePaiement($chatId),
                        // 'generer_recu'          => $this->callBackService->handleRecu($chatId),
                        // 'mes_interventions'     => $this->callBackService->handleHistorique($chatId),
                        // 'rechercher_installation' => $this->callBackService->handleRecherche($chatId),
                        // 'help'                  => $this->callBackService->handleAide($chatId),
                        'list_full'             => $this->callBackService->handleListFull($chatId),
                        'list_summary'          => $this->callBackService->handleListSummary($chatId),
                        'list_detailed'         => $this->callBackService->handleListDetailed($chatId),
                        'search_maraicher'      => $this->callBackService->handleSearchMaraicher($chatId, $userId),
                        'main_menu'             => $this->callBackService->handleMainMenu($chatId),
                        'current_page'          => $this->callBackService->handleCurrentPage($chatId),
                        default                 => $this->callBackService->sendUnknownCommand($chatId),
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
                $chatId = $update->getMessage()->getChat()->getId();
                $userId = $update->getMessage()->getFrom()->getId();

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

    // Autres méthodes existantes...
    public function setWebhook()
    {
        try {
            $response = Telegram::setWebhook([
                'url' => env('TELEGRAM_WEBHOOK_URL')
            ]);

            return response()->json($response);
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
