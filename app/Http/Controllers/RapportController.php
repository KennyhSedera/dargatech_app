<?php
namespace App\Http\Controllers;

use App\Http\Requests\RapportRequest;
use App\Models\Rapports;

class RapportController extends Controller
{
    public function index()
    {
        $data = Rapports::all();

        return response()->json([$data], 200);
    }

    public function store(RapportRequest $request)
    {
        Rapports::create($request->validate());

        return response()->json([
            'message' => 'Rapport ajouté avec succès !',
            'success' => true,
        ], 200);
    }

    public function show($id)
    {
        $data = Rapports::find($id);

        if (! $data) {
            return response()->json([
                'message' => 'Rapport non trouvé.',
            ], 404);
        }

        return response()->json([$data], 200);
    }

    public function update(Rapports $request, $id)
    {
        $data = Rapports::find($id);

        if (! $data) {
            return response()->json([
                'message' => 'Rapport non trouvé.',
            ], 404);
        }

        $data->update($request->validate());

        return response()->json([
            'message' => 'Rapport mis à jour avec succès !',
            'success' => true,
        ], 200);
    }

    public function destroy($id)
    {
        $data = Rapports::find($id);

        if (! $data) {
            return response()->json([
                'message' => 'Rapport non trouvé.',
            ], 404);
        }

        $data->delete();

        return response()->json([
            'message' => 'Rapport supprimé avec succès !',
            'success' => true,
        ], 200);
    }
}
