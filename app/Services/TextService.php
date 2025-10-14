<?php
namespace App\Services;

class TextService
{
    /**
     * Segmente un texte par ;\n
     *
     * @param string $text
     * @return array
     */
    public static function segment(string $text): array
    {
        $segments = explode(";\n", $text);

        return array_values(
            array_filter(
                array_map('trim', $segments),
                fn($value) => !empty($value)
            )
        );
    }
}
