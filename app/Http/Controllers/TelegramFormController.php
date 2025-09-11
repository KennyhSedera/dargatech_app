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
            'telegram_user_id' => $tokenData['user_id'],
            'telegram_bot_username' => env('TELEGRAM_BOT_USERNAME'),
        ]);
    }

    public function installationForm(Request $request)
    {
        $tokenData = $request->get('telegram_token_data');

        return Inertia::render('Telegram/TelegramInstallationFormulaire', [
            'source' => 'telegram',
            'token_data' => $tokenData,
            'telegram_user_id' => $tokenData['user_id'],
            'telegram_bot_username' => env('TELEGRAM_BOT_USERNAME'),
        ]);
    }

    public function interventionForm(Request $request)
    {
        $tokenData = $request->get('telegram_token_data');

        return Inertia::render('Telegram/TelegramInterventionFormulaire', [
            'source' => 'telegram',
            'token_data' => $tokenData,
            'telegram_user_id' => $tokenData['user_id'],
            'telegram_bot_username' => env('TELEGRAM_BOT_USERNAME'),
        ]);
    }

    public function rapportForm(Request $request)
    {
        $tokenData = $request->get('telegram_token_data');

        return Inertia::render('Telegram/TelegramRapportFormulaire', [
            'source' => 'telegram',
            'token_data' => $tokenData,
            'telegram_user_id' => $tokenData['user_id'],
            'telegram_bot_username' => env('TELEGRAM_BOT_USERNAME'),
        ]);
    }

    public function paiementForm(Request $request)
    {
        $tokenData = $request->get('telegram_token_data');

        return Inertia::render('Telegram/TelegramPaimentFormulaire', [
            'source' => 'telegram',
            'token_data' => $tokenData,
            'telegram_user_id' => $tokenData['user_id'],
            'telegram_bot_username' => env('TELEGRAM_BOT_USERNAME'),
        ]);
    }

    public function cancelForm(Request $request, $telegram_user_id)
    {
        $message = $request->input('message');

        $replyMessage = app(MessageCommand::class);
        return $replyMessage->replyMessage($telegram_user_id, $message);
    }
}
