<?php

namespace App\Services;

use App\Models\Maintenance;
use App\Telegram\Keyboard\PaginationKeyboard;
use DB;
use Log;
use Telegram\Bot\Keyboard\Keyboard;

class InterventionService
{
    protected SendMessageService $sendMessage;
    public function __construct(SendMessageService $sendMessage)
    {
        $this->sendMessage = $sendMessage;
    }

    public function showFullList($chatId)
    {
        try {

            $interventions = DB::table('maintenances')
                ->leftJoin('installations', 'maintenances.installation_id', '=', 'installations.id')
                ->select(
                    'maintenances.*',
                    'installations.code_installation as installation_code',
                    'installations.numero_serie as installation_numero_serie',
                    'installations.source_eau'
                )
                ->orderBy('maintenances.created_at', 'desc')
                ->get();

            if ($interventions->isEmpty()) {
                $this->sendMessage->sendMessage(
                    $chatId,
                    "📋 *Liste des interventions*\n\n❌ Aucun intervention enregistré pour le moment.\n\n💡 Utilisez le menu principal pour ajouter un nouveau intervention.",
                    'Markdown'
                );
                return;
            }

            if ($interventions->count() > 5) {
                $this->showPaginatedList($chatId, $interventions, 1);
            } else {
                $this->showSimpleList($chatId, $interventions);
            }

        } catch (\Exception $e) {
            $this->sendMessage->sendMessage(
                $chatId,
                "❌ *Erreur*\n\nImpossible de récupérer la liste des interventions.\n\nVeuillez réessayer plus tard.",
                'Markdown'
            );
        }
    }

    public function showSimpleList($chatId, $interventions)
    {
        $message = "🔧 *Vos interventions* • SISAM\n";
        $message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

        foreach ($interventions as $index => $intervention) {
            $numero = $intervention->id;

            $typeIcon = $intervention->type_intervention === 'préventive' ? '🛡️' : '⚠️';

            $statusIcon = match ($intervention->status_intervention) {
                'terminée' => '✅',
                'en cours' => '🔄',
                'en attente' => '⏳',
                default => '❓'
            };

            $message .= "*#{$numero} intervention {$typeIcon}*\n";
            $message .= "🏭 Code Installation: {$intervention->installation_code}\n";
            $message .= "🔧 Numéro de serie: {$intervention->installation_numero_serie}\n";
            $message .= "💧 Source d'eau: {$intervention->source_eau}\n";
            $message .= "🔧 Type: " . ucfirst($intervention->type_intervention) . "\n";
            $message .= "📝 Problème: " . substr($intervention->description_probleme, 0, 200) .
                (strlen($intervention->description_probleme) > 200 ? "..." : "") . "\n";
            $message .= "📅 Date intervention: " . date('d/m/Y', strtotime($intervention->date_intervention)) . "\n";
            $message .= "🔄 Statut: {$statusIcon} " . ucfirst($intervention->status_intervention) . "\n";
            $message .= "🕐 Créé le: " . date('d/m/Y à H:i', strtotime($intervention->created_at)) . "\n";
            $message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
        }

        $total = $interventions->count();
        $message .= "📊 *Total: {$total} interventions*\n";
        $message .= "🕐 *Mise à jour:* " . date('d/m/Y à H:i') . "\n\n";

        $keyboard = Keyboard::make()->inline()
            ->row([
                Keyboard::inlineButton(['text' => '🔍 Rechercher', 'callback_data' => 'search_intervention']),
                Keyboard::inlineButton(['text' => '➕ Nouveau intervention', 'callback_data' => 'new_intervention'])
            ])
            ->row([
                Keyboard::inlineButton(['text' => '🏠 Menu principal', 'callback_data' => 'menu'])
            ]);

        $this->sendMessage->sendMessageWithKeyboard($chatId, $message, $keyboard, 'Markdown');
    }

