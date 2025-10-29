<?php

namespace App\Services;

use App\Telegram\Keyboard\PaginationKeyboard;
use Illuminate\Support\Facades\DB;
use Log;
use Telegram\Bot\Keyboard\Keyboard;

class ListMaraicherService
{
    protected SendMessageService $sendMessage;

    public function __construct(SendMessageService $sendMessage)
    {
        $this->sendMessage = $sendMessage;
    }

    public function showFullList($chatId, $messageId = null)
    {
        try {
            $maraichers = DB::table('clients')->orderBy('created_at', 'desc')->get();

            if ($maraichers->isEmpty()) {
                $message = "📋 *Liste des Maraîchers*\n\n❌ Aucun maraîcher enregistré pour le moment.\n\n💡 Utilisez le menu principal pour ajouter un nouveau maraîcher.";

                if ($messageId) {
                    $this->sendMessage->editMessage($chatId, $messageId, $message, 'Markdown');
                } else {
                    $this->sendMessage->sendMessage($chatId, $message, 'Markdown');
                }
                return;
            }

            if ($maraichers->count() > 5) {
                $this->showPaginatedList($chatId, $maraichers, 1, $messageId);
            } else {
                $this->showSimpleList($chatId, $maraichers, $messageId);
            }

        } catch (\Exception $e) {
            $message = "❌ *Erreur*\n\nImpossible de récupérer la liste des maraîchers.\n\nVeuillez réessayer plus tard.";

            if ($messageId) {
                $this->sendMessage->editMessage($chatId, $messageId, $message, 'Markdown');
            } else {
                $this->sendMessage->sendMessage($chatId, $message, 'Markdown');
            }
        }
    }

    private function showSimpleList($chatId, $maraichers, $messageId = null)
    {
        $message = "🌾 *Vos Maraîchers* • SISAM\n";
        $message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

        foreach ($maraichers as $index => $maraicher) {
            $numero = $maraicher->id;
            $statusIcon = $this->getStatusIcon($maraicher);

            $message .= "{$statusIcon} *#{$numero} {$maraicher->prenom} {$maraicher->nom}*\n";
            $message .= "📍 {$maraicher->localisation}\n";
            $message .= "📞 {$maraicher->telephone}\n";
            $message .= "🌱 {$maraicher->type_activite_agricole}\n";
            $message .= "📐 Surface: {$maraicher->surface_cultivee}ha\n";
            $message .= "📅 Depuis: " . date('M Y', strtotime($maraicher->date_contrat)) . "\n";
            $message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
        }

        $total = $maraichers->count();
        $message .= "📊 *Total: {$total} maraîcher(s) actif(s)*\n";
        $message .= "🕐 *Mise à jour:* " . date('d/m/Y à H:i') . "\n\n";

        $keyboard = Keyboard::make()->inline()
            ->row([
                Keyboard::inlineButton(['text' => '🔍 Rechercher', 'callback_data' => 'search_maraicher']),
                Keyboard::inlineButton(['text' => '➕ Ajouter nouveau', 'callback_data' => 'button_create_maraicher'])
            ])
            ->row([
                Keyboard::inlineButton(['text' => '🏠 Menu principale', 'callback_data' => 'menu'])
            ]);

        if ($messageId) {
            $this->sendMessage->editMessage($chatId, $messageId, $message, 'Markdown', $keyboard);
        } else {
            $this->sendMessage->sendMessageWithKeyboard($chatId, $message, $keyboard, 'Markdown');
        }
    }

    private function getStatusIcon($maraicher)
    {
        $daysSinceContract = (time() - strtotime($maraicher->date_contrat)) / (60 * 60 * 24);

        if ($daysSinceContract < 30)
            return "🌟";
        if ($daysSinceContract < 90)
            return "🌱";
        return "👨‍🌾";
    }

    public function showPaginatedList($chatId, $maraichers = null, $page = 1, $messageId = null)
    {
        // Si $maraichers n'est pas fourni, récupérer les données
        if ($maraichers === null) {
            $maraichers = DB::table('clients')->orderBy('created_at', 'desc')->get();
        }

        $perPage = 5;
        $total = $maraichers->count();
        $totalPages = ceil($total / $perPage);

        // Validation de la page
        $page = max(1, min($page, $totalPages));

        $offset = ($page - 1) * $perPage;
        $currentMaraichers = $maraichers->slice($offset, $perPage);

        $message = "📋 *Liste des Maraîchers* (Page {$page}/{$totalPages})\n";
        $message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

        foreach ($currentMaraichers as $index => $maraicher) {
            $numero = $maraicher->id;
            $message .= "👨‍🌾 *#{$numero} {$maraicher->prenom} {$maraicher->nom}*\n";
            $message .= "📍 {$maraicher->localisation}\n";
            $message .= "📞 {$maraicher->telephone}\n";
            $message .= "🌱 {$maraicher->type_activite_agricole} ({$maraicher->surface_cultivee}ha)\n";

            if (isset($maraicher->date_contrat)) {
                $message .= "📅 " . date('d/m/Y', strtotime($maraicher->date_contrat)) . "\n";
            }

            $message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
        }

        $message .= "📊 *Total:* {$total} maraîcher(s) | Page {$page}/{$totalPages}";

        $keyboard = Keyboard::make()->inline();

        PaginationKeyboard::addAdvancedPagination($keyboard, $page, $totalPages, 'maraicher');

        $keyboard->row([
            Keyboard::inlineButton(['text' => '➕ Nouveau', 'callback_data' => 'button_create_maraicher']),
            Keyboard::inlineButton(['text' => '🔍 Rechercher', 'callback_data' => 'search_maraicher'])
        ]);

        $keyboard->row([
            Keyboard::inlineButton(['text' => '🏠 Menu principale', 'callback_data' => 'menu'])
        ]);

        if ($messageId) {
            $this->sendMessage->editMessage($chatId, $messageId, $message, 'Markdown', $keyboard);
        } else {
            $this->sendMessage->sendMessageWithKeyboard($chatId, $message, $keyboard, 'Markdown');
        }
    }

