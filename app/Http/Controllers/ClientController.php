<?php
namespace App\Http\Controllers;

use App\Http\Requests\ClientRequest;
use App\Models\Client;
use App\Models\Localisation;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ClientController extends Controller
{
    /**
     * Afficher la liste des clients.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $clients = Client::with('localisation')->get();
        return response()->json(['clients' => $clients]);
    }

    public function getclientinstallation()
    {
        $clients = Client::with('installations')->get();
        return response()->json(['clients' => $clients]);
    }

    /**
     * Afficher les détails d'un client spécifique.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $client = Client::with(['installations', 'paiement', 'localisation'])->find($id);

        if (!$client) {
            return response()->json([
                'message' => 'Client non trouvé.',
                'success' => false
            ], 404);
        }

        return response()->json([
            'client' => $client,
            'success' => true
        ]);
    }

    /**
     * Stocker un nouveau client dans la base de données.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(ClientRequest $request)
    {
        try {
            DB::beginTransaction();
            
            $validatedData = $request->validated();

            // Créer la localisation
            $localisation = Localisation::create([
                'latitude' => $validatedData['latitude'] ?? 0,
                'longitude' => $validatedData['longitude'] ?? 0,
                'pays' => $validatedData['pays'],
                'ville' => $validatedData['ville'],
                'quartier' => $validatedData['quartier'] ?? 'Non spécifié',
                'village' => $validatedData['village'] ?? 'Non spécifié'
            ]);

            // Créer le client
            $client = Client::create([
                'nom' => $validatedData['nom'],
                'prenom' => $validatedData['prenom'],
                'CIN' => $validatedData['CIN'] ?? null,
                'genre' => $validatedData['genre'] ?? 'Non spécifié',
                'email' => $validatedData['email'] ?? null,
                'telephone' => $validatedData['telephone'],
                'localisation' => $validatedData['localisation'],
                'localisation_id' => $localisation->id,
                'surface_cultivee' => $validatedData['surface_cultivee'],
                'type_activite_agricole' => $validatedData['type_activite_agricole'],
                'date_contrat' => Carbon::now(),
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Client créé avec succès !',
                'client' => $client->load('localisation'),
                'success' => true,
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Erreur création client: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Erreur lors de la création du client',
                'error' => $e->getMessage(),
                'success' => false
            ], 500);
        }
    }

    /**
     * Mettre à jour un client existant.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(ClientRequest $request, $id)
    {
        try {
            DB::beginTransaction();

            $client = Client::find($id);
            if (!$client) {
                return response()->json([
                    'message' => 'Client non trouvé.',
                    'success' => false
                ], 404);
            }

            $validatedData = $request->validated();

            // Mettre à jour le client
            $client->update([
                'nom' => $validatedData['nom'],
                'prenom' => $validatedData['prenom'],
                'CIN' => $validatedData['CIN'] ?? $client->CIN,
                'genre' => $validatedData['genre'] ?? $client->genre,
                'email' => $validatedData['email'] ?? $client->email,
                'telephone' => $validatedData['telephone'],
                'surface_cultivee' => $validatedData['surface_cultivee'],
                'type_activite_agricole' => $validatedData['type_activite_agricole']
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Client mis à jour avec succès !',
                'client' => $client->load('localisation'),
                'success' => true
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'message' => 'Erreur lors de la mise à jour du client',
                'error' => $e->getMessage(),
                'success' => false
            ], 500);
        }
    }

    /**
     * Supprimer un client.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try {
            $client = Client::find($id);

            if (!$client) {
                return response()->json([
                    'message' => 'Client non trouvé.',
                    'success' => false
                ], 404);
            }

            $client->delete();

            return response()->json([
                'message' => 'Client supprimé avec succès !',
                'success' => true
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la suppression du client',
                'error' => $e->getMessage(),
                'success' => false
            ], 500);
        }
    }
}
