<?php

namespace App\Services;

use App\Telegram\Keyboard\PaginationKeyboard;
use DB;
use Log;
use Telegram\Bot\Keyboard\Keyboard;

class ListInstallationService
{
    protected SendMessageService $sendMessage;
    public function __construct(SendMessageService $sendMessage)
    {
        $this->sendMessage = $sendMessage;
    }

    public function showFullList($chatId)
    {
        try {

            $installations = DB::table('installations')->orderBy('created_at', 'desc')->get();

            if ($installations->isEmpty()) {
                $this->sendMessage->sendMessage(
                    $chatId,
                    "📋 *Liste des installations*\n\n❌ Aucun installation enregistré pour le moment.\n\n💡 Utilisez le menu principal pour ajouter un nouveau installation.",
                    'Markdown'
                );
                return;
            }

            if ($installations->count() > 5) {
                $this->showPaginatedList($chatId, $installations, 1);
            } else {
                $this->showSimpleList($chatId, $installations);
            }

        } catch (\Exception $e) {
            $this->sendMessage->sendMessage(
                $chatId,
                "❌ *Erreur*\n\nImpossible de récupérer la liste des installations.\n\nVeuillez réessayer plus tard.",
                'Markdown'
            );
        }
    }

    public function showSimpleList($chatId, $installations)
    {
        $message = "🌾 *Vos installations* • SISAM\n";
        $message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

        foreach ($installations as $index => $installation) {
            $numero = $installation->id;

            $message .= "*#{$numero} Installation {$installation->code_installation}*\n";
            $message .= "🔧 N° Série: {$installation->numero_serie}\n";
            $message .= "💧 Source d'eau: {$installation->source_eau}\n";
            $message .= "⚡ Puissance pompe: {$installation->puissance_pompe}kW\n";
            $message .= "📏 Profondeur forage: {$installation->profondeur_forage}m\n";
            $message .= "💦 Débit nominal: {$installation->debit_nominal}L/s\n";
            $message .= "📊 HMT: {$installation->hmt}m\n";
            $message .= "📅 Date installation: " . date('d/m/Y', strtotime($installation->date_installation)) . "\n";
            $message .= "🔄 Statut: " . ucfirst($installation->statuts) . "\n";
            $message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
        }

        $total = $installations->count();
        $message .= "📊 *Total: {$total} installation(s) enregistré(s)*\n";
        $message .= "🕐 *Mise à jour:* " . date('d/m/Y à H:i') . "\n\n";

        // Keyboard amélioré
        $keyboard = Keyboard::make()->inline()
            ->row([
                Keyboard::inlineButton(['text' => '🔍 Rechercher', 'callback_data' => 'search_installation']),
                Keyboard::inlineButton(['text' => '➕ Ajouter nouveau', 'callback_data' => 'new_installation'])
            ])
            ->row([
                Keyboard::inlineButton(['text' => '🏠 Menu principale', 'callback_data' => 'menu'])
            ]);

        $this->sendMessage->sendMessageWithKeyboard($chatId, $message, $keyboard, 'Markdown');
    }

    public function showPaginatedList($chatId, $installations, $page = 1)
    {
        $perPage = 5;
        $total = $installations->count();
        $totalPages = ceil($total / $perPage);
        $offset = ($page - 1) * $perPage;
        $currentinstallations = $installations->slice($offset, $perPage);

        $message = "📋 *Liste des installations* (Page {$page}/{$totalPages})\n";
        $message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

        foreach ($currentinstallations as $index => $installation) {
            $numero = $installation->id;

            $message .= "*#{$numero} Installation {$installation->code_installation}*\n";
            $message .= "🔧 N° Série: {$installation->numero_serie}\n";
            $message .= "💧 Source d'eau: {$installation->source_eau}\n";
            $message .= "⚡ Puissance pompe: {$installation->puissance_pompe}kW\n";
            $message .= "📏 Profondeur forage: {$installation->profondeur_forage}m\n";
            $message .= "💦 Débit nominal: {$installation->debit_nominal}L/s\n";
            $message .= "📊 HMT: {$installation->hmt}m\n";
            $message .= "📅 Date installation: " . date('d/m/Y', strtotime($installation->date_installation)) . "\n";
            $message .= "🔄 Statut: " . ucfirst($installation->statuts) . "\n";

            $message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
        }

        $message .= "📊 *Total:* {$total} installation(s) | Page {$page}/{$totalPages}";

        $keyboard = Keyboard::make()->inline();

        PaginationKeyboard::addAdvancedPagination($keyboard, $page, $totalPages, entityType: 'installation');

        $keyboard->row([
            Keyboard::inlineButton(['text' => '➕ Nouveau', 'callback_data' => 'new_installation']),
            Keyboard::inlineButton(['text' => '🔍 Rechercher', 'callback_data' => 'search_installation'])
        ]);

        $keyboard->row([
            Keyboard::inlineButton(['text' => '🏠 Menu principale', 'callback_data' => 'menu'])
        ]);

        $this->sendMessage->sendMessageWithKeyboard($chatId, $message, $keyboard, 'Markdown');
    }

    public function searchinstallations($chatId, $searchTerm)
    {
        try {
            $installations = DB::table(table: 'installations')
                ->where(function ($query) use ($searchTerm) {
                    $query->where('code_installation', 'like', '%' . $searchTerm . '%')
                        ->orWhere('numero_serie', 'like', '%' . $searchTerm . '%')
                        ->orWhere('source_eau', 'like', '%' . $searchTerm . '%')
                        ->orWhere('debit_nominal', 'like', '%' . $searchTerm . '%')
                        ->orWhere('date_installation', 'like', '%' . $searchTerm . '%');
                })
                ->orderBy('created_at', 'desc')
                ->get();

            if ($installations->isEmpty()) {
                $this->sendMessage->sendMessage(
                    $chatId,
                    "🔍 *Résultat de Recherche*\n\n❌ Aucun résultat pour: *\"{$searchTerm}\"*\n\n💡 *Suggestions:*\n• Vérifiez l'orthographe\n• Utilisez des termes plus courts\n• Essayez le code installation, numero série ou source d'eau ...\n\n🔄 Relancez une nouvelle recherche",
                    'Markdown'
                );
                return;
            }

            $message = "🎯 *Résultats pour: \"{$searchTerm}\"*\n";
            $message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

            foreach ($installations as $index => $installation) {
                $numero = $installation->id;

                $message .= "*#{$numero} Installation {$installation->code_installation}*\n";
                $message .= "🔧 N° Série: {$installation->numero_serie}\n";
                $message .= "💧 Source d'eau: {$installation->source_eau}\n";
                $message .= "⚡ Puissance pompe: {$installation->puissance_pompe}kW\n";
                $message .= "📏 Profondeur forage: {$installation->profondeur_forage}m\n";
                $message .= "💦 Débit nominal: {$installation->debit_nominal}L/s\n";
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

            $this->sendMessage->sendMessageWithKeyboard($chatId, $message, $keyboard, 'Markdown');

        } catch (\Exception $e) {
            $this->sendMessage->sendMessage(
                $chatId,
                "⚠️ *Erreur de Recherche*\n\nUne erreur s'est produite lors de la recherche installation.\n\n🔄 Veuillez réessayer ou contactez le support.",
                'Markdown'
            );
        }
    }

}
