<?php

namespace App\Services;

class TokenService
{
    public function generateSecureToken($userId, $action, $chatId)
    {
        $payload = [
            'user_id' => $userId,
            'chat_id' => $chatId,
            'action' => $action,
            'created_at' => now()->timestamp,
            'expires_at' => now()->addHours(2)->timestamp,
            'random' => bin2hex(random_bytes(16)),
            'source' => 'telegram_command'
        ];

        return encrypt(json_encode($payload));
    }
}
