<?php
namespace App\Http\Controllers;

use App\Models\Paiement;
use Illuminate\Http\Request;

class PaiementController extends Controller
{
    public function index()
    {
        $data = Paiement::with(['client', 'type_paiement'])->get();

        return response()->json(['data' => $data], 200);
    }

    public function store(Request $request)
    {
        Paiement::create($request->all());

        return response()->json([
            'message' => 'Paiement ajouté avec succès !',
            'success' => true,
        ], 200);
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
