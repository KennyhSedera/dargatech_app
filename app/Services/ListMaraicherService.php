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

            if ($maraichers->count() > 5) {
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

    private function showSimpleList($chatId, $maraichers)
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

        // Keyboard amélioré
        $keyboard = Keyboard::make()
            ->row([
                Keyboard::inlineButton(['text' => '🔍 Rechercher', 'callback_data' => 'search_maraicher']),
                Keyboard::inlineButton(['text' => '➕ Ajouter nouveau', 'callback_data' => 'new_maraicher'])
            ])
            ->row([
                Keyboard::inlineButton(['text' => '🏠 Menu principale', 'callback_data' => 'main_menu'])
            ]);

        $this->sendMessage->sendMessageWithKeyboard($chatId, $message, $keyboard, 'Markdown');
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

    // public function showSummary($chatId)
    // {
    //     try {
    //         $stats = DB::table('clients')
    //             ->selectRaw('
    //                 COUNT(*) as total,
    //                 COUNT(CASE WHEN genre = "Homme" THEN 1 END) as hommes,
    //                 COUNT(CASE WHEN genre = "Femme" THEN 1 END) as femmes,
    //                 SUM(CAST(surface_cultivee AS DECIMAL(10,2))) as surface_totale,
    //                 AVG(CAST(surface_cultivee AS DECIMAL(10,2))) as surface_moyenne
    //             ')
    //             ->first();

    //         $activites = DB::table('clients')
    //             ->select('type_activite_agricole', DB::raw('COUNT(*) as count'))
    //             ->groupBy('type_activite_agricole')
    //             ->orderBy('count', 'desc')
    //             ->get();

    //         $localisations = DB::table('clients')
    //             ->select('localisation', DB::raw('COUNT(*) as count'))
    //             ->groupBy('localisation')
    //             ->orderBy('count', 'desc')
    //             ->limit(5)
    //             ->get();

    //         $message = "📈 *Tableau de Bord • SISAM Analytics*\n";
    //         $message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

    //         // Section démographique avec émojis et barres de progression
    //         $message .= "👥 *Répartition Démographique*\n";
    //         $hommesPct = $stats->total > 0 ? round(($stats->hommes / $stats->total) * 100) : 0;
    //         $femmesPct = $stats->total > 0 ? round(($stats->femmes / $stats->total) * 100) : 0;

    //         $message .= "👨‍🌾 Hommes: {$stats->hommes} ({$hommesPct}%)\n";
    //         $message .= "👩‍🌾 Femmes: {$stats->femmes} ({$femmesPct}%)\n";
    //         $message .= "🎯 **Total: {$stats->total} maraîcher(s)**\n\n";

    //         // Section surfaces avec indicateurs visuels
    //         $message .= "🌾 *Analyse des Surfaces*\n";
    //         $message .= "📐 Surface totale: *" . number_format($stats->surface_totale, 1) . " ha*\n";
    //         $message .= "📊 Surface moyenne: *" . number_format($stats->surface_moyenne, 1) . " ha/exploitation*\n\n";

    //         // Top activités avec ranking
    //         $message .= "🏆 *Top Activités Agricoles*\n";
    //         foreach ($activites->take(3) as $index => $activite) {
    //             $rank = ["🥇", "🥈", "🥉"][$index] ?? "🏅";
    //             $message .= "{$rank} {$activite->type_activite_agricole}: *{$activite->count}*\n";
    //         }
    //         $message .= "\n";

    //         // Localisation avec émojis de région
    //         $message .= "🗺️ *Répartition Géographique*\n";
    //         foreach ($localisations as $index => $localisation) {
    //             $regionIcon = $localisation->localisation;
    //             $message .= "{$regionIcon} {$localisation->localisation}: *{$localisation->count}*\n";
    //         }

    //         $message .= "\n🕐 *Dernière mise à jour:* " . date('d/m/Y à H:i');

    //         $keyboard = Keyboard::make()
    //             ->row([
    //                 Keyboard::inlineButton(['text' => '📋 Liste Complète', 'callback_data' => 'list_maraicher']),
    //                 Keyboard::inlineButton(['text' => '🔍 Rechercher', 'callback_data' => 'search_maraicher'])
    //             ])
    //             ->row([
    //                 Keyboard::inlineButton(['text' => '🌱 Nouveau Maraîcher', 'callback_data' => 'new_maraicher']),
    //                 Keyboard::inlineButton(['text' => '📊 Rapports Avancés', 'callback_data' => 'advanced_reports'])
    //             ])
    //             ->row([
    //                 Keyboard::inlineButton(['text' => '🏠 Accueil', 'callback_data' => 'main_menu'])
    //             ]);

    //         $this->sendMessage->sendMessageWithKeyboard($chatId, $message, $keyboard, 'Markdown');

    //     } catch (\Exception $e) {
    //         $this->sendMessage->sendMessage(
    //             $chatId,
    //             "⚠️ *Erreur de Chargement*\n\nImpossible de générer les statistiques actuellement.\n\n🔄 Veuillez réessayer dans quelques instants.",
    //             'Markdown'
    //         );
    //     }
    // }

    public function showPaginatedList($chatId, $maraichers, $page = 1)
    {
        $perPage = 5;
        $total = $maraichers->count();
        $totalPages = ceil($total / $perPage);
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
            Keyboard::inlineButton(['text' => '➕ Nouveau', 'callback_data' => 'new_maraicher']),
            Keyboard::inlineButton(['text' => '🔍 Rechercher', 'callback_data' => 'search_maraicher'])
        ]);

        $keyboard->row([
            Keyboard::inlineButton(['text' => '🏠 Menu principale', 'callback_data' => 'main_menu'])
        ]);

        $this->sendMessage->sendMessageWithKeyboard($chatId, $message, $keyboard, 'Markdown');
    }

    public function searchMaraichers($chatId, $searchTerm)
    {
        try {
            $maraichers = DB::table('clients')
                ->where(function ($query) use ($searchTerm) {
                    $query->where('nom', 'like', '%' . $searchTerm . '%')
                        ->orWhere('prenom', 'like', '%' . $searchTerm . '%')
                        ->orWhere('localisation', 'like', '%' . $searchTerm . '%')
                        ->orWhere('telephone', 'like', '%' . $searchTerm . '%')
                        ->orWhere('type_activite_agricole', 'like', '%' . $searchTerm . '%');
                })
                ->orderBy('created_at', 'desc')
                ->get();

            if ($maraichers->isEmpty()) {
                $this->sendMessage->sendMessage(
                    $chatId,
                    "🔍 *Résultat de Recherche*\n\n❌ Aucun résultat pour: *\"{$searchTerm}\"*\n\n💡 *Suggestions:*\n• Vérifiez l'orthographe\n• Utilisez des termes plus courts\n• Essayez le nom, prénom ou localisation\n\n🔄 Relancez une nouvelle recherche",
                    'Markdown'
                );
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

            $this->sendMessage->sendMessageWithKeyboard($chatId, $message, $keyboard, 'Markdown');

        } catch (\Exception $e) {
            $this->sendMessage->sendMessage(
                $chatId,
                "⚠️ *Erreur de Recherche*\n\nUne erreur s'est produite lors de la recherche maraîchers.\n\n🔄 Veuillez réessayer ou contactez le support.",
                'Markdown'
            );
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
