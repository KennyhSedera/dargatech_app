<?php

namespace App\Services;

use App\Telegram\Keyboard\NewChoiceKeyboard;
use App\Telegram\Keyboard\PaginationKeyboard;
use DB;
use Telegram\Bot\Keyboard\Keyboard;

class ListInstallationService
{
    protected SendMessageService $sendMessage;

    public function __construct(SendMessageService $sendMessage)
    {
        $this->sendMessage = $sendMessage;
    }

    public function showFullList($chatId, $messageId = null)
    {
        try {
            $installations = DB::table('installations')->orderBy('created_at', 'desc')->get();

            if ($installations->isEmpty()) {
                $message = "📋 *Liste des installations*\n\n❌ Aucun installation enregistré pour le moment.\n\n💡 Utilisez le menu principal pour ajouter un nouveau installation.";

                if ($messageId) {
                    $this->sendMessage->editMessage($chatId, $messageId, $message, 'Markdown');
                } else {
                    $this->sendMessage->sendMessage($chatId, $message, 'Markdown');
                }
                return;
            }

            if ($installations->count() > 5) {
                $this->showPaginatedList($chatId, $installations, 1, $messageId);
            } else {
                $this->showSimpleList($chatId, $installations, $messageId);
            }

        } catch (\Exception $e) {
            $message = "❌ *Erreur*\n\nImpossible de récupérer la liste des installations.\n\nVeuillez réessayer plus tard.";

            if ($messageId) {
                $this->sendMessage->editMessage($chatId, $messageId, $message, 'Markdown');
            } else {
                $this->sendMessage->sendMessage($chatId, $message, 'Markdown');
            }
        }
    }

