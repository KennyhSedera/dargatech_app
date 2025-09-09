<?php

namespace App\Services;

use App\Models\rapportMaintenances;
use App\Telegram\Keyboard\PaginationKeyboard;
use Log;
use Telegram\Bot\Keyboard\Keyboard;

class RapportMaintenanceService
{
    protected SendMessageService $sendMessage;
    public function __construct(SendMessageService $sendMessage)
    {
        $this->sendMessage = $sendMessage;
    }

    public function showFullList($chatId)
    {
        try {

            $rapports = rapportMaintenances::with('client', 'maintenance')
                ->whereHas('maintenance')
                ->orderBy('created_at', 'desc')
                ->get();

            if ($rapports->isEmpty()) {
                $this->sendMessage->sendMessage(
                    $chatId,
                    "📋 *Liste des rapports maintenances*\n\n❌ Aucun rapport maintenance enregistré pour le moment.\n\n💡 Utilisez le menu principal pour ajouter un nouveau rapport.",
                    'Markdown'
                );
                return;
            }

            if ($rapports->count() > 5) {
                $this->showPaginatedList($chatId, $rapports, 1);
            } else {
                $this->showSimpleList($chatId, $rapports);
            }

        } catch (\Exception $e) {
            $this->sendMessage->sendMessage(
                $chatId,
                "❌ *Erreur*\n\nImpossible de récupérer la liste des rapports maintenances.\n\nVeuillez réessayer plus tard.",
                'Markdown'
            );
        }
    }
    public function showSimpleList($chatId, $rapports)
    {
        $message = "🔧 *Vos rapports de maintenance* • SISAM\n";
        $message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

        foreach ($rapports as $index => $rapport) {
            $numero = $rapport->id;

            if ($rapport->maintenance) {
                $typeIcon = $rapport->maintenance->type_intervention === 'préventive' ? '🛡️' : '⚠️';

                $statusIcon = match ($rapport->maintenance->status_intervention) {
                    'terminée' => '✅',
                    'en cours' => '🔄',
                    'en attente' => '⏳',
                    default => '❓'
                };

                $typeIntervention = ucfirst($rapport->maintenance->type_intervention ?? 'N/A');
                $statusIntervention = ucfirst($rapport->maintenance->status_intervention ?? 'N/A');
            } else {
                $typeIcon = '❓';
                $statusIcon = '❓';
                $typeIntervention = 'N/A';
                $statusIntervention = 'N/A';
            }

            $message .= "*#{$numero} Rapport {$typeIcon}*\n";

            if ($rapport->client) {
                $message .= "*👤 Client:* {$rapport->client->prenom} {$rapport->client->nom}\n";
                $message .= "*📱 Téléphone:* {$rapport->client->telephone}\n";
                $message .= "*📍 Localisation:* {$rapport->client->localisation}\n";
            }

            if ($rapport->maintenance && $rapport->maintenance->installation) {
                $installation = $rapport->maintenance->installation;
                $message .= "*🏭 Code Installation:* {$installation->code_installation}\n";
                $message .= "*🔧 Numéro de série:* {$installation->numero_serie}\n";
                $message .= "*💧 Source d'eau:* {$installation->source_eau}\n";
            }

            $message .= "*🔧 Type:* {$typeIntervention}\n";
            $message .= "*📝 Problème:* " . substr($rapport->description_panne, 0, 200) .
                (strlen($rapport->description_panne) > 200 ? "..." : "") . "\n";
            $message .= "*🔬 Diagnostic:* " . substr($rapport->diagnostic_initial, 0, 100) .
                (strlen($rapport->diagnostic_initial) > 100 ? "..." : "") . "\n";
            $message .= "*📅 Date intervention:* " . date('d/m/Y', strtotime($rapport->date_intervention)) . "\n";
            $message .= "*🔄 Statut:* {$statusIcon} {$statusIntervention}\n";
            $message .= "*🕐 Créé le:* " . date('d/m/Y à H:i', strtotime($rapport->created_at)) . "\n";
            $message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
        }

        $total = $rapports->count();
        $message .= "📊 *Total: {$total} rapports*\n";
        $message .= "🕐 *Mise à jour:* " . date('d/m/Y à H:i') . "\n\n";

        $keyboard = Keyboard::make()->inline()
            ->row([
                Keyboard::inlineButton(['text' => '🔍 Rechercher', 'callback_data' => 'search_rapport']),
                Keyboard::inlineButton(['text' => '➕ Nouveau rapport', 'callback_data' => 'new_rapport'])
            ])
            ->row([
                Keyboard::inlineButton(['text' => '🏠 Menu principal', 'callback_data' => 'menu'])
            ]);

        $this->sendMessage->sendMessageWithKeyboard($chatId, $message, $keyboard, 'Markdown');
    }

