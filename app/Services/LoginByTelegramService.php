<?php

namespace App\Services;

use App\Models\Profile;
use App\Models\Technicien;
use App\Models\User;
use App\Telegram\Commands\StartCommand;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Telegram\Bot\Laravel\Facades\Telegram;

class LoginByTelegramService
{
    protected SendMessageService $sendMessage;

    public function __construct(SendMessageService $sendMessage)
    {
        $this->sendMessage = $sendMessage;
    }

    public function MessageDemandeEmail($chatId)
    {
        return $this->sendMessage->sendMessage($chatId, "Pour vous connecter, veuillez entrer votre adresse email du compte créé par l'administrateur.", 'Markdown');
    }

    public function MessageDemandePassword($chatId, $email)
    {
        return $this->sendMessage->sendMessage($chatId, "🔐 Veuillez entrer le mot de passe associé à l'email : `$email`", 'Markdown');
    }

    public function verifyEmail($chatId, $email)
    {
        $user = User::where('email', $email)->first();
        if (!$user) {
            return $this->sendMessage->sendMessage($chatId, "🚫 Aucun compte trouvé avec cette adresse email.", 'Markdown');
        }

        Cache::put("auth_email_{$chatId}", $email, now()->addMinutes(10));

        return $this->MessageDemandePassword($chatId, $email);
    }

    public function verifyPassword($chatId, $password, $messageId, $username)
    {
        $email = Cache::get("auth_email_{$chatId}");

        if (!$email) {
            return $this->sendMessage->sendMessage($chatId, "🚫 Session expirée. Veuillez recommencer.", 'Markdown');
        }

        Telegram::deleteMessage([
            'chat_id' => $chatId,
            'message_id' => $messageId,
        ]);

        $user = User::where('email', $email)->first();
        if (!$user || !Hash::check($password, $user->password)) {
            Cache::forget("auth_email_{$chatId}");
            return $this->sendMessage->sendMessage($chatId, "🚫 Mot de passe incorrect. Veuillez recommencer.", 'Markdown');
        }

        Cache::forget("auth_email_{$chatId}");

        $prefix = "✅ Connecté avec l'adresse email : `$email` et le mot de passe : ";
        Telegram::sendMessage([
            'chat_id' => $chatId,
            'text' => $prefix . $password,
            'entities' => json_encode([
                [
                    'type' => 'spoiler',
                    'offset' => mb_strlen($prefix),
                    'length' => mb_strlen($password),
                ]
            ]),
        ]);

        if ($user->user_role === 1) {
            Profile::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'telegram_user_id' => $chatId,
                    'telegram_username' => $username,
                    'bot_active' => true,
                ]
            );
        } else if ($user->user_role === 2) {
            Technicien::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'telegram_user_id' => $chatId,
                    'telegram_username' => $username,
                    'bot_active' => true,
                ]
            );
        }

        $user->update(['telegram_id' => $chatId]);

        (new StartCommand())->handleKeyboardMenu($chatId);
    }
}
