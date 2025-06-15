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

            $localisation = Localisation::create([
                'latitude' => $validatedData['latitude'] ?? 0,
                'longitude' => $validatedData['longitude'] ?? 0,
                'pays' => $validatedData['pays'] ?? 'Togo',
                'ville' => $validatedData['ville'] ?? 'Kara',
            ]);

            Installation::create([
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

    /**
     * Mise à jour d'une installation.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        try {
            DB::beginTransaction();

            $installation = Installation::find($id);

            if (!$installation) {
                return response()->json([
                    'message' => 'Installation non trouvée.',
                    'success' => false,
                ], 404);
            }

            $validatedData = $request->all();

            if ($installation->localisation_id) {
                $localisation = Localisation::find($installation->localisation_id);
                if ($localisation) {
                    $localisation->update([
                        'latitude' => $validatedData['latitude'] ?? $localisation->latitude,
                        'longitude' => $validatedData['longitude'] ?? $localisation->longitude,
                        'pays' => $validatedData['pays'] ?? $localisation->pays,
                        'ville' => $validatedData['ville'] ?? $localisation->ville,
                    ]);
                }
            } else {
                $localisation = Localisation::create([
                    'latitude' => $validatedData['latitude'] ?? 0,
                    'longitude' => $validatedData['longitude'] ?? 0,
                    'pays' => $validatedData['pays'] ?? 'Togo',
                    'ville' => $validatedData['ville'] ?? 'Kara',
                ]);

                $validatedData['localisation_id'] = $localisation->id;
            }

            $installation->update([
                'client_id' => $validatedData['client_id'] ?? $installation->client_id,
                'date_installation' => $validatedData['date_installation'] ?? $installation->date_installation,
                'puissance_pompe' => $validatedData['puissance_pompe'] ?? $installation->puissance_pompe,
                'profondeur_forage' => $validatedData['profondeur_forage'] ?? $installation->profondeur_forage,
                'numero_serie' => $validatedData['numero_serie'] ?? $installation->numero_serie,
                'debit_nominal' => $validatedData['debit_nominal'] ?? $installation->debit_nominal,
                'code_installation' => $validatedData['code_installation'] ?? $installation->code_installation,
                'statuts' => $validatedData['statuts'] ?? $installation->statuts,
                'localisation_id' => $validatedData['localisation_id'] ?? $installation->localisation_id,
                'source_eau' => $validatedData['source_eau'] ?? $installation->source_eau,
                'hmt' => $validatedData['hmt'] ?? $installation->hmt,
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Installation modifiée avec succès !',
                'success' => true,
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Erreur modification installation: ' . $e->getMessage());

            return response()->json([
                'message' => 'Erreur lors de la modification de l\'installation',
                'error' => $e->getMessage(),
                'success' => false
            ], 500);
        }
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
