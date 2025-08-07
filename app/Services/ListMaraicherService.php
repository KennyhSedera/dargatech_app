<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Telegram\Bot\Keyboard\Keyboard;

class ListMaraicherService
{
    protected SendMessageService $sendMessage;

    public function __construct(SendMessageService $sendMessage)
    {
        $this->sendMessage = $sendMessage;
    }

    /**
     * Afficher la liste complète des maraîchers
     */
    public function showFullList($chatId)
    {
        try {
            $maraichers = DB::table('clients')->orderBy('created_at', 'desc')->get();

            if ($maraichers->isEmpty()) {
                $this->sendMessage->sendMessage(
                    $chatId,
                    "📋 *Liste des Maraîchers*\n\n❌ Aucun maraîcher enregistré pour le moment.\n\n💡 Utilisez le menu principal pour ajouter un nouveau maraîcher.",
                    'Markdown'
                );
                return;
            }

            if ($maraichers->count() > 10) {
                $this->showPaginatedList($chatId, $maraichers, 1);
            } else {
                $this->showSimpleList($chatId, $maraichers);
            }

        } catch (\Exception $e) {
            $this->sendMessage->sendMessage(
                $chatId,
                "❌ *Erreur*\n\nImpossible de récupérer la liste des maraîchers.\n\nVeuillez réessayer plus tard.",
                'Markdown'
            );
        }
    }

    /**
     * Afficher une liste simple (≤ 10 éléments)
     */
    private function showSimpleList($chatId, $maraichers)
    {
        $message = "📋 *Liste des Maraîchers*\n";
        $message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

        foreach ($maraichers as $index => $maraicher) {
            $numero = $index + 1;
            $message .= "👨‍🌾 *#{$numero} {$maraicher->prenom} {$maraicher->nom}*\n";
            $message .= "📍 {$maraicher->localisation} | 📞 {$maraicher->telephone}\n";
            $message .= "🌱 {$maraicher->type_activite_agricole} | 📐 {$maraicher->surface_cultivee}ha\n";
            $message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
        }

        $total = $maraichers->count();
        $message .= "📊 *Total:* {$total} maraîcher(s)\n\n";

        // Ajouter le clavier de navigation
        $keyboard = Keyboard::make()
            ->row([
                Keyboard::inlineButton(['text' => '👁️ Vue Détaillée', 'callback_data' => 'list_detailed']),
                Keyboard::inlineButton(['text' => '🔍 Rechercher', 'callback_data' => 'search_maraicher'])
            ])
            ->row([
                Keyboard::inlineButton(['text' => '➕ Nouveau', 'callback_data' => 'new_maraicher']),
                Keyboard::inlineButton(['text' => '🏠 Menu', 'callback_data' => 'main_menu'])
            ]);

        $this->sendMessage->sendMessageWithKeyboard($chatId, $message, $keyboard, 'Markdown');
    }

    /**
     * Afficher une liste paginée (> 10 éléments)
     */
    public function showPaginatedList($chatId, $maraichers, $page = 1)
    {
        $perPage = 5;
        $total = $maraichers->count();
        $totalPages = ceil($total / $perPage);
        $offset = ($page - 1) * $perPage;
        $currentMaraichers = $maraichers->slice($offset, $perPage);

        $message = "📋 *Liste des Maraîchers* (Page {$page}/{$totalPages})\n";
        $message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

        foreach ($currentMaraichers as $index => $maraicher) {
            $numero = $offset + $index + 1;
            $message .= "👨‍🌾 *#{$numero} {$maraicher->prenom} {$maraicher->nom}*\n";
            $message .= "📍 {$maraicher->localisation}\n";
            $message .= "📞 {$maraicher->telephone}\n";
            $message .= "🌱 {$maraicher->type_activite_agricole} ({$maraicher->surface_cultivee}ha)\n";
            $message .= "📅 " . date('d/m/Y', strtotime($maraicher->date_contrat)) . "\n";
            $message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
        }

        $message .= "📊 *Total:* {$total} maraîcher(s) | Page {$page}/{$totalPages}";

        // Créer les boutons de pagination
        $keyboard = Keyboard::make();

        $paginationButtons = [];
        if ($page > 1) {
            $paginationButtons[] = Keyboard::inlineButton(['text' => '⬅️ Précédent', 'callback_data' => 'list_page_' . ($page - 1)]);
        }
        if ($page < $totalPages) {
            $paginationButtons[] = Keyboard::inlineButton(['text' => 'Suivant ➡️', 'callback_data' => 'list_page_' . ($page + 1)]);
        }

        if (!empty($paginationButtons)) {
            $keyboard->row($paginationButtons);
        }

        $keyboard->row([
            Keyboard::inlineButton(['text' => '👁️ Vue Résumé', 'callback_data' => 'list_summary']),
            Keyboard::inlineButton(['text' => '🔍 Rechercher', 'callback_data' => 'search_maraicher'])
        ])
        ->row([
            Keyboard::inlineButton(['text' => '➕ Nouveau', 'callback_data' => 'new_maraicher']),
            Keyboard::inlineButton(['text' => '🏠 Menu', 'callback_data' => 'main_menu'])
        ]);

        $this->sendMessage->sendMessageWithKeyboard($chatId, $message, $keyboard, 'Markdown');
    }