    public function showPaginatedList($chatId, $interventions, $page = 1)
    {
        $perPage = 5;
        $total = $interventions->count();
        $totalPages = ceil($total / $perPage);
        $offset = ($page - 1) * $perPage;
        $currentinterventions = $interventions->slice($offset, $perPage);

        $message = "📋 *Liste des interventions* (Page {$page}/{$totalPages})\n";
        $message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

        foreach ($currentinterventions as $index => $intervention) {
            $numero = $intervention->id;

            $typeIcon = $intervention->type_intervention === 'préventive' ? '🛡️' : '⚠️';

            $statusIcon = match ($intervention->status_intervention) {
                'terminée' => '✅',
                'en cours' => '🔄',
                'en attente' => '⏳',
                default => '❓'
            };

            $message .= "*#{$numero} intervention {$typeIcon}*\n";
            $message .= "🏭 Code Installation: {$intervention->installation_code}\n";
            $message .= "🔧 Numéro de serie: {$intervention->installation_numero_serie}\n";
            $message .= "💧 Source d'eau: {$intervention->source_eau}\n";
            $message .= "🔧 Type: " . ucfirst($intervention->type_intervention) . "\n";
            $message .= "📝 Problème: " . substr($intervention->description_probleme, 0, 200) .
                (strlen($intervention->description_probleme) > 200 ? "..." : "") . "\n";
            $message .= "📅 Date intervention: " . date('d/m/Y', strtotime($intervention->date_intervention)) . "\n";
            $message .= "🔄 Statut: {$statusIcon} " . ucfirst($intervention->status_intervention) . "\n";
            $message .= "🕐 Créé le: " . date('d/m/Y à H:i', strtotime($intervention->created_at)) . "\n";
            $message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
        }

        $message .= "📊 *Total:* {$total} interventions | Page {$page}/{$totalPages}";

        $keyboard = Keyboard::make()->inline();

        PaginationKeyboard::addAdvancedPagination($keyboard, $page, $totalPages, entityType: 'intervention');

        $keyboard->row([
            Keyboard::inlineButton(['text' => '➕ Nouveau', 'callback_data' => 'new_intervention']),
            Keyboard::inlineButton(['text' => '🔍 Rechercher', 'callback_data' => 'search_intervention'])
        ]);

        $keyboard->row([
            Keyboard::inlineButton(['text' => '🏠 Menu principal', 'callback_data' => 'menu'])
        ]);

        $this->sendMessage->sendMessageWithKeyboard($chatId, $message, $keyboard, 'Markdown');
    }

    public function searchInterventions($chatId, $searchTerm)
    {
        try {
            // Nettoyer et valider le terme de recherche
            $searchTerm = trim($searchTerm);
            if (empty($searchTerm)) {
                $this->sendMessage->sendMessage(
                    $chatId,
                    "⚠️ *Terme de recherche vide*\n\nVeuillez saisir un terme pour effectuer la recherche.",
                    'Markdown'
                );
                return;
            }

            $like = env('DB_CONNECTION') === 'pgsql' ? 'ILIKE' : 'LIKE';

            $interventions = DB::table('maintenances')
                ->leftJoin('installations', 'maintenances.installation_id', '=', 'installations.id')
                ->select(
                    'maintenances.*',
                    'installations.code_installation',
                    'installations.numero_serie',
                    'installations.source_eau'
                )
                ->where(function ($query) use ($searchTerm, $like) {
                    $query->where('maintenances.type_intervention', $like, "%{$searchTerm}%")
                        ->orWhere('maintenances.description_probleme', $like, "%{$searchTerm}%")
                        ->orWhere('maintenances.status_intervention', $like, "%{$searchTerm}%")
                        ->orWhere('maintenances.date_intervention', $like, "%{$searchTerm}%")
                        ->orWhere('installations.code_installation', $like, "%{$searchTerm}%")
                        ->orWhere('installations.numero_serie', $like, "%{$searchTerm}%")
                        ->orWhere('installations.source_eau', $like, "%{$searchTerm}%");
                })
                ->orderBy('maintenances.created_at', 'desc')
                ->limit(20) // Limiter les résultats pour éviter les messages trop longs
                ->get();

            if ($interventions->isEmpty()) {
                $this->sendNoResultsMessage($chatId, $searchTerm);
                return;
            }

            $this->sendSearchResults($chatId, $interventions, $searchTerm);

        } catch (\Exception $e) {
            // Log l'erreur pour debugging
            Log::error('Erreur lors de la recherche d\'interventions', [
                'chat_id' => $chatId,
                'search_term' => $searchTerm,
                'error' => $e->getMessage()
            ]);

            $this->sendMessage->sendMessage(
                $chatId,
                "⚠️ *Erreur de Recherche*\n\nUne erreur s'est produite lors de la recherche des interventions.\n\n🔄 Veuillez réessayer ou contactez le support.",
                'Markdown'
            );
        }
    }

