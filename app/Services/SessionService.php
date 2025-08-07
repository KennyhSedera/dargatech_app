<?php

namespace App\Services;

// use Telegram\Bot\Api;

// Class SessionService
// {
//     protected Api $telegram;
//     protected CallBackService $callBackService;
//     protected MaraicherService $maraicherService;

//     public function __construct(Api $telegram, CallBackService $callBackService, MaraicherService $maraicherService)
//     {
//         $this->telegram = $telegram;
//         $this->callBackService = $callBackService;
//         $this->maraicherService = $maraicherService;
//     }
//     public function handleActiveSession($session, $messageText, $userId, $chatId)
//     {
//         switch ($session->command) {
//             case 'new_maraicher':
//                 $this->handleNewMaraicherSession($session, $messageText, $userId, $chatId);
//                 break;
//         }
//     }

//     private function handleNewMaraicherSession($session, $messageText, $userId, $chatId)
//     {
//         $data = json_decode($session->data, true) ?? [];

//         switch ($session->step) {
//             case 'nom':
//                 $this->maraicherService->handleNomStep($messageText, $data, $userId, $chatId);
//                 break;
//             case 'prenom':
//                 $this->maraicherService->handlePrenomStep($messageText, $data, $userId, $chatId);
//                 break;
//             case 'contact':
//                 $this->maraicherService->handleContactStep($messageText, $data, $userId, $chatId);
//                 break;
//         }
//     }
// }


// À ajouter dans votre SessionService existant

use App\Services\ListMaraicherService;
use App\Services\MaraicherService;
use App\Services\SendMessageService;
use DB;

class SessionService
{
    protected SendMessageService $sendMessage;
    protected MaraicherService $maraicherService;
    protected ListMaraicherService $listMaraicherService; // Ajouter cette ligne

    public function __construct(
        SendMessageService $sendMessage,
        MaraicherService $maraicherService,
        ListMaraicherService $listMaraicherService // Ajouter ce paramètre
    ) {
        $this->sendMessage = $sendMessage;
        $this->maraicherService = $maraicherService;
        $this->listMaraicherService = $listMaraicherService; // Ajouter cette ligne
    }

    public function handleActiveSession($activeSession, $messageText, $userId, $chatId)
    {
        $data = json_decode($activeSession->data, true) ?? [];

        switch ($activeSession->command) {
            case 'new_maraicher':
                $this->handleMaraicherSession($activeSession, $messageText, $data, $userId, $chatId);
                break;

            case 'search_maraicher':
                $this->handleSearchSession($activeSession, $messageText, $data, $userId, $chatId);
                break;

            // Ajouter d'autres cases pour d'autres commandes...

            default:
                $this->sendMessage->sendMessage($chatId, "❌ Session inconnue. Utilisez /cancel pour annuler.");
                break;
        }
    }

    private function handleMaraicherSession($activeSession, $messageText, $data, $userId, $chatId)
    {
        $this->maraicherService->handleStep($activeSession->step, $messageText, $data, $userId, $chatId);
    }


    private function handleSearchSession($activeSession, $messageText, $data, $userId, $chatId)
    {
        if ($activeSession->step === 'awaiting_search_term') {
            // Valider le terme de recherche
            $searchTerm = trim($messageText);

            if (empty($searchTerm)) {
                $this->sendMessage->sendMessage(
                    $chatId,
                    "❌ Le terme de recherche ne peut pas être vide.\n\nVeuillez entrer un terme valide ou tapez /cancel pour annuler."
                );
                return;
            }

            if (strlen($searchTerm) < 2) {
                $this->sendMessage->sendMessage(
                    $chatId,
                    "❌ Le terme de recherche doit contenir au moins 2 caractères.\n\nVeuillez entrer un terme plus long ou tapez /cancel pour annuler."
                );
                return;
            }

            // Marquer la session comme terminée
            DB::table('telegram_sessions')
                ->where('user_id', $userId)
                ->where('command', 'search_maraicher')
                ->where('completed', false)
                ->update([
                    'completed' => true,
                    'updated_at' => now()
                ]);

            // Effectuer la recherche
            $this->listMaraicherService->searchMaraichers($chatId, $searchTerm);
        }
    }
}