    public function showPaginatedList($chatId, $rapports, $page = 1)
    {
        $perPage = 5;
        $total = $rapports->count();
        $totalPages = ceil($total / $perPage);
        $offset = ($page - 1) * $perPage;
        $currentRapports = $rapports->slice($offset, $perPage);

        $message = "📋 *Liste des rapports de maintenance* (Page {$page}/{$totalPages})\n";
        $message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

        foreach ($currentRapports as $index => $rapport) {
            $numero = $rapport->id;

            if ($rapport->maintenance) {
                $typeIcon = $rapport->maintenance->type_intervention === 'préventive' ? '🛡️' : '⚠️';

                $statusIcon = match ($rapport->maintenance->status_intervention) {
                    'terminée' => '✅',
                    'en cours' => '🔄',
                    'en attente' => '⏳',
                    default => '❓'
                };

                $typeIntervention = ucfirst($rapport->maintenance->type_intervention ?? 'N/A');
                $statusIntervention = ucfirst($rapport->maintenance->status_intervention ?? 'N/A');
            } else {
                $typeIcon = '❓';
                $statusIcon = '❓';
                $typeIntervention = 'N/A';
                $statusIntervention = 'N/A';
            }

            $message .= "*#{$numero} Rapport {$typeIcon}*\n";

            if ($rapport->client) {
                $message .= "*👤 Client:* {$rapport->client->prenom} {$rapport->client->nom}\n";
                $message .= "*📱 Téléphone:* {$rapport->client->telephone}\n";
            }

            if ($rapport->maintenance && $rapport->maintenance->installation) {
                $installation = $rapport->maintenance->installation;
                $message .= "*🏭 Code Installation:* {$installation->code_installation}\n";
                $message .= "*🔧 Numéro de série:* {$installation->numero_serie}\n";
                $message .= "*💧 Source d'eau:* {$installation->source_eau}\n";
            }

            $message .= "*🔧 Type:* {$typeIntervention}\n";
            $message .= "*📝 Problème:* " . substr($rapport->description_panne, 0, 150) .
                (strlen($rapport->description_panne) > 150 ? "..." : "") . "\n";
            $message .= "*🔬 Diagnostic:* " . substr($rapport->diagnostic_initial, 0, 100) .
                (strlen($rapport->diagnostic_initial) > 100 ? "..." : "") . "\n";
            $message .= "*📅 Date intervention:* " . date('d/m/Y', strtotime($rapport->date_intervention)) . "\n";
            $message .= "*🔄 Statut:* {$statusIcon} {$statusIntervention}\n";
            $message .= "*🕐 Créé le:* " . date('d/m/Y à H:i', strtotime($rapport->created_at)) . "\n";
            $message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
        }

        $message .= "📊 *Total:* {$total} rapports | Page {$page}/{$totalPages}";

        $keyboard = Keyboard::make()->inline();

        PaginationKeyboard::addAdvancedPagination($keyboard, $page, $totalPages, entityType: 'rapport');

        $keyboard->row([
            Keyboard::inlineButton(['text' => '➕ Nouveau', 'callback_data' => 'new_rapport']),
            Keyboard::inlineButton(['text' => '🔍 Rechercher', 'callback_data' => 'search_rapport'])
        ]);

        $keyboard->row([
            Keyboard::inlineButton(['text' => '🏠 Menu principal', 'callback_data' => 'menu'])
        ]);

        $this->sendMessage->sendMessageWithKeyboard($chatId, $message, $keyboard, 'Markdown');
    }

