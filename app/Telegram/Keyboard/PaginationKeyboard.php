<?php

namespace App\Telegram\Keyboard;

use Log;
use Telegram\Bot\Keyboard\Keyboard;

class PaginationKeyboard
{
    public static function addAdvancedPagination($keyboard, $page, $totalPages, $entityType = 'list')
    {
        $paginationButtons = [];

        if ($page > 1) {
            $paginationButtons[] = Keyboard::inlineButton([
                'text' => '⬅️ Précédent',
                'callback_data' => "{$entityType}_page_" . ($page - 1)
            ]);
        }

        $paginationButtons[] = Keyboard::inlineButton([
            'text' => "📄 {$page}/{$totalPages}",
            'callback_data' => 'page_info'
        ]);

        if ($page < $totalPages) {
            $paginationButtons[] = Keyboard::inlineButton([
                'text' => 'Suivant ➡️',
                'callback_data' => "{$entityType}_page_" . ($page + 1)
            ]);
        }

        if (!empty($paginationButtons)) {
            $keyboard->row($paginationButtons);
        }

        if ($totalPages > 5) {
            $quickNavButtons = [];

            if ($page > 3) {
                $quickNavButtons[] = Keyboard::inlineButton([
                    'text' => '1',
                    'callback_data' => "{$entityType}_page_1"
                ]);
            }

            $start = max(1, $page - 1);
            $end = min($totalPages, $page + 1);

            for ($i = $start; $i <= $end; $i++) {
                if ($i != $page) {
                    $quickNavButtons[] = Keyboard::inlineButton([
                        'text' => (string) $i,
                        'callback_data' => "{$entityType}_page_{$i}"
                    ]);
                }
            }

            if ($page < $totalPages - 2) {
                $quickNavButtons[] = Keyboard::inlineButton([
                    'text' => (string) $totalPages,
                    'callback_data' => "{$entityType}_page_{$totalPages}"
                ]);
            }

            if (!empty($quickNavButtons)) {
                $chunks = array_chunk($quickNavButtons, 4);
                foreach ($chunks as $chunk) {
                    $keyboard->row($chunk);
                }
            }
        }

        return $keyboard;
    }
}
