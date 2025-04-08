<?php
namespace App\Http\Controllers;

use App\Models\Paiement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PaiementController extends Controller
{
    public function index()
    {
        $data = Paiement::with(['client'])->get();

        return response()->json(['data' => $data], 200);
    }

    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'client_id' => 'required|exists:clients,id',
                'montant' => 'required|numeric|min:0',
                'date_paiement' => 'required|date',
                'mode_paiement' => 'required|string',
                'periode_couverte' => 'required|string',
                'echeance' => 'nullable|date',
                'statut_paiement' => 'nullable|string',
                'observation' => 'nullable|string'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Erreur de validation',
                    'errors' => $validator->errors(),
                    'success' => false
                ], 422);
            }

            $paiement = Paiement::create($validator->validated());

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

    public function show($id)
    {
        $data = Paiement::find($id);

        if (! $data) {
            return response()->json([
                'message' => 'Rapport non trouvé.',
            ], 404);
        }

        return response()->json($data, 200, );
    }

    public function update(Request $request, $id)
    {
        $data = Paiement::find($id);

        if (! $data) {
            return response()->json([
                'message' => 'Paiement non trouvé.',
            ], 404);
        }

        $data->update($request->all());

        return response()->json([
            'message' => 'Paiement modifié avec succès !',
            'success' => true,
        ], 200);
    }

    public function destroy($id)
    {
        $data = Paiement::find($id);

        if (! $data) {
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
