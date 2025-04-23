<?php
namespace App\Http\Controllers;

use App\Http\Requests\InstallationRequest;
use App\Models\Installation;
use Illuminate\Http\Request;
use App\Models\Localisation;
use Illuminate\Support\Facades\DB;

class InstallationController extends Controller
{
    public function index()
    {
        $installations = Installation::with('client', 'localisation')->orderBy('code_installation', 'asc')->get();
        return response()->json(["data" => $installations]);
    }

    public function getInstallation()
    {
        $installations = Installation::whereHas('alert', function ($query) {
            $query->where('resolue', false);
        })->with('alert')->get();

        return response()->json(["data" => $installations]);
    }
    public function store(InstallationRequest $request)
    {
        try {
            DB::beginTransaction();
    
            $validatedData = $request->validated();
    
            // Créer la localisation
            $localisation = Localisation::create([
                'latitude' => $validatedData['latitude'] ?? 0,
                'longitude' => $validatedData['longitude'] ?? 0,
                'pays' => $validatedData['pays'] ?? 'Togo',
                'ville' => $validatedData['ville'] ?? 'Kara',
            ]);
    
            // Create the installation
            $installation = Installation::create([
                'client_id' => $validatedData['client_id'],
                'date_installation' => $validatedData['date_installation'],
                'puissance_pompe' => $validatedData['puissance_pompe'],
                'profondeur_forage' => $validatedData['profondeur_forage'],
                'numero_serie' => $validatedData['numero_serie'],
                'debit_nominal' => $validatedData['debit_nominal'],
                'code_installation' => $validatedData['code_installation'],
                'statuts' => $validatedData['statuts'] ?? 'installée',
                'localisation_id' => $localisation->id, 
                'source_eau' => $validatedData['source_eau'],
                'hmt' => $validatedData['hmt']
            ]);
    
            DB::commit();
            return response()->json([
                'message' => 'Installation créé avec succès !',
                'success' => true,
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Erreur création installation: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Erreur lors de la création du installation',
                'error' => $e->getMessage(),
                'success' => false
            ], 500);
        }
    }

    public function show($id)
    {
        $installation = Installation::find($id);

        if (! $installation) {
            return response()->json([
                'message' => 'Installation non trouvé.',
            ], 404);
        }

        return response()->json([
            'installation' => $installation,
        ]);
    }

    public function update(Request $request, $id)
    {
        $installation = Installation::find($id);

        if (! $installation) {
            return response()->json([
                'message' => 'Installation non trouvé.',
            ], 404);
        }

        $installation->update($request->all());

        return response()->json([
            'message' => 'Installation modifié avec succès !',
            'success' => true,
        ], 201);
    }

    public function destroy($id)
    {
        $installation = Installation::find($id);

        if (! $installation) {
            return response()->json([
                'message' => 'Installation non trouvé.',
            ], 404);
        }

        $installation->delete();

        return response()->json([
            'message' => 'Installation supprimé avec succès !',
            'success' => true,
        ], 201);
    }
}
