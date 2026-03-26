<?php
namespace App\Http\Controllers;

use App\Http\Requests\MaintenanceRequest;
use App\Models\Installation;
use App\Models\Maintenance;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class MaintenanceController extends Controller
{
    public function index()
    {
        $data = Maintenance::with(['installation.client'])
            ->orderBy('created_at', 'asc')
            ->get();

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

            $photos = [];

            /** @var \Illuminate\Http\Request $request */
            if ($request->hasFile('photo_probleme')) {
                foreach ($request->file('photo_probleme') as $photo) {
                    $photoName = time() . '_' . uniqid() . '.' . $photo->getClientOriginalExtension();
                    $photo->move(public_path('uploads/rapports'), $photoName);
                    $photos[] = 'uploads/rapports/' . $photoName;
                }
            }

            $maintenance = Maintenance::create([
                'installation_id' => $validatedData['installation_id'],
                'type_intervention' => $validatedData['type_intervention'],
                'description_probleme' => $validatedData['description_probleme'],
                'solutions_apportees' => $validatedData['solutions_apportees'] ?? null,
                'duree_intervention' => $validatedData['duree_intervention'] ?? null,
                'technicien_id' => $validatedData['technicien'] ?? null,
                'date_intervention' => $validatedData['date_intervention'],
                'status_intervention' => 'en attente',
                'created_via' => $validatedData['created_via'] ?? 'web',
                'photo_probleme' => !empty($photos) ? json_encode($photos) : null,
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Maintenance enregistrée avec succès',
                'data' => $maintenance,
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Failed to add maintenance.',
                'error' => $e->getMessage(),
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
        $data = Maintenance::findOrFail($id);

        $data->update([
            'type_intervention' => $validatedData['type_intervention'],
            'description_probleme' => $validatedData['description_probleme'],
            'date_intervention' => $validatedData['date_intervention'],
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

    public function findMaintenanceByInstallation($id)
    {
        $data = Maintenance::with(['installation'])
            ->where('installation_id', $id)
            ->where('status_intervention', '!=', 'terminée')
            ->get();
        return response()->json(['data' => $data], 200);
    }

    public function showDetail($id)
    {
        $data = Maintenance::with(['installation.client', 'rapport_maintenance'])
            ->findOrFail($id);

        return Inertia::render('InterventionDetailPage', [
            'data' => $data
        ]);
    }

    public function destroyMany(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:maintenances,id'
        ]);

        $ids = $request->input('ids');

        Maintenance::whereIn('id', $ids)->delete();

        return response()->json([
            'message' => 'Interventions ou maintenances supprimées avec succès.'
        ]);
    }

    public function editManyForm(Request $request)
    {
        $ids = $request->input('ids', []);

        $data = Maintenance::whereIn('id', $ids)->get();

        return Inertia::render('Form/FormMaintenanceMany', [
            'datas' => $data,
        ]);
    }

    public function updateMany(Request $request)
    {
        $validated = $request->validate([
            'interventions' => 'required|array|min:1',
            'interventions.*.id' => 'required|exists:maintenances,id',
            'interventions.*.installation_id' => 'required|exists:installations,id',
            'interventions.*.date_intervention' => 'required|string|max:255',
            'interventions.*.type_intervention' => 'required|string|max:255',
            'interventions.*.description_probleme' => 'nullable|string',
        ]);

        try {
            DB::beginTransaction();

            foreach ($validated['interventions'] as $interventionData) {
                $intervention = Maintenance::find($interventionData['id']);

                if (!$intervention)
                    continue;

                $intervention->update([
                    'installation_id' => $interventionData['installation_id'],
                    'date_intervention' => $interventionData['date_intervention'],
                    'type_intervention' => $interventionData['type_intervention'] ?? $intervention->type_intervention,
                    'description_probleme' => $interventionData['description_probleme'] ?? $intervention->description_probleme,
                ]);
            }

            DB::commit();

            return response()->json([
                'message' => 'interventions mis à jour avec succès !',
                'success' => true,
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Erreur mise à jour multiple interventions: ' . $e->getMessage());

            return response()->json([
                'message' => 'Erreur lors de la mise à jour des interventions',
                'error' => $e->getMessage(),
                'success' => false,
            ], 500);
        }
    }
}
