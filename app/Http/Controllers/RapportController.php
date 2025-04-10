<?php
namespace App\Http\Controllers;

use App\Http\Requests\RapportRequest;
use App\Models\Rapports;
use App\Models\rapportMaintenances;
use App\Models\Maintenance;
use App\Models\Installation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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

    public function storeRapportMaintenance(Request $request)
    {
        $validatedData = $request->validate([
            'clientId' => 'required|integer',
            'technicienId' => 'required|integer',
            'maintenanceId' => 'required|integer',
            'description_probleme' => 'required|string',
            'photo_probleme' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'verifications_preliminaires' => 'required|string',
            'resultat_diagnostic' => 'required|string',
            'actions_correctives' => 'required|string',
            'verification_fonctionnement' => 'required|string',
            'recommandations' => 'nullable|string',
            'date_intervention' => 'required|date',
        ]);

        // Traitement de l'image si elle est fournie
        $photoPath = null;
        if ($request->hasFile('photo_probleme')) {
            $image = $request->file('photo_probleme');
            $imageName = time() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('uploads/rapports'), $imageName);
            $photoPath = 'uploads/rapports/' . $imageName;
        }

        // Adapter les noms des champs à ceux de la base de données
        $dbData = [
            'clientId' => $validatedData['clientId'],
            'technicienId' => $validatedData['technicienId'],
            'maintenanceId' => $validatedData['maintenanceId'],
            'description_panne' => $validatedData['description_probleme'],
            'photo_probleme' => $photoPath,
            'diagnostic_initial' => $validatedData['verifications_preliminaires'],
            'cause_identifiee' => $validatedData['resultat_diagnostic'],
            'intervention_realisee' => $validatedData['actions_correctives'],
            'verification_fonctionnement' => $validatedData['verification_fonctionnement'],
            'recommandation_client' => $validatedData['recommandations'],
            'date_intervention' => $validatedData['date_intervention'],
        ];

        DB::beginTransaction();

        try {
            // Création du rapport de maintenance
            $rapport = rapportMaintenances::create($dbData);

            // Mise à jour du statut de la maintenance
            $maintenance = Maintenance::find($validatedData['maintenanceId']);
            $maintenance->update(['status_intervention' => 'terminée']);

            // Mise à jour du statut de l'installation
            $installation = Installation::find($maintenance->installation_id);
            $installation->update(['statuts' => 'installée']);

            DB::commit();

            return response()->json([
                'message' => 'Rapport de maintenance créé avec succès !',
                'success' => true,
                'data' => $dbData
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Erreur lors de la création du rapport',
                'error' => $e->getMessage(),
                'success' => false
            ], 500);
        }
    }

    public function show($id)
    {
        $data = rapportMaintenances::find($id);

        if (! $data) {
            return response()->json([
                'message' => 'Rapport non trouvé.',
            ], 404);
        }

        return response()->json([$data], 200);
    }

    public function showByMaintenanceId($maintenance_id)
    {
        $data = rapportMaintenances::with('maintenance', 'client', 'technicien', 'technicien.user')->where('maintenanceId', $maintenance_id)->first();

        if (! $data) {
            return response()->json([
                'message' => 'Rapport non trouvé pour cette intervention.',
            ], 404);
        }

        return response()->json($data, 200);
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