    public function searchRapports($chatId, $searchTerm)
    {
        try {
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

            $rapports = rapportMaintenances::with(['client', 'maintenance.installation'])
                ->whereHas('maintenance', function ($maintenanceQuery) use ($searchTerm, $like) {
                    $maintenanceQuery->where(function ($query) use ($searchTerm, $like) {
                        $query->where('type_intervention', $like, "%{$searchTerm}%")
                            ->orWhere('description_probleme', $like, "%{$searchTerm}%")
                            ->orWhere('status_intervention', $like, "%{$searchTerm}%")
                            ->orWhere('date_intervention', $like, "%{$searchTerm}%");
                    })
                        ->orWhereHas('installation', function ($installQuery) use ($searchTerm, $like) {
                            $installQuery->where('code_installation', $like, "%{$searchTerm}%")
                                ->orWhere('numero_serie', $like, "%{$searchTerm}%")
                                ->orWhere('source_eau', $like, "%{$searchTerm}%");
                        });
                })
                ->orWhereHas('client', function ($clientQuery) use ($searchTerm, $like) {
                    $clientQuery->where('prenom', $like, "%{$searchTerm}%")
                        ->orWhere('nom', $like, "%{$searchTerm}%")
                        ->orWhere('telephone', $like, "%{$searchTerm}%");
                })
                ->orderBy('created_at', 'desc')
                ->limit(15)
                ->get();

            if ($rapports->isEmpty()) {
                $this->sendNoRapportResultsMessage($chatId, $searchTerm);
                return;
            }

            $this->sendRapportSearchResults($chatId, $rapports, $searchTerm);

        } catch (\Exception $e) {
            Log::error('Erreur lors de la recherche de rapports', [
                'chat_id' => $chatId,
                'search_term' => $searchTerm,
                'error' => $e->getMessage()
            ]);

            $this->sendMessage->sendMessage(
                $chatId,
                "⚠️ *Erreur de Recherche*\n\nUne erreur s'est produite lors de la recherche des rapports.\n\n🔄 Veuillez réessayer ou contactez le support.",
                'Markdown'
            );
        }
    }

    private function sendNoRapportResultsMessage($chatId, $searchTerm)
    {
        $keyboard = Keyboard::make()->inline()
            ->row([
                Keyboard::inlineButton(['text' => '🔍 Nouvelle Recherche', 'callback_data' => 'search_rapport']),
                Keyboard::inlineButton(['text' => '📋 Tous les rapports', 'callback_data' => 'list_rapport_maintenance'])
            ])
            ->row([
                Keyboard::inlineButton(['text' => '🏠 Menu principal', 'callback_data' => 'menu'])
            ]);

        $this->sendMessage->sendMessageWithKeyboard(
            $chatId,
            "🔍 *Résultat de Recherche de Rapports*\n\n❌ Aucun rapport trouvé pour: *\"{$searchTerm}\"*\n\n💡 *Suggestions:*\n• Vérifiez l'orthographe\n• Utilisez des termes plus courts\n• Essayez le type d'intervention (préventive, curative)\n• Recherchez par statut (terminée, en cours, en attente)\n• Utilisez une partie de la description du problème\n• Essayez le code d'installation\n• Recherchez dans les commentaires du rapport\n\n🔄 Relancez une nouvelle recherche",
            $keyboard,
            'Markdown'
        );
    }

    private function sendRapportSearchResults($chatId, $rapports, $searchTerm)
    {
        $total = 0;
        $message = "🎯 *Résultats rapports pour: \"{$searchTerm}\"*\n";
        $message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

        foreach ($rapports as $index => $rapport) {
            if ($rapport->maintenance) {
                $message .= $this->formatRapportResult($rapport);
                $total++;
            }

            if (strlen($message) > 3000) {
                $message .= "\n⚠️ *Résultats tronqués* (trop de résultats)\n";
                break;
            }
        }

        $message .= "✅ *{$total} rapport(s) trouvé(s)*\n\n";
        $message .= "🕐 Recherche effectuée à " . date('H:i');

        $keyboard = $this->getRapportSearchKeyboard();
        $this->sendMessage->sendMessageWithKeyboard($chatId, $message, $keyboard, 'Markdown');
    }