    public function searchMaraichers($chatId, $searchTerm, $messageId = null)
    {
        try {
            $like = 'LIKE';
            if (env('DB_CONNECTION') === 'pgsql') {
                $like = 'ILIKE';
            } else {
                $like = 'LIKE';
            }

            $maraichers = DB::table('clients')
                ->when($searchTerm, function ($query, $searchTerm) use ($like) {
                    $query->where(function ($subQuery) use ($searchTerm, $like) {
                        $subQuery
                            ->where('nom', $like, "%{$searchTerm}%")
                            ->orWhere('prenom', $like, "%{$searchTerm}%")
                            ->orWhere('localisation', $like, "%{$searchTerm}%")
                            ->orWhere('telephone', $like, "%{$searchTerm}%")
                            ->orWhere('type_activite_agricole', $like, "%{$searchTerm}%");
                    });
                })
                ->orderBy('created_at', 'desc')
                ->get();

            if ($maraichers->isEmpty()) {
                $message = "🔍 *Résultat de Recherche*\n\n❌ Aucun résultat pour: *\"{$searchTerm}\"*\n\n💡 *Suggestions:*\n• Vérifiez l'orthographe\n• Utilisez des termes plus courts\n• Essayez le nom, prénom ou localisation\n\n🔄 Relancez une nouvelle recherche";

                if ($messageId) {
                    $this->sendMessage->editMessage($chatId, $messageId, $message, 'Markdown');
                } else {
                    $this->sendMessage->sendMessage($chatId, $message, 'Markdown');
                }
                return;
            }

            $message = "🎯 *Résultats pour: \"{$searchTerm}\"*\n";
            $message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

            foreach ($maraichers as $maraicher) {
                $numero = $maraicher->id;
                $statusIcon = $this->getStatusIcon($maraicher);

                $nom = $this->highlightSearchTerm($maraicher->nom, $searchTerm);
                $prenom = $this->highlightSearchTerm($maraicher->prenom, $searchTerm);
                $localisation = $this->highlightSearchTerm($maraicher->localisation, $searchTerm);

                $message .= "{$statusIcon} *#{$numero} {$prenom} {$nom}*\n";
                $message .= "📍 {$localisation}\n";
                $message .= "📱 {$maraicher->telephone}\n";
                $message .= "🌾 {$maraicher->type_activite_agricole}\n";
                $message .= "📐 {$maraicher->surface_cultivee}ha\n";
                $message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
            }

            $total = $maraichers->count();
            $message .= "✅ *{$total} résultat(s) trouvé(s)*\n\n";
            $message .= "🕐 Recherche effectuée à " . date('H:i');

            $keyboard = Keyboard::make()->inline()
                ->row([
                    Keyboard::inlineButton(['text' => '🔍 Nouvelle Recherche', 'callback_data' => 'search_maraicher']),
                    Keyboard::inlineButton(['text' => '📋 Tous les Maraîchers', 'callback_data' => 'list_maraicher'])
                ])
                ->row([
                    Keyboard::inlineButton(['text' => '🏠 Menu principale', 'callback_data' => 'menu'])
                ]);

            if ($messageId) {
                $this->sendMessage->editMessage($chatId, $messageId, $message, 'Markdown', $keyboard);
            } else {
                $this->sendMessage->sendMessageWithKeyboard($chatId, $message, $keyboard, 'Markdown');
            }

        } catch (\Exception $e) {
            $message = "⚠️ *Erreur de Recherche*\n\nUne erreur s'est produite lors de la recherche maraîchers.\n\n🔄 Veuillez réessayer ou contactez le support.";

            if ($messageId) {
                $this->sendMessage->editMessage($chatId, $messageId, $message, 'Markdown');
            } else {
                $this->sendMessage->sendMessage($chatId, $message, 'Markdown');
            }
        }
    }

    private function highlightSearchTerm($text, $searchTerm)
    {
        if (stripos($text, $searchTerm) !== false) {
            return str_ireplace($searchTerm, "*{$searchTerm}*", $text);
        }
        return $text;
    }

}
