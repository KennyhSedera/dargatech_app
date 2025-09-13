<?php
namespace App\Http\Controllers;

use App\Models\Paiement;
use App\Models\Products;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

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
                'echeance' => 'nullable|date',
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
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Erreur de validation',
                    'errors' => $validator->errors(),
                    'success' => false
                ], 422);
            }

            $paiement = Paiement::create($validator->validated());

            if ($request->has('produits')) {
                foreach ($request->produits as $produit) {
                    Products::create([
                        'designation' => $produit['designation'],
                        'prix_unitaire' => $produit['prix_unitaire'],
                        'reference' => $produit['reference'],
                        'quantite' => $produit['quantite'],
                        'unite' => $produit['unite'],
                        'tva' => $produit['tva'],
                        'total_ht' => $produit['total_ht'],
                        'total_ttc' => $produit['total_ttc'],
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
                'echeance' => 'nullable|date',
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
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Erreur de validation',
                    'errors' => $validator->errors(),
                    'success' => false
                ], 422);
            }

            $paiement->update($validator->validated());

            Products::where('paiement_id', $paiement->id)->delete();

            if ($request->has('produits')) {
                foreach ($request->produits as $produit) {
                    Products::create(array_merge($produit, ['paiement_id' => $paiement->id]));
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
}
