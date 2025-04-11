<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use PDF;
use Mail;
use App\Mail\PaiementPdfMail;
use Illuminate\Support\Facades\View;

class PaiementPdfController extends Controller
{
    /**
     * Générer et envoyer le PDF par email
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function generateAndSendPdf(Request $request)
    {
        // Valider les données reçues
        $validatedData = $request->validate([
            'email' => 'required|email',
            'data' => 'required|array',
            'data.numero' => 'required|string',
            'data.lieu_creation' => 'required|string',
            'data.date_creation' => 'required|date',
            'data.date' => 'required|date',
            'data.nom_vendeur' => 'required|string',
            'data.ville_vendeur' => 'required|string',
            'data.pays_vendeur' => 'required|string',
            'data.civilite_acheteur' => 'required|string',
            'data.nom_acheteur' => 'required|string',
            'data.ville_acheteur' => 'required|string',
            'data.pays_acheteur' => 'required|string',
            'data.periode_couverte' => 'required|string',
            'data.produits' => 'required|array',
            'data.produits.*.designation' => 'nullable|string',
            'data.produits.*.reference' => 'nullable|string',
            'data.produits.*.quantite' => 'nullable|numeric',
            'data.produits.*.prix_unitaire' => 'nullable|numeric',
            'data.produits.*.tva' => 'nullable|numeric',
            'data.montant_paye' => 'nullable|string',
            'data.mode_paiement' => 'nullable|string',
        ]);

        // Compléter les données avec les informations bancaires
        $pdfData = $request->data;
        $pdfData['banque'] = 'TG055';
        $pdfData['iban'] = 'TG53TG0550271314144776000172';

        // Calculer les totaux
        $totalHT = 0;
        $totalTVA = 0;

        foreach ($pdfData['produits'] as &$produit) {
            $produitHT = $produit['quantite'] * $produit['prix_unitaire'];
            $produitTVA = $produitHT * ($produit['tva'] / 100);
            
            $totalHT += $produitHT;
            $totalTVA += $produitTVA;
            
            // Convertir en format lisible pour l'affichage
            $produit['total_ht'] = $produitHT;
            $produit['montant_tva'] = $produitTVA;
            $produit['total_ttc'] = $produitHT + $produitTVA;
        }

        $pdfData['total_ht'] = $totalHT;
        $pdfData['total_tva'] = $totalTVA;
        $pdfData['total_ttc'] = $totalHT + $totalTVA;

        // Générer le PDF
        $pdf = PDF::loadView('pdf.paiement', ['data' => $pdfData]);
        
        // Options de PDF
        $pdf->setPaper('a4');
        $pdf->setOption('margin-top', 10);
        $pdf->setOption('margin-bottom', 10);
        $pdf->setOption('margin-right', 10);
        $pdf->setOption('margin-left', 10);

        // Enregistrer temporairement le PDF
        $filename = 'recu_paiement_' . $pdfData['numero'] . '.pdf';
        $pdfPath = storage_path('app/public/temp/' . $filename);
        
        // Assurer que le répertoire existe
        if (!file_exists(storage_path('app/public/temp'))) {
            mkdir(storage_path('app/public/temp'), 0755, true);
        }
        
        $pdf->save($pdfPath);

        // Envoyer le PDF par email
        try {
            Mail::to($request->email)
                ->send(new PaiementPdfMail($pdfPath, $pdfData, $filename));
            
            // Supprimer le fichier temporaire après envoi
            if (file_exists($pdfPath)) {
                unlink($pdfPath);
            }
            
            return response()->json([
                'success' => true,
                'message' => 'Le reçu de paiement a été envoyé avec succès à ' . $request->email
            ]);
        } catch (\Exception $e) {
            // Supprimer le fichier temporaire en cas d'erreur
            if (file_exists($pdfPath)) {
                unlink($pdfPath);
            }
            
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'envoi de l\'email: ' . $e->getMessage()
            ], 500);
        }
    }
}