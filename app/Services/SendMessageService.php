<?php

namespace App\Services;

use Telegram\Bot\Api;
use Telegram\Bot\Keyboard\Keyboard;

class SendMessageService
{
    protected Api $telegram;

    public function __construct(Api $telegram)
    {
        $this->telegram = $telegram;
    }

    public function sendMessage($chatId, $text, $parseMode = null)
    {
        return $this->telegram->sendMessage([
            'chat_id' => $chatId,
            'text' => $text,
            'parse_mode' => $parseMode,
        ]);
    }

    public function sendMessageWithKeyboard($chatId, $text, Keyboard $keyboard, $parseMode = null)
    {
        return $this->telegram->sendMessage([
            'chat_id' => $chatId,
            'text' => $text,
            'parse_mode' => $parseMode,
            'reply_markup' => $keyboard,
        ]);
    }

    public function editMessage($chatId, $messageId, $text, $parseMode = null, Keyboard $keyboard = null)
    {
        $params = [
            'chat_id' => $chatId,
            'message_id' => $messageId,
            'text' => $text,
            'parse_mode' => $parseMode,
        ];

        if ($keyboard) {
            $params['reply_markup'] = $keyboard;
        }

        return $this->telegram->editMessageText($params);
    }

    public function deleteMessage($chatId, $messageId)
    {
        return $this->telegram->deleteMessage([
            'chat_id' => $chatId,
            'message_id' => $messageId,
        ]);
    }
}
