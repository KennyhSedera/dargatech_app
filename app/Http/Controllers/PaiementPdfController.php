<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use PDF;
use Mail;
use App\Mail\PaiementPdfMail;
use App\Models\Paiement;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PaiementPdfController extends Controller
{
    public function generateAndSendPdf(Request $request)
    {
        $pdfData = $request->data;
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

        $emailSent = false;
        $telegramSent = false;

        if (!empty($request->email)) {
            try {
                Mail::to($request->email)
                    ->send(new PaiementPdfMail($pdfPath, $pdfData, $filename));
                $emailSent = true;
            } catch (\Exception $e) {
                Log::error('Erreur envoi email: ' . $e->getMessage());
            }
        }

        if (!empty($request->telegram_chat_id)) {
            try {
                $telegramSent = $this->sendPdfToTelegram($pdfPath, $filename, $request->telegram_chat_id, $pdfData);
            } catch (\Exception $e) {
                Log::error('Erreur envoi Telegram: ' . $e->getMessage());
            }
        }

        if (file_exists(filename: $pdfPath)) {
            unlink($pdfPath);
        }

        if ($emailSent || $telegramSent) {
            $message = 'Le reçu de paiement a été envoyé avec succès';
            if ($emailSent && $telegramSent) {
                $message .= ' par email à ' . $request->email . ' et par Telegram.';
            } elseif ($emailSent) {
                $message .= ' par email à ' . $request->email . '.';
            } elseif ($telegramSent) {
                $message .= ' par Telegram.';
            }

            return response()->json([
                'success' => true,
                'message' => $message,
                'email_sent' => $emailSent,
                'telegram_sent' => $telegramSent
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'envoi du reçu de paiement.'
            ], 500);
        }
    }

    private function sendPdfToTelegram($pdfPath, $filename, $chatId, $pdfData)
    {
        $botToken = env('TELEGRAM_BOT_TOKEN');

        if (!$botToken) {
            throw new \Exception('Token Telegram non configuré');
        }

        $telegramApiUrl = "https://api.telegram.org/bot{$botToken}/sendDocument";

        $caption = "📄 Reçu de paiement N° {$pdfData['numero']}\n";
        $caption .= "💰 Total TTC: " . number_format($pdfData['total_ttc'], 2, ',', ' ') . " €\n";
        $caption .= "📅 Date: " . date('d/m/Y');

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
    public function echeanceclient(Request $request, $id)
    {
        $paiement = Paiement::where('client_id', $id)
            ->orderBy('id', 'desc')
            ->get();

        return response()->json($paiement);
    }

}
