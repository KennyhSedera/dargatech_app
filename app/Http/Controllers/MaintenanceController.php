<?php
namespace App\Http\Controllers;

use App\Models\Alerts;
use App\Models\Installation;
use App\Models\Maintenance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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

        $installation = Installation::find($request->installation_id);
        $alert        = Alerts::where([
            'installation_id' => $request->installation_id,
            'resolue'         => false,
        ])->first();

        DB::beginTransaction();

        try {
            $installation->update(['statuts' => 'installée']);

            $alert->update(['resolue' => true]);

            $maintenance = Maintenance::create($request->all());

            DB::commit();

            return response()->json([
                'message' => 'Maintenance enregistrée avec succès',
                'data'    => $maintenance,
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Failed to add maintenance.',
                'error'   => $e->getMessage(),
                'success' => false,
            ], 500);
        }
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