    /**
     * Afficher un résumé statistique
     */
    public function showSummary($chatId)
    {
        try {
            $stats = DB::table('clients')
                ->selectRaw('
                    COUNT(*) as total,
                    COUNT(CASE WHEN genre = "Homme" THEN 1 END) as hommes,
                    COUNT(CASE WHEN genre = "Femme" THEN 1 END) as femmes,
                    SUM(CAST(surface_cultivee AS DECIMAL(10,2))) as surface_totale,
                    AVG(CAST(surface_cultivee AS DECIMAL(10,2))) as surface_moyenne
                ')
                ->first();

            $activites = DB::table('clients')
                ->select('type_activite_agricole', DB::raw('COUNT(*) as count'))
                ->groupBy('type_activite_agricole')
                ->orderBy('count', 'desc')
                ->get();

            $localisations = DB::table('clients')
                ->select('localisation', DB::raw('COUNT(*) as count'))
                ->groupBy('localisation')
                ->orderBy('count', 'desc')
                ->limit(5)
                ->get();

            $message = "📊 *Résumé des Maraîchers*\n";
            $message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

            $message .= "👥 *Répartition par genre:*\n";
            $message .= "• Hommes: {$stats->hommes}\n";
            $message .= "• Femmes: {$stats->femmes}\n";
            $message .= "• **Total: {$stats->total}**\n\n";

            $message .= "📐 *Surfaces cultivées:*\n";
            $message .= "• Surface totale: " . number_format($stats->surface_totale, 2) . " ha\n";
            $message .= "• Surface moyenne: " . number_format($stats->surface_moyenne, 2) . " ha\n\n";

            $message .= "🌱 *Activités principales:*\n";
            foreach ($activites->take(3) as $activite) {
                $message .= "• {$activite->type_activite_agricole}: {$activite->count}\n";
            }
            $message .= "\n";

            $message .= "📍 *Top 5 localisations:*\n";
            foreach ($localisations as $localisation) {
                $message .= "• {$localisation->localisation}: {$localisation->count}\n";
            }

            $keyboard = Keyboard::make()
                ->row([
                    Keyboard::inlineButton(['text' => '📋 Liste Complète', 'callback_data' => 'list_full']),
                    Keyboard::inlineButton(['text' => '🔍 Rechercher', 'callback_data' => 'search_maraicher'])
                ])
                ->row([
                    Keyboard::inlineButton(['text' => '➕ Nouveau', 'callback_data' => 'new_maraicher']),
                    Keyboard::inlineButton(['text' => '🏠 Menu', 'callback_data' => 'main_menu'])
                ]);

            $this->sendMessage->sendMessageWithKeyboard($chatId, $message, $keyboard, 'Markdown');

        } catch (\Exception $e) {
            $this->sendMessage->sendMessage(
                $chatId,
                "❌ *Erreur*\n\nImpossible de générer le résumé statistique.",
                'Markdown'
            );
        }
    }

    /**
     * Rechercher des maraîchers par nom/prénom/localisation
     */
    public function searchMaraichers($chatId, $searchTerm)
    {
        try {
            $maraichers = DB::table('clients')
                ->where(function($query) use ($searchTerm) {
                    $query->where('nom', 'like', '%' . $searchTerm . '%')
                          ->orWhere('prenom', 'like', '%' . $searchTerm . '%')
                          ->orWhere('localisation', 'like', '%' . $searchTerm . '%')
                          ->orWhere('telephone', 'like', '%' . $searchTerm . '%');
                })
                ->get();

            if ($maraichers->isEmpty()) {
                $this->sendMessage->sendMessage(
                    $chatId,
                    "🔍 *Résultat de recherche*\n\n❌ Aucun maraîcher trouvé pour: *{$searchTerm}*\n\nEssayez avec un autre terme de recherche.",
                    'Markdown'
                );
                return;
            }

            $message = "🔍 *Résultat de recherche: \"{$searchTerm}\"*\n";
            $message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

            foreach ($maraichers as $index => $maraicher) {
                $numero = $index + 1;
                $message .= "👨‍🌾 *#{$numero} {$maraicher->prenom} {$maraicher->nom}*\n";
                $message .= "📍 {$maraicher->localisation} | 📞 {$maraicher->telephone}\n";
                $message .= "🌱 {$maraicher->type_activite_agricole}\n";
                $message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
            }

            $total = $maraichers->count();
            $message .= "📊 *{$total} résultat(s) trouvé(s)*";

            $keyboard = Keyboard::make()
                ->row([
                    Keyboard::inlineButton(['text' => '📋 Liste Complète', 'callback_data' => 'list_full']),
                    Keyboard::inlineButton(['text' => '🔍 Nouvelle Recherche', 'callback_data' => 'search_maraicher'])
                ])
                ->row([
                    Keyboard::inlineButton(['text' => '🏠 Menu Principal', 'callback_data' => 'main_menu'])
                ]);

            $this->sendMessage->sendMessageWithKeyboard($chatId, $message, $keyboard, 'Markdown');

        } catch (\Exception $e) {
            $this->sendMessage->sendMessage(
                $chatId,
                "❌ *Erreur de recherche*\n\nUne erreur s'est produite lors de la recherche.",
                'Markdown'
            );
        }
    }
}
