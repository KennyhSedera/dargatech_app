<?php

namespace App\Services;

use DB;

class StepService
{
    protected SendMessageService $sendMessage;
    protected array $stepConfigurations;

    public function __construct(SendMessageService $sendMessage)
    {
        $this->sendMessage = $sendMessage;
        $this->initializeStepConfigurations();
    }

    private function initializeStepConfigurations()
    {
        $this->stepConfigurations = [
            'new_maraicher' => [
                'steps' => [
                    'nom', 'prenom', 'telephone', 'email', 'CIN', 'genre',
                    'localisation', 'type_activite_agricole', 'surface_cultivee', 'date_contrat'
                ],
                'prompts' => [
                    'nom' => "🌱 Veuillez entrer le *nom* du maraîcher :",
                    'prenom' => "✍️ Entrez maintenant le *prénom* :",
                    'telephone' => "📞 Entrez le *téléphone* :",
                    'localisation' => "📍 Entrez la *localisation* ou *adresse* :",
                    'genre' => "👤 Entrez le *genre* (Homme/Femme) :",
                    'email' => "📧 Entrez l'*email* :",
                    'CIN' => "🪪 Entrez le *CIN* :",
                    'date_contrat' => "📅 Entrez la *date de contrat* (AAAA-MM-JJ) :",
                    'type_activite_agricole' => "🌾 Entrez le *type d'activité agricole* :",
                    'surface_cultivee' => "📏 Entrez la *surface cultivée* (en hectares, ex : 0.5) :",
                ],
                'validation' => [
                    'email' => 'email',
                    'telephone' => 'phone',
                    'date_contrat' => 'date',
                    'surface_cultivee' => 'numeric',
                    'genre' => ['Homme', 'Femme']
                ]
            ],
            'new_installation' => [
                'steps' => [
                    'clientId', 'numero_serie', 'debit_nominal', 'puissance_pompe', 'profondeur_forage', 'hmt', 'source_eau', 'photo', 'latitude', 'longitude', 'date_installation'
                ],
                'prompts' => [
                    'clientId' => "👤 Veuillez entrer le *nom* du client :",
                    'numero_serie' => "📦 Entrez le *numéro de série* de la pompe :",
                    'debit_nominal' => "📏 Entrez le *debit nominal* de la pompe :",
                    'puissance_pompe' => "🔋 Entrez la *puissance de pompe* de la pompe :",
                    'profondeur_forage' => "📏 Entrez la *profondeur de forage* de la pompe :",
                    'hmt' => "📏 Entrez le *HMT* de la pompe :",
                    'source_eau' => "📏 Entrez la *source d'eau* de la pompe :",
                    'photo' => "📸 Ajoutez la *photo* de l'installation :",
                    'date_installation' => "📅 Entrez la *date d'installation* de la pompe (AAAA-MM-JJ) :",
                    'latitude' => "📍 Entrez la *latitude* de l'installation :",
                    'longitude' => "📍 Entrez la *longitude* de l'installation :"
                ],
                'validation' => [
                    'debit_nominal' => 'numeric',
                    'puissance_pompe' => 'numeric',
                    'profondeur_forage' => 'numeric',
                    'hmt' => 'numeric'
                ]
            ],
            'new_intervention' => [
                'steps' => [
                   'installation_id', 'type_intervention', 'description_probleme', 'date_intervention'
                ],
                'prompts' => [
                    'installation_id' => "📦 Veuillez entrer la *code de l'installation * :",
                    'type_intervention' => "🛠️ Entrez le *type d'intervention* (Curative/Préventive) :",
                    'description' => "📝 Entrez la *description* de l'intervention :",
                    'date_intervention' => "📅 Entrez la *date de l'intervention* (AAAA-MM-JJ) :"
                ],
                'validation' => [
                    'date_intervention' => 'date'
                ]
            ]
        ];
    }

