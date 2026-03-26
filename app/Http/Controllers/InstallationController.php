<?php
namespace App\Http\Controllers;

use App\Http\Requests\InstallationRequest;
use App\Models\Installation;
use Illuminate\Http\Request;
use App\Models\Localisation;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Log;

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

            $photos = [];

            /** @var \Illuminate\Http\Request $request */
            if ($request->hasFile('photos_installation')) {
                foreach ($request->file('photos_installation') as $photo) {
                    $photoName = time() . '_' . uniqid() . '.' . $photo->getClientOriginalExtension();
                    $photo->move(public_path('uploads/installations'), $photoName);
                    $photos[] = 'uploads/installations/' . $photoName;
                }
            }

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
                'hmt' => $validatedData['hmt'],
                'created_via' => $validatedData['created_via'] ?? 'web',
                'photos_installation' => json_encode($photos),
                'qte_eau' => Installation::HEURES_PAR_JOUR * $validatedData['debit_nominal'],
                'qte_co2' => (Installation::HEURES_PAR_JOUR * $validatedData['debit_nominal']) * Installation::CO2_PAR_M3,
            ]);

            DB::commit();
            return response()->json([
                'message' => 'Installation créée avec succès !',
                'success' => true,
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Erreur création installation: ' . $e->getMessage());

            return response()->json([
                'message' => 'Erreur lors de la création de l\'installation',
                'error' => $e->getMessage(),
                'success' => false
            ], 500);
        }
    }


    public function show($id)
    {
        $installation = Installation::find($id);

        if (!$installation) {
            return response()->json([
                'message' => 'Installation non trouvé.',
            ], 404);
        }

        return response()->json([
            'installation' => $installation,
        ]);
    }

    public function update(Request $request, $id): JsonResponse
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
                'qte_eau' => $validatedData['qte_eau'] ?? $installation->qte_eau,
                'qte_co2' => $validatedData['qte_co2'] ?? $installation->qte_co2
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Installation modifiée avec succès !',
                'success' => true,
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Erreur modification installation: ' . $e->getMessage());

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

        if (!$installation) {
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

    public function destroyMany(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:installations,id'
        ]);

        $ids = $request->input('ids');

        Installation::whereIn('id', $ids)->delete();

        return response()->json([
            'message' => 'Installations supprimées avec succès.'
        ]);
    }

    public function editManyForm(Request $request)
    {
        $ids = $request->input('ids', []);

        $data = Installation::with('localisation')->whereIn('id', $ids)->get();

        return Inertia::render('Form/FormInstallationMany', [
            'datas' => $data,
        ]);
    }

    public function updateMany(Request $request)
    {
        $validated = $request->validate([
            'installations' => 'required|array|min:1',
            'installations.*.id' => 'required|exists:installations,id',
            'installations.*.client_id' => 'required|numeric',
            'installations.*.date_installation' => 'required|string|max:255',
            'installations.*.puissance_pompe' => 'required|numeric',
            'installations.*.profondeur_forage' => 'nullable|numeric',
            'installations.*.code_installation' => 'nullable|string',
            'installations.*.statuts' => 'nullable|string|max:255',
            'installations.*.localisation_id' => 'required|numeric',
            'installations.*.localisation' => 'nullable|string|max:255',
            'installations.*.source_eau' => 'nullable|string|max:255',
            'installations.*.hmt' => 'nullable|numeric',
            'installations.*.latitude' => 'nullable|numeric',
            'installations.*.longitude' => 'nullable|numeric',
            'installations.*.pays' => 'nullable|string',
            'installations.*.ville' => 'nullable|string',
            'installations.*.debit_nominal' => 'nullable|string',
        ]);

        try {
            DB::beginTransaction();

            foreach ($validated['installations'] as $installationData) {
                $installation = Installation::find($installationData['id']);

                if (!$installation)
                    continue;

                if ($installation->localisation_id) {
                    $localisation = Localisation::find($installation->localisation_id);
                    if ($localisation) {
                        $localisation->update([
                            'latitude' => $installationData['latitude'] ?? $localisation->latitude,
                            'longitude' => $installationData['longitude'] ?? $localisation->longitude,
                            'pays' => $installationData['pays'] ?? $localisation->pays,
                            'ville' => $installationData['ville'] ?? $localisation->ville,
                        ]);
                    }
                } else {
                    $localisation = Localisation::create([
                        'latitude' => $installationData['latitude'] ?? 0,
                        'longitude' => $installationData['longitude'] ?? 0,
                        'pays' => $installationData['pays'] ?? 'Togo',
                        'ville' => $installationData['ville'] ?? 'Kara',
                    ]);

                    $installationData['localisation_id'] = $localisation->id;
                }

                $installation->update([
                    'client_id' => $installationData['client_id'] ?? $installation->client_id,
                    'date_installation' => $installationData['date_installation'] ?? $installation->date_installation,
                    'puissance_pompe' => $installationData['puissance_pompe'] ?? $installation->puissance_pompe,
                    'profondeur_forage' => $installationData['profondeur_forage'] ?? $installation->profondeur_forage,
                    'numero_serie' => $installationData['numero_serie'] ?? $installation->numero_serie,
                    'debit_nominal' => $installationData['debit_nominal'] ?? $installation->debit_nominal,
                    'code_installation' => $installationData['code_installation'] ?? $installation->code_installation,
                    'statuts' => $installationData['statuts'] ?? $installation->statuts,
                    'localisation_id' => $installationData['localisation_id'] ?? $installation->localisation_id,
                    'source_eau' => $installationData['source_eau'] ?? $installation->source_eau,
                    'hmt' => $installationData['hmt'] ?? $installation->hmt,
                ]);
            }

            DB::commit();

            return response()->json([
                'message' => 'Installations mis à jour avec succès !',
                'success' => true,
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Erreur mise à jour multiple installations: ' . $e->getMessage());

            return response()->json([
                'message' => 'Erreur lors de la mise à jour des installations',
                'error' => $e->getMessage(),
                'success' => false,
            ], 500);
        }
    }
}
