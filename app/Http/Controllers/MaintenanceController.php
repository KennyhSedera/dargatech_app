<?php
namespace App\Http\Controllers;

use App\Models\Maintenance;
use Illuminate\Http\Request;

class MaintenanceController extends Controller
{
    public function index()
    {
        $data = Maintenance::with(['installation.client', 'techniciens.user'])->get();

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
            'technicien'           => 'required|exists:techniciens,id',
        ]);

        $maintenance = Maintenance::create($request->all());

        return response()->json([
            'message' => 'Maintenance enregistrée avec succès',
            'data'    => $maintenance,
        ], 201);
    }

    public function show($id)
    {
        $data = Maintenance::with(['installation.client', 'technicien.user'])->findOrFail($id);
        return response()->json(['data' => $data], 200);
    }

    public function update(Request $request, $id)
    {
        $data = Maintenance::findOrFail($id);

        $request->validate([
            'installation_id'      => 'required|exists:installations,id',
            'type_intervention'    => 'required|string',
            'description_probleme' => 'required|string',
            'solutions_apportees'  => 'required|string',
            'duree_intervention'   => 'required|numeric',
            'technicien'           => 'required|numeric',
        ]);

        $data->update($request->all());

        return response()->json([
            'message' => 'Maintenance modifié avec succès !',
            'success' => true,
        ], 200);
    }

    public function destroy($id)
    {
        Maintenance::findOrFail($id)->delete();

        return response()->json([
            'message' => 'Maintenance supprimé avec succès !',
            'success' => true,
        ], 200);
    }
}
