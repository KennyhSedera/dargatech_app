<?php
namespace App\Http\Controllers;

use App\Http\Requests\MaintenanceRequest;
use App\Models\Maintenance;
use Illuminate\Http\Request;

class MaintenanceController extends Controller
{
    public function index()
    {
        $data = Maintenance::all();

        return response()->json(['data' => $data], 200);
    }

    public function store(Request $request)
    {

        $request->validate([
            'installation_id'      => 'required|exists:installations,id',
            'type_intervention'    => 'required|string',
            'description_probleme' => 'required|string',
            'solutions_apportees'  => 'required|string',
            'duree_intervention'   => 'required|numeric',
            'technicien'           => 'required|string',
        ]);

        $maintenance = Maintenance::create($request->all());

        return response()->json([
            'message' => 'Maintenance enregistrée avec succès',
            'data'    => $maintenance,
        ], 201);
    }

    public function show($id)
    {
        $data = Maintenance::find($id);

        if (! $data) {
            return response()->json([
                'message' => 'Maintenance non trouvé.',
            ], 404);
        }

        return response()->json([$data], 200);
    }

    public function update(MaintenanceRequest $request, $id)
    {
        $data = Maintenance::find($id);

        if (! $data) {
            return response()->json([
                'message' => 'Maintenance non trouvé.',
            ], 404);
        }

        $data->update($request->validate());

        return response()->json([
            'message' => 'Maintenance modifié avec succès !',
            'success' => true,
        ], 200);
    }

    public function destroy($id)
    {
        $data = Maintenance::find($id);

        if (! $data) {
            return response()->json([
                'message' => 'Maintenance non trouvé.',
            ], 404);
        }

        $data->delete();

        return response()->json([
            'message' => 'Maintenance supprimé avec succès !',
            'success' => true,
        ], 200);
    }
}
