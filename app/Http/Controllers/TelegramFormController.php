<?php
namespace App\Http\Controllers;

use App\Models\Message;
use App\Telegram\Commands\MessageCommand;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Log;

class TelegramFormController extends Controller
{
    public function clientForm(Request $request)
    {
        $tokenData = $request->get('telegram_token_data');

        return Inertia::render('Telegram/TelegramClientFormulaire', [
            'source' => 'telegram',
            'token_data' => $tokenData,
            'telegram_user_id' => $tokenData['user_id']
        ]);
    }

    public function installationForm(Request $request)
    {
        $tokenData = $request->get('telegram_token_data');

        return Inertia::render('Telegram/TelegramInstallationFormulaire', [
            'source' => 'telegram',
            'token_data' => $tokenData,
            'telegram_user_id' => $tokenData['user_id']
        ]);
    }

    public function interventionForm(Request $request)
    {
        $tokenData = $request->get('telegram_token_data');

        return Inertia::render('Telegram/TelegramInterventionFormulaire', [
            'source' => 'telegram',
            'token_data' => $tokenData,
            'telegram_user_id' => $tokenData['user_id']
        ]);
    }

    public function rapportForm(Request $request)
    {
        $tokenData = $request->get('telegram_token_data');

        return Inertia::render('Telegram/TelegramRapportFormulaire', [
            'source' => 'telegram',
            'token_data' => $tokenData,
            'telegram_user_id' => $tokenData['user_id']
        ]);
    }

    public function cancelForm(Request $request, $telegram_user_id)
    {
        $message = $request->input('message');

        $replyMessage = app(MessageCommand::class);
        return $replyMessage->replyMessage($telegram_user_id, $message);
    }
}