    public function handleStep($step, $messageText, $data, $userId, $chatId, $command, $onComplete = null)
    {
        $messageText = trim($messageText);

        if (empty($messageText)) {
            $this->sendMessage->sendMessage($chatId, "❌ Ce champ est obligatoire. Veuillez fournir une valeur valide :");
            return;
        }

        if (!$this->validateStep($step, $messageText, $command, $chatId)) {
            return;
        }

        $data[$step] = $messageText;
        $nextStep = $this->getNextStep($step, $command);

        if ($nextStep) {
            $this->updateSession($userId, $command, $nextStep, $data);
            $this->sendMessage->sendMessage($chatId, $this->getPromptForStep($nextStep, $command), 'Markdown');
        } else {
            $this->completeSession($userId, $command, $data);

            if ($onComplete && is_callable($onComplete)) {
                $onComplete($data, $userId, $chatId);
            }
        }
    }

    private function validateStep($step, $value, $command, $chatId)
    {
        $validations = $this->stepConfigurations[$command]['validation'] ?? [];

        if (!isset($validations[$step])) {
            return true;
        }

        $validation = $validations[$step];

        switch ($validation) {
            case 'email':
                if (!filter_var($value, FILTER_VALIDATE_EMAIL)) {
                    $this->sendMessage->sendMessage($chatId, "❌ Format d'email invalide. Veuillez entrer un email valide :");
                    return false;
                }
                break;

            case 'phone':
                if (!preg_match('/^[+]?[0-9\s\-\(\)]{8,}$/', $value)) {
                    $this->sendMessage->sendMessage($chatId, "❌ Format de téléphone invalide. Veuillez entrer un numéro valide :");
                    return false;
                }
                break;

            case 'date':
                if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $value) || !strtotime($value)) {
                    $this->sendMessage->sendMessage($chatId, "❌ Format de date invalide. Utilisez le format AAAA-MM-JJ :");
                    return false;
                }
                break;

            case 'numeric':
                if (!is_numeric($value) || $value < 0) {
                    $this->sendMessage->sendMessage($chatId, "❌ Veuillez entrer un nombre valide :");
                    return false;
                }
                break;

            default:
                if (is_array($validation) && !in_array($value, $validation)) {
                    $options = implode(' / ', $validation);
                    $this->sendMessage->sendMessage($chatId, "❌ Valeur invalide. Choisissez parmi : {$options}");
                    return false;
                }
        }

        return true;
    }

    private function getNextStep($currentStep, $command)
    {
        $steps = $this->stepConfigurations[$command]['steps'] ?? [];
        $index = array_search($currentStep, $steps);

        return $steps[$index + 1] ?? null;
    }

    public function getPromptForStep($step, $command)
    {
        $prompts = $this->stepConfigurations[$command]['prompts'] ?? [];
        return $prompts[$step] ?? "Entrez la valeur pour {$step} :";
    }

    private function updateSession($userId, $command, $nextStep, $data)
    {
        DB::table('telegram_sessions')
            ->where('user_id', $userId)
            ->where('command', $command)
            ->where('completed', false)
            ->update([
                'step' => $nextStep,
                'data' => json_encode($data),
                'updated_at' => now()
            ]);
    }

    private function completeSession($userId, $command, $data)
    {
        DB::table('telegram_sessions')
            ->where('user_id', $userId)
            ->where('command', $command)
            ->where('completed', false)
            ->update([
                'completed' => true,
                'data' => json_encode($data),
                'updated_at' => now()
            ]);
    }

    public function getWorkflowConfig($command)
    {
        return $this->stepConfigurations[$command] ?? null;
    }

    public function addWorkflowConfig($command, $config)
    {
        $this->stepConfigurations[$command] = $config;
    }

    public function getFirstStep($command)
    {
        $steps = $this->stepConfigurations[$command]['steps'] ?? [];
        return $steps[0] ?? null;
    }

    public function workflowExists($command)
    {
        return isset($this->stepConfigurations[$command]);
    }
}
