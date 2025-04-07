<?php
namespace App\Http\Controllers;

use App\Http\Requests\LocalisationRequest;
use App\Models\Localisation;

class LocalisationController extends Controller
{
    public function index()
    {
        $data = Localisation::all();

        return response()->json([$data], 200);
    }

    public function store(LocalisationRequest $request)
    {
        Localisation::create($request->validate());

        return response()->json([
            'message' => 'Localisation ajouté avec succès !',
            'success' => true,
        ], 200);
    }

    public function show($id)
    {
        $data = Localisation::find($id);

        if (! $data) {
            return response()->json([
                'message' => 'Localisation non trouvé.',
            ], 404);
        }

        return response()->json([$data], 200);
    }

    public function update(LocalisationRequest $request, $id)
    {
        $data = Localisation::find($id);

        if (! $data) {
            return response()->json([
                'message' => 'Localisation non trouvé.',
            ], 404);
        }

        $data->update($request->validate());

        return response()->json([
            'message' => 'Localisation modifié avec succès !',
            'success' => true,
        ], 200);
    }

    public function destroy($id)
    {
        $data = Localisation::find($id);

        if (! $data) {
            return response()->json([
                'message' => 'Localisation non trouvé.',
            ], 404);
        }

        $data->delete();

        return response()->json([
            'message' => 'Localisation supprimé avec succès !',
            'success' => true,
        ], 200);
    }
}
