<?php

namespace App\Telegram\Keyboard;

use Telegram\Bot\Keyboard\Keyboard;

class NewChoiceKeyboard
{
    public static function getNewChoiceKeyboard($name = 'new_choice_keyboard', $callback_data = 'new_', $urlName = 'Menu Installation', $url = null)
    {
        $buttons = [
            Keyboard::inlineButton(['text' => $name, 'callback_data' => $callback_data])
        ];

        if ($url !== null) {
            $buttons[] = Keyboard::inlineButton(['text' => $urlName, 'url' => $url]);
        }

        $keyboard = Keyboard::make()
            ->inline()
            ->row($buttons)
            ->row([
                Keyboard::inlineButton(['text' => '🏠 Menu principale', 'callback_data' => 'menu'])
            ]);

        return $keyboard;
    }
}
