<?php

namespace App\Telegram\Keyboard;

use Telegram\Bot\Keyboard\Keyboard;

class DashboardKeyboard
{
    public static function getDashboardKeyboard($text, $callback_data)
    {
        $keyboard = Keyboard::make()
            ->inline()
            ->row([
                Keyboard::inlineButton(['text' => $text, 'callback_data' => $callback_data]),
            ]);

        return $keyboard;
    }

    public static function createDashboard($buttons, $buttonsPerRow = 1)
    {
        $keyboard = Keyboard::make()->inline();

        $buttonChunks = array_chunk($buttons, $buttonsPerRow);

        foreach ($buttonChunks as $chunk) {
            $inlineButtons = [];
            foreach ($chunk as $button) {
                $inlineButtons[] = Keyboard::inlineButton($button);
            }
            $keyboard->row($inlineButtons);
        }

        return $keyboard;
    }
}
