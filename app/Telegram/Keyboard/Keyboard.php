<?php

use Telegram\Bot\Keyboard\Keyboard;

$keyboard = Keyboard::make([
    'keyboard' => [
        [
            ['text' => '📱 Envoyer mon numéro', 'request_contact' => true]
        ]
    ],
    'resize_keyboard' => true,
    'one_time_keyboard' => true
]);

$this->replyWithMessage([
    'text' => 'Clique sur le bouton ci-dessous pour partager ton numéro :',
    'reply_markup' => $keyboard
]);