    private function sendNoResultsMessage($chatId, $searchTerm)
    {
        $keyboard = Keyboard::make()->inline()
            ->row([
                Keyboard::inlineButton(['text' => '🔍 Nouvelle Recherche', 'callback_data' => 'search_intervention']),
                Keyboard::inlineButton(['text' => '📋 Toutes les interventions', 'callback_data' => 'list_intervention'])
            ])
            ->row([
                Keyboard::inlineButton(['text' => '🏠 Menu principal', 'callback_data' => 'menu'])
            ]);

        $this->sendMessage->sendMessageWithKeyboard(
            $chatId,
            "🔍 *Résultat de Recherche*\n\n❌ Aucun résultat pour: *\"{$searchTerm}\"*\n\n💡 *Suggestions:*\n• Vérifiez l'orthographe\n• Utilisez des termes plus courts\n• Essayez le type d'intervention (préventive, curative)\n• Recherchez par statut (terminée, en cours, en attente)\n• Utilisez une partie de la description du problème\n• Essayez le code d'installation\n\n🔄 Relancez une nouvelle recherche",
            $keyboard,
            'Markdown'
        );
    }

    private function sendSearchResults($chatId, $interventions, $searchTerm)
    {
        $total = $interventions->count();
        $maxResults = 20;

        // Si trop de résultats, on peut les paginer ou limiter
        $message = "🎯 *Résultats pour: \"{$searchTerm}\"*\n";
        $message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

        foreach ($interventions as $index => $intervention) {
            $message .= $this->formatInterventionResult($intervention, $index + 1);

            // Éviter les messages trop longs (limite Telegram ~4096 caractères)
            if (strlen($message) > 3000) {
                $message .= "\n⚠️ *Résultats tronqués* (trop de résultats)\n";
                break;
            }
        }

        $message .= "✅ *{$total} résultat(s) trouvé(s)*";
        if ($total > $maxResults) {
            $message .= " _(limité à {$maxResults})_";
        }
        $message .= "\n\n🕐 Recherche effectuée à " . date('H:i');

        $keyboard = $this->getSearchKeyboard();
        $this->sendMessage->sendMessageWithKeyboard($chatId, $message, $keyboard, 'Markdown');
    }

    private function formatInterventionResult($intervention, $position)
    {
        $typeIcon = $intervention->type_intervention === 'préventive' ? '🛡️' : '⚠️';

        $statusIcon = match ($intervention->status_intervention) {
            'terminée' => '✅',
            'en cours' => '🔄',
            'en attente' => '⏳',
            default => '❓'
        };

        $result = "*#{$intervention->id} - {$typeIcon} " . ucfirst($intervention->type_intervention) . "*\n";
        $result .= "🏭 Installation: {$intervention->code_installation}\n";

        if ($intervention->numero_serie) {
            $result .= "🔧 N° Série: {$intervention->numero_serie}\n";
        }

        if ($intervention->source_eau) {
            $result .= "💧 Source: {$intervention->source_eau}\n";
        }

        // Truncate description intelligemment
        $description = $intervention->description_probleme;
        if (strlen($description) > 80) {
            $description = substr($description, 0, 80);
            // Couper au dernier espace pour éviter de couper au milieu d'un mot
            $lastSpace = strrpos($description, ' ');
            if ($lastSpace !== false) {
                $description = substr($description, 0, $lastSpace);
            }
            $description .= "...";
        }
        $result .= "📝 Problème: {$description}\n";

        // Formater la date plus proprement
        try {
            $dateIntervention = date('d/m/Y', strtotime($intervention->date_intervention));
            $result .= "📅 Date: {$dateIntervention}\n";
        } catch (\Exception $e) {
            $result .= "📅 Date: {$intervention->date_intervention}\n";
        }

        $result .= "🔄 Statut: {$statusIcon} " . ucfirst($intervention->status_intervention) . "\n";

        try {
            $dateCreation = date('d/m/Y H:i', strtotime($intervention->created_at));
            $result .= "🕐 Créé: {$dateCreation}\n";
        } catch (\Exception $e) {
            $result .= "🕐 Créé: {$intervention->created_at}\n";
        }

        $result .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

        return $result;
    }

    private function getSearchKeyboard()
    {
        return Keyboard::make()->inline()
            ->row([
                Keyboard::inlineButton(['text' => '🔍 Nouvelle Recherche', 'callback_data' => 'search_intervention']),
                Keyboard::inlineButton(['text' => '📋 Toutes les interventions', 'callback_data' => 'list_intervention'])
            ])
            ->row([
                Keyboard::inlineButton(['text' => '🏠 Menu principal', 'callback_data' => 'menu'])
            ]);
    }
}