    public function showSimpleList($chatId, $installations, $messageId = null)
    {
        $message = "🌾 *Vos installations* • SISAM\n";
        $message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

        foreach ($installations as $index => $installation) {
            $numero = $installation->id;

            $message .= "*#{$numero} Installation {$installation->code_installation}*\n";
            $message .= "🔧 N° Série: {$installation->numero_serie}\n";
            $message .= "💧 Source d'eau: {$installation->source_eau}\n";
            $message .= "⚡ Puissance crête installé : {$installation->puissance_pompe}W\n";
            $message .= "📏 Distance maximale pompe champ PV : {$installation->profondeur_forage}m\n";
            $message .= "💦 Débit nominal : {$installation->debit_nominal}(m³/h)\n";
            $message .= "📊 HMT: {$installation->hmt}m\n";
            $message .= "📅 Date installation: " . date('d/m/Y', strtotime($installation->date_installation)) . "\n";
            $message .= "🔄 Statut: " . ucfirst($installation->statuts) . "\n";
            $message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
        }

        $total = $installations->count();
        $message .= "📊 *Total: {$total} installation(s) enregistré(s)*\n";
        $message .= "🕐 *Mise à jour:* " . date('d/m/Y à H:i') . "\n\n";

        $keyboard = Keyboard::make()->inline()
            ->row([
                Keyboard::inlineButton(['text' => '🔍 Rechercher', 'callback_data' => 'search_installation']),
                Keyboard::inlineButton(['text' => '➕ Ajouter nouveau', 'callback_data' => 'button_create_installation'])
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

    public function showPaginatedList($chatId, $installations = null, $page = 1, $messageId = null)
    {
        // Si $installations n'est pas fourni, récupérer les données
        if ($installations === null) {
            $installations = DB::table('installations')->orderBy('created_at', 'desc')->get();
        }

        $perPage = 5;
        $total = $installations->count();
        $totalPages = ceil($total / $perPage);

        // Validation de la page
        $page = max(1, min($page, $totalPages));

        $offset = ($page - 1) * $perPage;
        $currentinstallations = $installations->slice($offset, $perPage);

        $message = "📋 *Liste des installations* (Page {$page}/{$totalPages})\n";
        $message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

        foreach ($currentinstallations as $index => $installation) {
            $numero = $installation->id;

            $message .= "*#{$numero} Installation {$installation->code_installation}*\n";
            $message .= "🔧 N° Série: {$installation->numero_serie}\n";
            $message .= "💧 Source d'eau: {$installation->source_eau}\n";
            $message .= "⚡ Puissance crête installé : {$installation->puissance_pompe}W\n";
            $message .= "📏 Distance maximale pompe champ PV : {$installation->profondeur_forage}m\n";
            $message .= "💦 Débit nominal : {$installation->debit_nominal}(m³/h)\n";
            $message .= "📊 HMT: {$installation->hmt}m\n";
            $message .= "📅 Date installation: " . date('d/m/Y', strtotime($installation->date_installation)) . "\n";
            $message .= "🔄 Statut: " . ucfirst($installation->statuts) . "\n";

            $message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
        }

        $message .= "📊 *Total:* {$total} installation(s) | Page {$page}/{$totalPages}";

        $keyboard = Keyboard::make()->inline();

        PaginationKeyboard::addAdvancedPagination($keyboard, $page, $totalPages, 'installation');

        $keyboard->row([
            Keyboard::inlineButton(['text' => '➕ Nouveau', 'callback_data' => 'button_create_installation']),
            Keyboard::inlineButton(['text' => '🔍 Rechercher', 'callback_data' => 'search_installation'])
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

    public function searchinstallations($chatId, $searchTerm, $messageId = null)
    {
        try {
            $like = 'LIKE';
            if (env('DB_CONNECTION') === 'pgsql') {
                $like = 'ILIKE';
            } else {
                $like = 'LIKE';
            }

            $installations = DB::table('installations')
                ->where(function ($query) use ($searchTerm, $like) {
                    $query->where('code_installation', $like, "%{$searchTerm}%")
                        ->orWhere('numero_serie', $like, '%' . $searchTerm . '%')
                        ->orWhere('source_eau', $like, '%' . $searchTerm . '%')
                        ->orWhere('debit_nominal', $like, '%' . $searchTerm . '%')
                        ->orWhere('date_installation', $like, '%' . $searchTerm . '%');
                })
                ->orderBy('created_at', 'desc')
                ->get();

            if ($installations->isEmpty()) {
                $message = "🔍 *Résultat de Recherche*\n\n❌ Aucun résultat pour: *\"{$searchTerm}\"*\n\n💡 *Suggestions:*\n• Vérifiez l'orthographe\n• Utilisez des termes plus courts\n• Essayez le code installation, numero série ou source d'eau ...\n\n🔄 Relancez une nouvelle recherche";

                if ($messageId) {
                    $this->sendMessage->editMessage($chatId, $messageId, $message, 'Markdown');
                } else {
                    $this->sendMessage->sendMessage($chatId, $message, 'Markdown');
                }
                return;
            }

            $message = "🎯 *Résultats pour: \"{$searchTerm}\"*\n";
            $message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

            foreach ($installations as $index => $installation) {
                $numero = $installation->id;

                $message .= "*#{$numero} Installation {$installation->code_installation}*\n";
                $message .= "🔧 N° Série: {$installation->numero_serie}\n";
                $message .= "💧 Source d'eau: {$installation->source_eau}\n";
                $message .= "⚡ Puissance crête installé : {$installation->puissance_pompe}W\n";
                $message .= "📏 Distance maximale pompe champ PV : {$installation->profondeur_forage}m\n";
                $message .= "💦 Débit nominal : {$installation->debit_nominal}m³/h\n";
                $message .= "📊 HMT: {$installation->hmt}m\n";
                $message .= "📅 Date installation: " . date('d/m/Y', strtotime($installation->date_installation)) . "\n";
                $message .= "🔄 Statut: " . ucfirst($installation->statuts) . "\n";

                $message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
            }

            $total = $installations->count();
            $message .= "✅ *{$total} résultat(s) trouvé(s)*\n\n";
            $message .= "🕐 Recherche effectuée à " . date('H:i');

            $keyboard = Keyboard::make()->inline()
                ->row([
                    Keyboard::inlineButton(['text' => '🔍 Nouvelle Recherche', 'callback_data' => 'search_installation']),
                    Keyboard::inlineButton(['text' => '📋 Tous les installations', 'callback_data' => 'list_installation'])
                ])
                ->row([
                    Keyboard::inlineButton(['text' => '🏠 Menu princpale', 'callback_data' => 'menu'])
                ]);

            if ($messageId) {
                $this->sendMessage->editMessage($chatId, $messageId, $message, 'Markdown', $keyboard);
            } else {
                $this->sendMessage->sendMessageWithKeyboard($chatId, $message, $keyboard, 'Markdown');
            }

        } catch (\Exception $e) {
            $message = "⚠️ *Erreur de Recherche*\n\nUne erreur s'est produite lors de la recherche installation.\n\n🔄 Veuillez réessayer ou contactez le support.";

            if ($messageId) {
                $this->sendMessage->editMessage($chatId, $messageId, $message, 'Markdown');
            } else {
                $this->sendMessage->sendMessage($chatId, $message, 'Markdown');
            }
        }
    }

    public function sendButtonNew($chatId, $text, $userId, $action = 'create_installation', $route = 'telegram.installation.form', $callack_data = 'new_installation', $messageId = null)
    {
        $tokenService = new TokenService();
        $secureToken = $tokenService->generateSecureToken($userId, $action, $chatId);

        $keyboard = new NewChoiceKeyboard();
        $keyboards = $keyboard->getNewChoiceKeyboard('Avec message telegram', $callack_data, 'Avec interface web', route($route, ['token' => $secureToken]));
        $this->sendMessage->sendMessageWithKeyboard($chatId, $text, $keyboards, 'HTML', $messageId);
    }
}
