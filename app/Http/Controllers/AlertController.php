<?php
namespace App\Http\Controllers;

use App\Http\Requests\AlertRequest;
use App\Models\Alerts;

class AlertController extends Controller
{
    public function index()
    {
        $data = Alerts::all();

        return response()->json([$data], 200);
    }

    public function store(AlertRequest $request)
    {
        Alerts::create($request->validate());

        return response()->json([
            'message' => 'Alert ajouté avec succès !',
            'success' => true,
        ], 200);
    }

    public function show($id)
    {
        $data = Alerts::find($id);

        if (! $data) {
            return response()->json([
                'message' => 'Alert non trouvé.',
            ], 404);
        }

        return response()->json([$data], 200);
    }

    public function update(AlertRequest $request, $id)
    {
        $data = Alerts::find($id);

        if (! $data) {
            return response()->json([
                'message' => 'Alert non trouvé.',
            ], 404);
        }

        $data->update($request->validate());

        return response()->json([
            'message' => 'Alert modifié avec succès !',
            'success' => true,
        ], 200);
    }

    public function destroy($id)
    {
        $data = Alerts::find($id);

        if (! $data) {
            return response()->json([
                'message' => 'Alert non trouvé.',
            ], 404);
        }

        $data->delete();

        return response()->json([
            'message' => 'Alert supprimé avec succès !',
            'success' => true,
        ], 200);
    }
}
