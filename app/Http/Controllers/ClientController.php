<?php
namespace App\Http\Controllers;

use App\Http\Requests\ClientRequest;
use App\Models\Client;
use App\Models\Localisation;
use Carbon\Carbon;

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

        return response()->json([
            'clients' => $clients,
        ]);
    }

    public function getclientinstallation()
    {
        $clients = Client::with('installations')->get();

        return response()->json([
            'clients' => $clients,
        ]);
    }

    /**
     * Afficher les détails d'un client spécifique.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $client = Client::with(['installations', 'paiement'])->find($id);

        if (! $client) {
            return response()->json([
                'message' => 'Client non trouvé.',
            ], 404);
        }

        return response()->json([
            'client' => $client,
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
        $validatedData = $request->validated();

        $localisation = Localisation::create([
            'latitude'  => $validatedData['latitude'] ?? null,
            'longitude' => $validatedData['longitude'] ?? null,
            'pays'      => $validatedData['pays'] ?? null,
            'ville'     => $validatedData['ville'] ?? null,
        ]);

        $client = Client::create([
            'nom'                    => $validatedData['nom'],
            'prenom'                 => $validatedData['prenom'],
            'CIN'                    => $validatedData['CIN'],
            'genre'                  => $validatedData['genre'],
            'email'                  => $validatedData['email'],
            'telephone'              => $validatedData['telephone'],
            'localisation'           => $validatedData['localisation'],
            'localisation_id'        => $localisation->id,
            'surface_cultivee'       => $validatedData['surface_cultivee'],
            'type_activite_agricole' => $validatedData['type_activite_agricole'],
            'date_contrat'           => Carbon::now(),
        ]);

        return response()->json([
            'message' => 'Client créé avec succès !',
            'success' => true,
        ], 201);
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
        $client = Client::find($id);

        if (! $client) {
            return response()->json([
                'message' => 'Client non trouvé.',
            ], 404);
        }

        $client->update($request->validated());

        return response()->json([
            'message' => 'Client mis à jour avec succès !',
            'client'  => $client,
        ]);
    }

    /**
     * Supprimer un client.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $client = Client::find($id);

        if (! $client) {
            return response()->json([
                'message' => 'Client non trouvé.',
            ], 404);
        }

        $client->delete();

        return response()->json([
            'message' => 'Client supprimé avec succès !',
        ]);
    }
}
