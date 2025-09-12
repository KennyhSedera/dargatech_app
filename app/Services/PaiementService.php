<?php

namespace App\Services;

use App\Models\Paiement;
use DB;
use Http;
use Log;
use PDF;

class PaiementService
{
    protected SendMessageService $sendMessageService;

    public function __construct(SendMessageService $sendMessageService)
    {
        $this->sendMessageService = $sendMessageService;
    }

    public function handlePaiement($data)
    {
        Log::info($data);
    }
    public function handleGenerateRecu($messageText, $userId, $chatId)
    {
        $paiementInfo = Paiement::with(['client', 'produits'])
            ->where('numero', $messageText->text)
            ->first();

        if (!$paiementInfo) {
            $this->sendMessageService->sendMessage($userId, $chatId, "❌ Le recu n'existe pas.");
            return;
        }

        $pdfData = [
            'type' => 'recu',
            'numero' => $paiementInfo->numero,
            'date_creation' => $paiementInfo->date_creation,
            'date' => $paiementInfo->date,
            'lieu_creation' => $paiementInfo->lieu_creation,
            'date_additionnel' => $paiementInfo->date_additionnel,
            'periode_couverte' => $paiementInfo->periode_couverte,
            'nom_vendeur' => $paiementInfo->nom_vendeur,
            'nom_vendeurs' => $paiementInfo->nom_vendeurs,
            'select1' => $paiementInfo->select1,
            'num_tva' => $paiementInfo->num_tva ?? '',
            'nom_rue_vendeur' => $paiementInfo->nom_rue_vendeur,
            'ville_vendeur' => $paiementInfo->ville_vendeur,
            'pays_vendeur' => $paiementInfo->pays_vendeur,

            'civilite_acheteur' => $this->getCivilite($paiementInfo->client->genre),
            'prenom_acheteur' => $paiementInfo->client->prenom,
            'nom_acheteur' => $paiementInfo->client->nom,
            'num_rue_acheteur' => $paiementInfo->client->localisation ?? '',
            'ville_acheteur' => $paiementInfo->client->localisation ?? '',
            'pays_acheteur' => 'Togo',

            'mode_paiement' => $paiementInfo->mode_paiement,
            'date_echeance' => $paiementInfo->echeance,
            'date_paiement' => $paiementInfo->date_paiement,
            'etat_paiment' => $paiementInfo->statut_paiement,
            'montant_paye' => $paiementInfo->montant,
            'objet' => $paiementInfo->observation ?? '',
            'description' => $paiementInfo->description ?? '',

            'produits' => $this->formatProduits($paiementInfo->produits),
            'client_id' => $paiementInfo->client_id,
        ];

        $this->generatePdf($pdfData, $userId, $chatId);
        return $pdfData;
    }

    private function getCivilite($genre)
    {
        return match (strtolower($genre)) {
            'homme' => 'Mr.',
            'femme' => 'Mme.',
            default => 'Mr./Mme.'
        };
    }

    private function formatProduits($produits)
    {
        return $produits->map(function ($produit) {
            return [
                'designation' => $produit->designation,
                'reference' => $produit->reference ?? '',
                'quantite' => $produit->quantite,
                'unite' => $produit->unite ?? 'unité',
                'tva' => floatval($produit->tva),
                'prix_unitaire' => floatval($produit->prix_unitaire),
                'total_ht' => floatval($produit->total_ht),
                'total_ttc' => floatval($produit->total_ttc),
            ];
        })->toArray();
    }

    public function generatePdf($pdfData, $userId, $chatId)
    {
        try {
            $pdfData['banque'] = 'TG055';
            $pdfData['iban'] = 'TG53TG0550271314144776000172';

            $totalHT = 0;
            $totalTVA = 0;

            foreach ($pdfData['produits'] as &$produit) {
                $produitHT = $produit['quantite'] * $produit['prix_unitaire'];
                $produitTVA = $produitHT * ($produit['tva'] / 100);

                $totalHT += $produitHT;
                $totalTVA += $produitTVA;

                $produit['total_ht'] = $produitHT;
                $produit['montant_tva'] = $produitTVA;
                $produit['total_ttc'] = $produitHT + $produitTVA;
            }

            $pdfData['total_ht'] = $totalHT;
            $pdfData['total_tva'] = $totalTVA;
            $pdfData['total_ttc'] = $totalHT + $totalTVA;

            $pdf = PDF::loadView('pdf.paiement', ['data' => $pdfData]);

            $pdf->setPaper('a4');
            $pdf->setOption('margin-top', 10);
            $pdf->setOption('margin-bottom', 10);
            $pdf->setOption('margin-right', 10);
            $pdf->setOption('margin-left', 10);

            $filename = 'recu_paiement_' . $pdfData['numero'] . '.pdf';
            $pdfPath = storage_path('app/public/temp/' . $filename);

            if (!file_exists(storage_path('app/public/temp'))) {
                mkdir(storage_path('app/public/temp'), 0755, true);
            }

            $pdf->save($pdfPath);

            $telegramSent = false;

            if (!empty($chatId)) {
                try {
                    $telegramSent = $this->sendPdfToTelegram($pdfPath, $filename, $chatId, $pdfData);
                } catch (\Exception $e) {
                    Log::error('Erreur envoi Telegram: ' . $e->getMessage());
                }
            }

            if (file_exists($pdfPath)) {
                unlink($pdfPath);
            }

            if ($telegramSent) {
                DB::table('telegram_sessions')
                    ->where('user_id', $userId)
                    ->where('command', 'generate_recu')
                    ->delete();

                return [
                    'success' => true,
                    'message' => 'PDF envoyé au chat Telegram',
                    'filename' => $filename
                ];
            }

        } catch (\Exception $e) {
            Log::error("Erreur génération PDF", [
                'error' => $e->getMessage(),
                'numero' => $pdfData['numero'] ?? 'N/A'
            ]);

            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    private function sendPdfToTelegram($pdfPath, $filename, $chatId, $pdfData)
    {
        $botToken = env('TELEGRAM_BOT_TOKEN');

        if (!$botToken) {
            throw new \Exception('Token Telegram non configuré');
        }

        $telegramApiUrl = "https://api.telegram.org/bot{$botToken}/sendDocument";

        $caption = "✅ Reçu de paiement N° {$pdfData['numero']} générer le" . now()->format('d/m/Y') . " avec succès\n";

        $response = Http::attach(
            'document',
            file_get_contents($pdfPath),
            $filename
        )->post($telegramApiUrl, [
                    'chat_id' => $chatId,
                    'caption' => $caption,
                    'parse_mode' => 'HTML'
                ]);

        if (!$response->successful()) {
            $errorMessage = $response->json()['description'] ?? 'Erreur inconnue';
            throw new \Exception('Erreur API Telegram: ' . $errorMessage);
        }

        return true;
    }
}
