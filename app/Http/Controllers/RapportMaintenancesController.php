<?php

namespace App\Http\Controllers;

use App\Models\rapportMaintenances;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RapportMaintenancesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $rapports = rapportMaintenances::with(['client', 'technicien', 'technicien.user', 'maintenance'])->get();
        return response()->json(['data' => $rapports], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'clientId' => 'required|exists:clients,id',
                'technicienId' => 'required|exists:techniciens,id',
                'maintenanceId' => 'required|exists:maintenances,id',
                'description_probleme' => 'required|string',
                'photo_probleme' => 'nullable|image|max:2048',
                'verifications_preliminaires' => 'required|string',
                'resultat_diagnostic' => 'required|string',
                'actions_correctives' => 'required|string',
                'verification_fonctionnement' => 'required|string',
                'recommandations' => 'nullable|string',
                'date_intervention' => 'required|date',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Erreur de validation',
                    'errors' => $validator->errors(),
                    'success' => false
                ], 422);
            }

            $data = $validator->validated();

            // Gérer l'upload de la photo si elle existe
            if ($request->hasFile('photo_probleme')) {
                $photo = $request->file('photo_probleme');
                $photoName = time() . '.' . $photo->getClientOriginalExtension();
                $photo->move(public_path('uploads/rapports'), $photoName);
                $data['photo_probleme'] = 'uploads/rapports/' . $photoName;
            }

            $rapport = rapportMaintenances::create($data);

            return response()->json([
                'message' => 'Rapport de maintenance créé avec succès',
                'data' => $rapport,
                'success' => true
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la création du rapport',
                'error' => $e->getMessage(),
                'success' => false
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(rapportMaintenances $rapportMaintenances)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(rapportMaintenances $rapportMaintenances)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, rapportMaintenances $rapportMaintenances)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(rapportMaintenances $rapportMaintenances)
    {
        //
    }
}
