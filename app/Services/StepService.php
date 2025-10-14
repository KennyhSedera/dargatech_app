<?php

namespace App\Services;

use App\Models\Maintenance;
use DB;
use Log;
use Telegram\Bot\Api;
use Telegram\Bot\Keyboard\Keyboard;

class StepService
{
    protected SendMessageService $sendMessage;
    public array $stepConfigurations;
    protected Api $telegram;

    public function __construct(SendMessageService $sendMessage, Api $telegram)
    {
        $this->sendMessage = $sendMessage;
        $this->initializeStepConfigurations();
        $this->telegram = $telegram;
    }

    public function initializeStepConfigurations()
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
                    'adress',
                    'type_activite_agricole',
                    'surface_cultivee',
                    'date_contrat',
                    'data_maraicher',
                ],
                'prompts' => [
                    'data_maraicher' => "
                    🌱 *Veillez entrer les informations successivement :*\n nom;\n prenom;\n telephone;\n email;\n CIN;\n genre (Homme/Femme);\n adress;\n type_activite_agricole;\n surface_cultivee (en hectares);\n date_contrat (AAAA-MM-JJ)",
                    'nom' => "👤 Veuillez entrer le *nom* du maraîcher :",
                    'prenom' => "👤 Veuillez entrer le *prénom* du maraîcher :",
                    'telephone' => "📞 Veuillez entrer le *numéric* du maraîcher :",
                    'email' => "📧 Veuillez entrer l'adresse *email* du maraîcher :",
                    'CIN' => "📝 Veuillez entrer le *CIN* du maraîcher :",
                    'genre' => "👤 Veuillez entrer le *genre* du maraîcher :",
                    'adress' => "🌱 Veuillez entrer l'adresse du maraîcher :",
                    'type_activite_agricole' => "🌱 Veuillez entrer le type d'activité agricole du maraîcher :",
                    'surface_cultivee' => "🌱 Veuillez entrer la surface cultivee du maraîcher :",
                    'date_contrat' => "📆 Veuillez entrer la date du contrat du maraîcher (AAAA-MM-JJ):"
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
                    'data_installation',
                    // 'numero_serie',
                    // 'debit_nominal',
                    // 'puissance_pompe',
                    // 'profondeur_forage',
                    // 'hmt',
                    // 'source_eau',
                    'localisation',
                    'photo',
                    'date_installation',
                ],
                'prompts' => [
                    'data_installation' => "
                    📦 *Veillez entrer les informations successivement :*\n numéro de série;\n debit nominal (m³/h);\n Puissance crête installé (W);\n Distance maximale pompe champ PV (m);\n HMT de la pompe;\n source d'eau (Forage / Puits / Etang / Barrage / Rivière / Autre)',
                    ",
                    'client_id' => "👤 Veuillez entrer le *numero* du maraicher :",
                    'numero_serie' => "📦 Entrez le *numéro de série* de la pompe :",
                    'debit_nominal' => "📏 Entrez le *debit nominal (m³/h)* :",
                    'puissance_pompe' => "🔋 Entrez la *Puissance crête installé (W)* :",
                    'profondeur_forage' => "📏 Entrez la *Distance maximale pompe champ PV (m)* :",
                    'hmt' => "📏 Entrez le *HMT* de la pompe :",
                    'source_eau' => "📏 Entrez la *source d'eau* de la pompe :",
                    'photo' => "📸 Ajoutez la *photo* de l'installation :",
                    'date_installation' => "📅 Entrez la *date d'installation* de la pompe (AAAA-MM-JJ) :",
                    'localisation' => "📍 Envoyez la localisation de l'installation en utilisant le bouton de localisation de Telegram. :"
                ],
                'keyboards' => [
                    'source_eau' => [
                        ['Forage', 'Puits'],
                        ['Etang', 'Barrage'],
                        ['Rivière', 'Autre']
                    ]
                ],
                'validation' => [
                    'client_id' => 'numeric',
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
            ],
            'new_rapport_maintenance' => [
                'steps' => [
                    'maintenanceId',
                    'diagnostic_initial',
                    'cause_identifiee',
                    'intervention_realisee',
                    'verification_fonctionnement',
                    'recommandation_client',
                    'photo',
                    'date_intervention',
                ],
                'prompts' => [
                    'maintenanceId' => "📦 Veuillez entrer la *code de l'installation * :",
                    'diagnostic_initial' => "📝 Entrez la *vérifications préliminaires* :",
                    'cause_identifiee' => "📝 Entrez la *résultat du diagnostic * :",
                    'intervention_realisee' => "📝 Entrez l'*actions correctives* :",
                    'verification_fonctionnement' => "📝 Entrez la *vérification du fonctionnement* :",
                    'recommandation_client' => "📝 Entrez la *recommandation au client* :",
                    'photo' => "📸 Ajoutez la *photo* de l'intervention :",
                    'date_intervention' => "📅 Entrez la *date de l'intervention* (AAAA-MM-JJ) :"
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

        if ($step === 'location' || $step === 'localisation') {
            if (!empty($message->location)) {
                $latitude = $message->location->latitude;
                $longitude = $message->location->longitude;

                Log::info("Location: " . $latitude . ", " . $longitude);

                $locationData = [
                    $latitude,
                    $longitude,
                ];

                $data[$step] = json_encode($locationData);

                if ($nextStep) {
                    $this->updateSession($userId, $command, $nextStep, $data);
                    $this->sendStepMessage($chatId, $nextStep, $command);
                } else {
                    $this->completeSession($userId, $command, $data);
                    if ($onComplete && is_callable($onComplete)) {
                        $onComplete($data, $userId, $chatId);
                    }
                }

                return;
            } else {
                $this->sendMessage->sendMessage($chatId, "📍 Veuillez partager votre localisation en utilisant le bouton de localisation de Telegram.");
                return;
            }
        }

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
                    $existingPhotos[] = 'storage/installation/' . $filename;
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

            $finalStep = $this->getNextStep($nextStep, $command);
            if ($finalStep) {
                $this->updateSession($userId, $command, $finalStep, $data);
                $this->sendStepMessage($chatId, $finalStep, $command);
            } else {
                $this->completeSession($userId, $command, $data);
                if ($onComplete && is_callable($onComplete)) {
                    $onComplete($data, $userId, $chatId);
                }
            }
            return;
        }

        if (!empty($message->location)) {
            $latitude = $message->location->latitude;
            $longitude = $message->location->longitude;
            $messageText = "Localisation: $latitude,$longitude";
        } elseif (!empty($message->photo)) {
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
                $this->sendMessage->sendMessage($chatId, "❌ Le numéro de client n'existe pas. Veuillez fournir un client existant :");
            }
        } else if ($step === 'installation_id') {
            $installation = DB::table('installations')->where('code_installation', $data[$step])->first();

            if ($installation) {
                if ($installation->statuts !== 'installée') {
                    $this->sendMessage->sendMessage($chatId, "❌ L'installation est déjà en cours de traitement. Veuillez fournir une autre installation :");
                } else {
                    $data[$step] = $installation->id;

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

            } else {
                $this->sendMessage->sendMessage($chatId, "❌ Le code d'installation n'existe pas. Veuillez fournir un installation existant :");
            }
        } else if ($step === 'maintenanceId') {
            $maintenances = Maintenance::whereHas('installation', function ($query) use ($data, $step) {
                $query->where('code_installation', $data[$step]);
            })
                ->where('status_intervention', 'en attente')
                ->with(['installation', 'installation.client'])
                ->first();
            if ($maintenances->id) {
                $data[$step] = $maintenances->id;
                $data['clientId'] = $maintenances->installation->client_id;
                $data['description_panne'] = $maintenances->description_probleme;
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
                $this->sendMessage->sendMessage($chatId, "❌ La maintenance de l'installation {$data[$step]} n'existe pas. Veuillez fournir une maintenance existante :");
            }
        } else if ($step === 'data_maraicher') {
            $datam = TextService::segment($messageText);

            $keys = [
                'nom',
                'prenom',
                'telephone',
                'email',
                'CIN',
                'genre',
                'adress',
                'type_activite_agricole',
                'surface_cultivee',
                'date_contrat'
            ];

            $maraicher = [];
            foreach ($keys as $index => $key) {
                $maraicher[$key] = $datam[$index] ?? null;
            }

            $data = $maraicher;

            if ($nextStep) {
                $this->updateSession($userId, $command, $nextStep, $data);
                $this->sendStepMessage($chatId, $nextStep, $command);
            } else {
                $this->completeSession($userId, $command, $data);
                if ($onComplete && is_callable($onComplete)) {
                    $onComplete($data, $userId, $chatId);
                }
            }
        } else if ($step === 'data_installation') {
            $datam = TextService::segment($messageText);

            $keys = [
                'numero_serie',
                'debit_nominal',
                'puissance_pompe',
                'profondeur_forage',
                'hmt',
                'source_eau',
            ];

            $installation = [];
            foreach ($keys as $index => $key) {
                $installation[$key] = $datam[$index] ?? null;
            }

            $data = $data + $installation;

            if ($nextStep) {
                $this->updateSession($userId, $command, $nextStep, $data);
                $this->sendStepMessage($chatId, $nextStep, $command);
            } else {
                $this->completeSession($userId, $command, $data);
                if ($onComplete && is_callable($onComplete)) {
                    $onComplete($data, $userId, $chatId);
                }
            }
        } else if ($step === 'data_intervention') {
            $datam = TextService::segment($messageText);

            $keys = [
                'description_panne',
                'description_probleme',
                'date_panne',
                'heure_panne',
                'date_intervention',
                'type_intervention',
            ];

            $intervention = [];
            foreach ($keys as $index => $key) {
                $intervention[$key] = $datam[$index] ?? null;
            }

            $data = $intervention;

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
