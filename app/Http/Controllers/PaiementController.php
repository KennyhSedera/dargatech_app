<?php
namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Paiement;
use App\Models\Products;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Log;

class PaiementController extends Controller
{
    public function index()
    {
        $data = Paiement::with(['client'])
            ->orderBy('created_at', 'asc')->get();

        return response()->json(['data' => $data], 200);
    }

    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'numero' => 'required|string',
                'client_id' => 'required|exists:clients,id',
                'montant' => 'required|numeric|min:0',
                'date_paiement' => 'required|date',
                'mode_paiement' => 'required|string',
                'periode_couverte' => 'required|string',
                'echeance' => 'nullable|string',
                'date_echeance' => 'nullable|date',
                'statut_paiement' => 'nullable|string',
                'observation' => 'nullable|string',
                'description' => 'nullable|string',
                'produits' => 'array',
                'produits.*.designation' => 'required|string',
                'produits.*.prix_unitaire' => 'required|numeric|min:0',
                'produits.*.quantite' => 'required|integer|min:1',
                'produits.*.unite' => 'nullable|string',
                'date_creation' => 'nullable|date',
                'date' => 'nullable|date',
                'lieu_creation' => 'nullable|string',
                'date_additionnel' => 'nullable|string',
                'nom_vendeur' => 'nullable|string',
                'nom_vendeurs' => 'nullable|string',
                'select1' => 'nullable|string',
                'num_tva' => 'nullable|string',
                'nom_rue_vendeur' => 'nullable|string',
                'ville_vendeur' => 'nullable|string',
                'pays_vendeur' => 'nullable|string',
                'ville_acheteur' => 'nullable|string',
                'pays_acheteur' => 'nullable|string',
                'num_rue_acheteur' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Erreur de validation',
                    'errors' => $validator->errors(),
                    'success' => false
                ], 422);
            }

            $validatedData = $validator->validated();

            $clientData = [];
            if (isset($validatedData['ville_acheteur'])) {
                $clientData['ville_acheteur'] = $validatedData['ville_acheteur'];
                unset($validatedData['ville_acheteur']);
            }
            if (isset($validatedData['pays_acheteur'])) {
                $clientData['pays_acheteur'] = $validatedData['pays_acheteur'];
                unset($validatedData['pays_acheteur']);
            }
            if (isset($validatedData['num_rue_acheteur'])) {
                $clientData['localisation'] = $validatedData['num_rue_acheteur'];
                unset($validatedData['num_rue_acheteur']);
            }

            if (!empty($clientData)) {
                $client = Client::findOrFail($request->client_id);
                $client->update($clientData);
            }

            $paiement = Paiement::create($validatedData);

            if ($request->has('produits')) {
                foreach ($request->produits as $produit) {
                    Products::create([
                        'designation' => $produit['designation'],
                        'prix_unitaire' => $produit['prix_unitaire'],
                        'reference' => $produit['reference'] ?? null,
                        'quantite' => $produit['quantite'],
                        'unite' => $produit['unite'] ?? null,
                        'tva' => $produit['tva'] ?? null,
                        'total_ht' => $produit['total_ht'] ?? null,
                        'total_ttc' => $produit['total_ttc'] ?? null,
                        'paiement_id' => $paiement->id,
                    ]);
                }
            }

            return response()->json([
                'message' => 'Paiement ajouté avec succès !',
                'paiement' => $paiement,
                'success' => true,
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la création du paiement',
                'error' => $e->getMessage(),
                'success' => false
            ], 500);
        }
    }

    public function findLastPaiement()
    {
        $data = Paiement::with('client')->latest()->first();

        return response()->json(['data' => $data], 200);
    }

    public function show($id)
    {
        $data = Paiement::with(['client', 'produits'])->find($id);

        if (!$data) {
            return response()->json([
                'message' => 'Paiement non trouvé.',
            ], 404);
        }

        return response()->json($data, 200);
    }

    public function update(Request $request, $id)
    {
        $paiement = Paiement::find($id);

        if (!$paiement) {
            return response()->json([
                'message' => 'Paiement non trouvé.',
                'success' => false
            ], 404);
        }

        try {
            $validator = Validator::make($request->all(), [
                'client_id' => 'required|exists:clients,id',
                'montant' => 'required|numeric|min:0',
                'date_paiement' => 'required|date',
                'mode_paiement' => 'required|string',
                'periode_couverte' => 'required|string',
                'date_echeance' => 'nullable|date',
                'echeance' => 'nullable|string',
                'statut_paiement' => 'nullable|string',
                'observation' => 'nullable|string',
                'description' => 'nullable|string',
                'produits' => 'array',
                'produits.*.designation' => 'required|string',
                'produits.*.prix_unitaire' => 'required|numeric|min:0',
                'produits.*.quantite' => 'required|integer|min:1',
                'produits.*.unite' => 'nullable|string',
                'date_creation' => 'nullable|date',
                'date' => 'nullable|date',
                'lieu_creation' => 'nullable|string',
                'date_additionnel' => 'nullable|string',
                'nom_vendeur' => 'nullable|string',
                'nom_vendeurs' => 'nullable|string',
                'select1' => 'nullable|string',
                'num_tva' => 'nullable|string',
                'nom_rue_vendeur' => 'nullable|string',
                'ville_vendeur' => 'nullable|string',
                'pays_vendeur' => 'nullable|string',
                'ville_acheteur' => 'nullable|string',
                'pays_acheteur' => 'nullable|string',
                'num_rue_acheteur' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Erreur de validation',
                    'errors' => $validator->errors(),
                    'success' => false
                ], 422);
            }

            $validatedData = $validator->validated();

            $clientData = [];
            if (isset($validatedData['ville_acheteur'])) {
                $clientData['ville_acheteur'] = $validatedData['ville_acheteur'];
                unset($validatedData['ville_acheteur']);
            }
            if (isset($validatedData['pays_acheteur'])) {
                $clientData['pays_acheteur'] = $validatedData['pays_acheteur'];
                unset($validatedData['pays_acheteur']);
            }
            if (isset($validatedData['num_rue_acheteur'])) {
                $clientData['localisation'] = $validatedData['num_rue_acheteur'];
                unset($validatedData['num_rue_acheteur']);
            }

            if (!empty($clientData)) {
                $client = Client::findOrFail($request->client_id);
                $client->update($clientData);
            }

            $paiement->update($validatedData);

            Products::where('paiement_id', $paiement->id)->delete();

            if ($request->has('produits')) {
                foreach ($request->produits as $produit) {
                    Products::create([
                        'designation' => $produit['designation'],
                        'prix_unitaire' => $produit['prix_unitaire'],
                        'reference' => $produit['reference'] ?? null,
                        'quantite' => $produit['quantite'],
                        'unite' => $produit['unite'] ?? null,
                        'tva' => $produit['tva'] ?? null,
                        'total_ht' => $produit['total_ht'] ?? null,
                        'total_ttc' => $produit['total_ttc'] ?? null,
                        'paiement_id' => $paiement->id,
                    ]);
                }
            }

            return response()->json([
                'message' => 'Paiement modifié avec succès !',
                'paiement' => $paiement,
                'success' => true,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la modification du paiement',
                'error' => $e->getMessage(),
                'success' => false
            ], 500);
        }
    }

    public function destroy($id)
    {
        $data = Paiement::find($id);

        if (!$data) {
            return response()->json([
                'message' => 'Paiement non trouvé.',
            ], 404);
        }

        $data->delete();

        return response()->json([
            'message' => 'Paiement supprimé avec succès !',
            'success' => true,
        ], 200);
    }

    public function showView($id)
    {
        try {
            $paiement = Paiement::with('produits', 'client')->findOrFail($id);
            $client = $paiement->client;

            $data = [
                'numero' => $paiement->numero,
                'lieu_creation' => $paiement->lieu_creation ?? 'KARA',
                'date_creation' => $paiement->date_creation ?? $paiement->created_at,
                'date' => $paiement->date ?? $paiement->created_at,
                'nom_vendeur' => $paiement->nom_vendeur ?? 'DARGATECH TOGO',
                'ville_vendeur' => $paiement->ville_vendeur ?? 'KARA',
                'pays_vendeur' => $paiement->pays_vendeur ?? 'TOGO',
                'civilite_acheteur' => ($client && $client->genre === 'Homme') ? 'Mr.' : 'Mme.',
                'nom_acheteur' => $client->nom_famille ?? '',
                'prenom_acheteur' => $client->nom ?? '',
                'ville_acheteur' => $client->ville_acheteur ?? $paiement->ville_acheteur ?? '',
                'pays_acheteur' => $client->pays_acheteur ?? $paiement->pays_acheteur ?? '',
                'description' => $paiement->description,
                'observation' => $paiement->observation,
                'produits' => [],
                'total_ht' => 0,
                'total_tva' => 0,
                'total_ttc' => 0,
                'a_payer' => $paiement->montant ?? '0 Franc CFA',
                'montant_paye' => $paiement->montant ?? '0',
                'mode_paiement' => $paiement->mode_paiement ?? 'Espèces',
                'banque' => $paiement->banque ?? 'N/A',
                'iban' => $paiement->iban ?? 'N/A',
            ];

            foreach ($paiement->produits as $produit) {
                $totalHt = $produit->prix_unitaire * $produit->quantite;
                $tva = $produit->tva ?? 0;
                $montantTva = $totalHt * ($tva / 100);
                $totalTtc = $totalHt + $montantTva;

                $data['produits'][] = [
                    'designation' => $produit->designation,
                    'reference' => $produit->reference ?? 'N/A',
                    'quantite' => $produit->quantite,
                    'prix_unitaire' => $produit->prix_unitaire,
                    'total_ht' => $totalHt,
                    'tva' => $tva,
                    'montant_tva' => $montantTva,
                    'total_ttc' => $totalTtc,
                ];

                $data['total_ht'] += $totalHt;
                $data['total_tva'] += $montantTva;
                $data['total_ttc'] += $totalTtc;
            }

            // Envoi vers la page Inertia
            return Inertia::render('Paiement/PaiementDetail', [
                'data' => $data,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de l\'affichage du paiement',
                'error' => $e->getMessage(),
                'success' => false
            ], 500);
        }
    }
}
