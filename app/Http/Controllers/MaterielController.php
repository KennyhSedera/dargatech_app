<?php
namespace App\Http\Controllers;

use App\Http\Requests\MaterielRequest;
use App\Models\Materiel;

class MaterielController extends Controller
{
    public function index()
    {
        $data = Materiel::all();

        return response()->json([$data], 200);
    }

    public function store(MaterielRequest $request)
    {
        Materiel::create($request->validate());

        return response()->json([
            'message' => 'Matériel ajouté avec succès !',
            'success' => true,
        ], 200);
    }

    public function show($id)
    {
        $data = Materiel::find($id);

        if (! $data) {
            return response()->json([
                'message' => 'Matériel non trouvé.',
            ], 404);
        }

        return response()->json([$data], 200);
    }

    public function update(MaterielRequest $request, $id)
    {
        $data = Materiel::find($id);

        if (! $data) {
            return response()->json([
                'message' => 'Matériel non trouvé.',
            ], 404);
        }

        $data->update($request->validate());

        return response()->json([
            'message' => 'Matériel modifié avec succès !',
            'success' => true,
        ], 200);
    }

    public function destroy($id)
    {
        $data = Materiel::find($id);

        if (! $data) {
            return response()->json([
                'message' => 'Matériel non trouvé.',
            ], 404);
        }

        $data->delete();

        return response()->json([
            'message' => 'Matériel supprimé avec succès !',
            'success' => true,
        ], 200);
    }
}
