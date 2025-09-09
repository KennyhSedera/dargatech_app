<?php

namespace App\Services;

use DB;
use Log;

class SearchServices
{
    protected SendMessageService $sendMessage;
    protected ListMaraicherService $maraicherService;
    protected ListInstallationService $installationService;
    protected InterventionService $interventionService;
    protected RapportMaintenanceService $rapportMaintenanceService;

    public function __construct(
        SendMessageService $sendMessageService,
        ListMaraicherService $maraicherService,
        ListInstallationService $installationService,
        InterventionService $interventionService,
        RapportMaintenanceService $rapportMaintenanceService
    ) {
        $this->sendMessage = $sendMessageService;
        $this->maraicherService = $maraicherService;
        $this->installationService = $installationService;
        $this->interventionService = $interventionService;
        $this->rapportMaintenanceService = $rapportMaintenanceService;
    }

    public function extractEntityType($command)
    {
        return str_replace('search_', '', $command);
    }

    public function processSearchTerm($messageText, $userId, $chatId, $entityType)
    {
        try {
            $searchTerm = $this->sanitizeSearchTerm($messageText->text);

            $validation = $this->validateSearchTerm($searchTerm, $entityType);
            if (!$validation['valid']) {
                $this->sendMessage->sendMessage($chatId, $validation['message']);
                return;
            }

            $command = "search_{$entityType}";

            $updated = DB::table('telegram_sessions')
                ->where('user_id', $userId)
                ->where('command', $command)
                ->where('completed', false)
                ->update([
                    'completed' => true,
                    'updated_at' => now()
                ]);

            if (!$updated) {
                throw new \Exception('Failed to update session status');
            }

            $this->performSearch($chatId, $searchTerm, $entityType);

        } catch (\Exception $e) {
            Log::error('Error in processSearchTerm: ' . $e->getMessage(), [
                'user_id' => $userId,
                'chat_id' => $chatId,
                'entity_type' => $entityType,
                'search_term' => $messageText,
                'trace' => $e->getTraceAsString()
            ]);

            $this->sendMessage->sendMessage(
                $chatId,
                "❌ Erreur lors de la recherche. Veuillez réessayer."
            );

            $session = app(SessionService::class);

            $session->cancelSession($userId, "search_{$entityType}");
        }
    }

    private function performSearch($chatId, $searchTerm, $entityType)
    {
        switch ($entityType) {
            case 'maraicher':
                $this->maraicherService->searchMaraichers($chatId, $searchTerm);
                break;

            case 'installation':
                $this->installationService->searchInstallations($chatId, $searchTerm);
                break;

            case 'intervention':
                $this->interventionService->searchInterventions($chatId, $searchTerm);
                break;

            case 'rapport':
                $this->rapportMaintenanceService->searchRapports($chatId, $searchTerm);
                break;

            default:
                throw new \Exception("Unknown entity type: {$entityType}");
        }
    }

    private function sanitizeSearchTerm($searchTerm)
    {
        $cleaned = trim($searchTerm);
        $cleaned = preg_replace('/\s+/', ' ', $cleaned);
        $cleaned = strip_tags($cleaned);
        $cleaned = htmlspecialchars($cleaned, ENT_QUOTES, 'UTF-8');

        return $cleaned;
    }

    private function validateSearchTerm($searchTerm, $entityType)
    {
        $config = $this->getEntitySearchConfig($entityType);

        if (empty($searchTerm)) {
            return [
                'valid' => false,
                'message' => "❌ Le terme de recherche ne peut pas être vide.\n\n" .
                    "Veuillez entrer un terme valide pour rechercher {$config['label']} ou tapez /cancel pour annuler."
            ];
        }

        if (strlen($searchTerm) < $config['min_length']) {
            return [
                'valid' => false,
                'message' => "❌ Le terme de recherche doit contenir au moins {$config['min_length']} caractères.\n\n" .
                    "Veuillez entrer un terme plus long ou tapez /cancel pour annuler."
            ];
        }

        if (strlen($searchTerm) > $config['max_length']) {
            return [
                'valid' => false,
                'message' => "❌ Le terme de recherche est trop long (maximum {$config['max_length']} caractères).\n\n" .
                    "Veuillez raccourcir votre recherche ou tapez /cancel pour annuler."
            ];
        }

        $specificValidation = $this->validateEntitySpecific($searchTerm, $entityType);
        if (!$specificValidation['valid']) {
            return $specificValidation;
        }

        if (preg_match('/[<>{}[\]\\\\|`]/', $searchTerm)) {
            return [
                'valid' => false,
                'message' => "❌ Le terme de recherche contient des caractères non autorisés.\n\n" .
                    "Veuillez utiliser uniquement des lettres, chiffres, espaces et tirets."
            ];
        }

        return ['valid' => true];
    }

    private function getEntitySearchConfig($entityType)
    {
        $configs = [
            'maraicher' => [
                'label' => 'des maraîchers',
                'min_length' => 2,
                'max_length' => 100,
            ],
            'installation' => [
                'label' => 'des installations',
                'min_length' => 1,
                'max_length' => 100,
            ],
            'intervention' => [
                'label' => 'des interventions',
                'min_length' => 2,
                'max_length' => 100,
            ],
            'rapport' => [
                'label' => 'des rapports de maintenance',
                'min_length' => 2,
                'max_length' => 100,
            ],
        ];

        return $configs[$entityType] ?? [
            'label' => 'des éléments',
            'min_length' => 2,
            'max_length' => 100,
        ];
    }

    private function validateEntitySpecific($searchTerm, $entityType)
    {
        switch ($entityType) {
            case 'installation':
                if (preg_match('/^[A-Z]\d{4}$/', $searchTerm)) {
                    return ['valid' => true];
                }
                break;

            case 'commande':
                if (is_numeric($searchTerm)) {
                    return ['valid' => true];
                }
                break;
        }

        return ['valid' => true];
    }
}
