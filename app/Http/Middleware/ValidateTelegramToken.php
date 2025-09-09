<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ValidateTelegramToken
{
    public function handle(Request $request, Closure $next)
    {
        $token = $request->get('token');

        if (!$token) {
            return $this->redirectToTelegram('Token manquant');
        }

        $tokenData = $this->validateTelegramToken($token);

        if (!$tokenData) {
            return $this->redirectToTelegram('Token invalide ou expiré');
        }

        $request->merge(['telegram_token_data' => $tokenData]);

        return $next($request);
    }

    private function validateTelegramToken($token): ?array
    {
        if (!$token) {
            return null;
        }

        try {
            $decrypted = decrypt($token);
            $payload = json_decode($decrypted, true);

            if (!$payload || !is_array($payload)) {
                Log::warning('Token Telegram invalide - JSON malformé');
                return null;
            }

            if (!isset($payload['expires_at']) || $payload['expires_at'] < now()->timestamp) {
                Log::info('Token Telegram expiré', [
                    'expires_at' => $payload['expires_at'] ?? 'non défini',
                    'now' => now()->timestamp
                ]);
                return null;
            }

            $requiredFields = ['user_id', 'action', 'created_at', 'expires_at'];
            foreach ($requiredFields as $field) {
                if (!isset($payload[$field])) {
                    Log::warning('Token Telegram invalide - champ manquant', ['field' => $field]);
                    return null;
                }
            }

            if (!is_numeric($payload['user_id']) || $payload['user_id'] <= 0) {
                Log::warning('Token Telegram invalide - user_id incorrect', [
                    'user_id' => $payload['user_id']
                ]);
                return null;
            }

            return $payload;

        } catch (\Illuminate\Contracts\Encryption\DecryptException $e) {
            Log::error('Erreur décryptage token Telegram', [
                'error' => $e->getMessage(),
                'token_preview' => substr($token, 0, 20) . '...'
            ]);
            return null;
        } catch (\Exception $e) {
            Log::error('Erreur validation token Telegram', [
                'error' => $e->getMessage(),
                'token_preview' => substr($token, 0, 20) . '...'
            ]);
            return null;
        }
    }

    private function redirectToTelegram(string $message)
    {
        $botUsername = config(env('TELEGRAM_BOT_USERNAME'), 'dargatech_bot');
        $encodedMessage = urlencode("error:$message");

        Log::info('Redirection vers Telegram', [
            'bot_username' => $botUsername,
            'message' => $message,
            'encoded_message' => $encodedMessage
        ]);

        return redirect("https://t.me/$botUsername?start");
    }
}
