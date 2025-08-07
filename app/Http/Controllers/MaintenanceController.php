<?php
namespace App\Http\Controllers;

use App\Http\Requests\MaintenanceRequest;
use App\Models\Installation;
use App\Models\Maintenance;
use Illuminate\Support\Facades\DB;

class MaintenanceController extends Controller
{
    public function index()
    {
        $data = Maintenance::with(['installation.client'])->get();

        return response()->json(['data' => $data], 200);
    }

    public function store(MaintenanceRequest $request)
    {
        $validatedData = $request->validated();

        $installation = Installation::find($validatedData['installation_id']);

        DB::beginTransaction();

        try {
            if ($validatedData['type_intervention'] == 'préventive') {
                $installation->update(['statuts' => 'en panne']);
            }

            $maintenance = Maintenance::create([
                'installation_id'      => $validatedData['installation_id'],
                'type_intervention'    => $validatedData['type_intervention'],
                'description_probleme' => $validatedData['description_probleme'],
                'date_intervention'    => $validatedData['date_intervention'],
                'status_intervention'  => 'en attente',
            ]);

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

    public function update(MaintenanceRequest $request, $id)
    {
        $validatedData = $request->validated();
        $data          = Maintenance::findOrFail($id);

        $data->update([
            'type_intervention'    => $validatedData['type_intervention'],
            'description_probleme' => $validatedData['description_probleme'],
            'date_intervention'    => $validatedData['date_intervention'],
        ]);

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