    private function formatRapportResult($rapport)
    {
        $maintenance = $rapport->maintenance;
        $installation = $maintenance ? $maintenance->installation : null;
        $client = $installation ? $installation->client : null;

        $typeIcon = $maintenance && $maintenance->type_intervention === 'préventive' ? '🛡️' : '⚠️';

        $statusIcon = '❓';
        if ($maintenance) {
            $statusIcon = match ($maintenance->status_intervention) {
                'terminée' => '✅',
                'en cours' => '🔄',
                'en attente' => '⏳',
                default => '❓'
            };
        }

        $result = "*📄 Rapport #{$rapport->id}*\n";

        if ($maintenance) {
            $result .= "🔗 Maintenance #{$maintenance->id} {$typeIcon}\n";
            $result .= "🔧 Type: " . ucfirst($maintenance->type_intervention ?? 'N/A') . "\n";
        }

        if ($client) {
            $clientName = trim(($client->nom ?? '') . ' ' . ($client->prenom ?? ''));
            if (!empty($clientName)) {
                $result .= "👤 Client: {$clientName}\n";
            }
            if (!empty($client->telephone)) {
                $result .= "📞 Téléphone: {$client->telephone}\n";
            }
        }

        if ($installation) {
            $result .= "🏭 Installation: {$installation->code_installation}\n";
            if ($installation->numero_serie) {
                $result .= "🔧 N° Série: {$installation->numero_serie}\n";
            }
            if ($installation->source_eau) {
                $result .= "💧 Source: {$installation->source_eau}\n";
            }
        }

        if ($maintenance && $maintenance->description_probleme) {
            $description = $maintenance->description_probleme;
            if (strlen($description) > 60) {
                $description = substr($description, 0, 60);
                $lastSpace = strrpos($description, ' ');
                if ($lastSpace !== false) {
                    $description = substr($description, 0, $lastSpace);
                }
                $description .= "...";
            }
            $result .= "📝 Problème: {$description}\n";
        }

        if (isset($rapport->commentaire) && !empty($rapport->commentaire)) {
            $commentaire = $rapport->commentaire;
            if (strlen($commentaire) > 60) {
                $commentaire = substr($commentaire, 0, 60);
                $lastSpace = strrpos($commentaire, ' ');
                if ($lastSpace !== false) {
                    $commentaire = substr($commentaire, 0, $lastSpace);
                }
                $commentaire .= "...";
            }
            $result .= "💬 Commentaire: {$commentaire}\n";
        }

        if (isset($rapport->pieces_changees) && !empty($rapport->pieces_changees)) {
            $result .= "🔧 Pièces changées: {$rapport->pieces_changees}\n";
        }

        if ($maintenance && $maintenance->date_intervention) {
            try {
                $dateIntervention = date('d/m/Y', strtotime($maintenance->date_intervention));
                $result .= "📅 Date intervention: {$dateIntervention}\n";
            } catch (\Exception $e) {
                $result .= "📅 Date intervention: {$maintenance->date_intervention}\n";
            }
        }

        if ($maintenance) {
            $result .= "🔄 Statut: {$statusIcon} " . ucfirst($maintenance->status_intervention ?? 'N/A') . "\n";
        }

        try {
            $dateCreation = date('d/m/Y H:i', strtotime($rapport->created_at));
            $result .= "🕐 Rapport créé: {$dateCreation}\n";
        } catch (\Exception $e) {
            $result .= "🕐 Rapport créé: {$rapport->created_at}\n";
        }

        $result .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

        return $result;
    }

    private function getRapportSearchKeyboard()
    {
        return Keyboard::make()->inline()
            ->row([
                Keyboard::inlineButton(['text' => '🔍 Nouvelle Recherche', 'callback_data' => 'search_rapport']),
                Keyboard::inlineButton(['text' => '📋 Tous les rapports', 'callback_data' => 'list_rapport_maintenance'])
            ])
            ->row([
                Keyboard::inlineButton(['text' => '🏠 Menu principal', 'callback_data' => 'menu'])
            ]);
    }

}
