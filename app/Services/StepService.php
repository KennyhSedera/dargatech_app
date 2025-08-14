<?php

namespace App\Services;

use DB;
use Log;
use Telegram\Bot\Api;
use Telegram\Bot\Keyboard\Keyboard;

class StepService
{
    protected SendMessageService $sendMessage;
    protected array $stepConfigurations;
    protected Api $telegram;

    public function __construct(SendMessageService $sendMessage, Api $telegram)
    {
        $this->sendMessage = $sendMessage;
        $this->initializeStepConfigurations();
        $this->telegram = $telegram;
    }

    private function initializeStepConfigurations()
    {
        $this->stepConfigurations = [
            'new_maraicher' => [
                'steps' => [
                    'nom',
                    'prenom',
                    'telephone',
                    'email',
                    'CIN',
                    'genre',
                    'localisation',
                    'type_activite_agricole',
                    'surface_cultivee',
                    'date_contrat'
                ],
                'prompts' => [
                    'nom' => "🌱 Veuillez entrer le *nom* du maraîcher :",
                    'prenom' => "✍️ Entrez maintenant le *prénom* :",
                    'telephone' => "📞 Entrez le *téléphone* :",
                    'localisation' => "📍 Entrez la *localisation* ou *adresse* :",
                    'genre' => "👤 Entrez le *genre* :",
                    'email' => "📧 Entrez l'*email* :",
                    'CIN' => "🪪 Entrez le *CIN* :",
                    'date_contrat' => "📅 Entrez la *date de contrat* (AAAA-MM-JJ) :",
                    'type_activite_agricole' => "🌾 Entrez le *type d'activité agricole* :",
                    'surface_cultivee' => "📏 Entrez la *surface cultivée* (en hectares, ex : 0.5) :",
                ],
                'keyboards' => [
                    'genre' => [
                        ['Homme', 'Femme']
                    ],
                    'type_activite_agricole' => [
                        ['Maraîchage', 'Arboriculture'],
                        ['Céréaliculture', 'Élevage'],
                        ['Agriculture mixte', 'Autre']
                    ]
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
                    'client_id',
                    'numero_serie',
                    'debit_nominal',
                    'puissance_pompe',
                    'profondeur_forage',
                    'hmt',
                    'source_eau',
                    'photo',
                    'latitude',
                    'longitude',
                    'date_installation'
                ],
                'prompts' => [
                    'client_id' => "👤 Veuillez entrer le *nom* du client :",
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
                'keyboards' => [
                    'source_eau' => [
                        ['Forage', 'Puits'],
                        ['Etang', 'Barrage'],
                        ['Rivière', 'Autre']
                    ]
                ],
                'validation' => [
                    'debit_nominal' => 'numeric',
                    'puissance_pompe' => 'numeric',
                    'profondeur_forage' => 'numeric',
                    'hmt' => 'numeric',
                    'date_installation' => 'date',
                    'photo' => 'file_exists',
                    'latitude' => 'numeric',
                    'longitude' => 'numeric'
                ]
            ],
            'new_intervention' => [
                'steps' => [
                    'installation_id',
                    'type_intervention',
                    'description_probleme',
                    'photo',
                    'date_intervention'
                ],
                'prompts' => [
                    'installation_id' => "📦 Veuillez entrer la *code de l'installation * :",
                    'type_intervention' => "🛠️ Entrez le *type d'intervention* :",
                    'description_probleme' => "📝 Entrez la *description du problème* :",
                    'photo' => "📸 Ajoutez la *photo* de l'intervention :",
                    'date_intervention' => "📅 Entrez la *date de l'intervention* (AAAA-MM-JJ) :"
                ],
                'keyboards' => [
                    'type_intervention' => [
                        ['Curative', 'Préventive'],
                        ['Maintenance', 'Réparation'],
                        ['Installation', 'Diagnostic']
                    ]
                ],
                'validation' => [
                    'date_intervention' => 'date',
                    'photo' => 'file_exists'
                ]
            ]
        ];
    }

    public function handleStep($step, $message, $data, $userId, $chatId, $command, $onComplete = null)
    {
        $messageText = null;
        $filename = null;

        $photoService = new PhotoService($this->sendMessage, $this->telegram);

        $nextStep = $this->getNextStep($step, $command);

        if ($step === 'photo') {
            $existingPhotos = [];
            if (!empty($data['photo']) && $data['photo'] !== 'null') {
                $existingPhotos = json_decode($data['photo'], true) ?: [];
            }

            if (!empty($message->photo)) {
                $photo = $photoService->upload($message, $chatId);
                $filename = $photo[1] ?? null;

                if (empty($existingPhotos)) {
                    $messageText = $photo[0] ?? null;
                    if (!$this->validateStep($step, $messageText, $command, $chatId)) {
                        return;
                    }
                }

                if ($filename) {
                    $existingPhotos[] = $filename;
                }
                $data['photo'] = json_encode($existingPhotos);

                $this->updateSession($userId, $command, 'photo', $data);

                $text = "📸 Vous pouvez envoyer une autre photo ou \n";
                $text .= $this->getPromptForStep($nextStep, $command);
                $this->sendMessage->sendMessage($chatId, $text, 'Markdown');
                return;
            }

            $messageText = trim($message->text ?? '');
            if (empty($messageText)) {
                $this->sendMessage->sendMessage($chatId, "❌ Ce champ est obligatoire. Veuillez fournir une valeur valide :");
                return;
            }

            $data[$nextStep] = $messageText;

            $this->updateSession($userId, $command, $this->getNextStep($nextStep, $command), $data);
            $this->sendStepMessage($chatId, $this->getNextStep($nextStep, $command), $command);
            return;
        }

        if (!empty($message->photo)) {
            $photo = $photoService->upload($message, $chatId);
            $filename = $photo[1] ?? null;
            $messageText = $photo[0] ?? null;
        } elseif (!empty($message->document) && isset($message->document->file_id)) {
            $fileId = $message->document->file_id;
            $savedPath = $photoService->downloadTelegramFile($fileId);
            if (!$savedPath) {
                $this->sendMessage->sendMessage($chatId, "❌ Erreur lors du téléchargement du document. Veuillez réessayer.");
                return;
            }
            $messageText = $savedPath;
        } else {
            $messageText = trim($message->text ?? '');
        }

        if (empty($messageText)) {
            $this->sendMessage->sendMessage($chatId, "❌ Ce champ est obligatoire. Veuillez fournir une valeur valide :");
            return;
        }

        if (!$this->validateStep($step, $messageText, $command, $chatId)) {
            return;
        }

        $data[$step] = $messageText;
        $nextStep = $this->getNextStep($step, $command);

        if ($step === 'client_id') {
            $exist = DB::table('clients')->where('id', $messageText)->exists();
            if ($exist) {
                if ($nextStep) {
                    $this->updateSession($userId, $command, $nextStep, $data);
                    $this->sendStepMessage($chatId, $nextStep, $command);
                } else {
                    $this->completeSession($userId, $command, $data);
                    if ($onComplete && is_callable($onComplete)) {
                        $onComplete($data, $userId, $chatId);
                    }
                }
            } else {
                $this->sendMessage->sendMessage($chatId, "❌ Le client n'existe pas. Veuillez fournir un client existant :");
            }
        } else {
            if ($nextStep) {
                $this->updateSession($userId, $command, $nextStep, $data);
                $this->sendStepMessage($chatId, $nextStep, $command);
            } else {
                $this->completeSession($userId, $command, $data);
                if ($onComplete && is_callable($onComplete)) {
                    $onComplete($data, $userId, $chatId);
                }
            }
        }
    }

    private function sendStepMessage($chatId, $step, $command)
    {
        $prompt = $this->getPromptForStep($step, $command);
        $keyboard = $this->getKeyboardForStep($step, $command);

        if ($keyboard) {
            $this->sendMessage->sendMessageWithKeyboard($chatId, $prompt, $keyboard, 'Markdown');
        } else {
            $this->sendMessage->sendMessage($chatId, $prompt, 'Markdown');
        }
    }

    private function getKeyboardForStep($step, $command)
    {
        $keyboards = $this->stepConfigurations[$command]['keyboards'] ?? [];

        if (!isset($keyboards[$step])) {
            return null;
        }

        $keyboardButtons = $keyboards[$step];

        return Keyboard::make()
            ->setKeyboard($keyboardButtons)
            ->setOneTimeKeyboard(true)
            ->setResizeKeyboard(true)
            ->setSelective(false);
    }

    private function validateStep($step, $value, $command, $chatId)
    {
        $validations = $this->stepConfigurations[$command]['validation'] ?? [];

        if (!isset($validations[$step])) {
            return true;
        }

        $validation = $validations[$step];

        if ($validation === 'file_exists') {
            if (!file_exists($value)) {
                $this->sendMessage->sendMessage($chatId, "❌ Fichier image introuvable. Veuillez renvoyer une photo valide.");
                return false;
            }
            return true;
        }

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

            case 'photo':
                if (!preg_match('/^[A-Za-z0-9_-]+$/', $value)) {
                    $this->sendMessage->sendMessage($chatId, "❌ Veuillez envoyer une photo valide.");
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

        if ($index === false) {
            return null;
        }

        return $steps[$index + 1] ?? null;
    }

    public function getPromptForStep($step, $command)
    {
        $prompts = $this->stepConfigurations[$command]['prompts'] ?? [];
        return $prompts[$step] ?? "Entrez la valeur pour {$step} :";
    }

    public function startStep($chatId, $command)
    {
        $steps = $this->stepConfigurations[$command]['steps'] ?? [];
        if (empty($steps)) {
            return;
        }

        $firstStep = $steps[0];
        $this->sendStepMessage($chatId, $firstStep, $command);
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
}
