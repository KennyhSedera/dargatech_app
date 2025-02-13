<?php
namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ClientController extends Controller
{
    /**
     * Afficher la liste des clients.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $clients = Client::all();

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
        $client = Client::find($id);

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
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nom'                    => 'required|string|max:255',
            'prenom'                 => 'required|string|max:255',
            'telephone'              => 'required|string|max:20',
            'localisation'           => 'required|string|max:255',
            'surface_cultivee'       => 'required|numeric|min:0',
            'type_activite_agricole' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors(),
            ], 422);
        }

        $client = Client::create([
            'nom'                    => $request->nom,
            'prenom'                 => $request->prenom,
            'telephone'              => $request->telephone,
            'localisation'           => $request->localisation,
            'surface_cultivee'       => $request->surface_cultivee,
            'type_activite_agricole' => $request->type_activite_agricole,
        ]);

        return response()->json([
            'message' => 'Client créé avec succès !',
            'client'  => $client,
        ], 201);
    }

    /**
     * Mettre à jour un client existant.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $client = Client::find($id);

        if (! $client) {
            return response()->json([
                'message' => 'Client non trouvé.',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'nom'                    => 'sometimes|string|max:255',
            'prenom'                 => 'sometimes|string|max:255',
            'telephone'              => 'sometimes|string|max:20',
            'localisation'           => 'sometimes|string|max:255',
            'surface_cultivee'       => 'sometimes|numeric|min:0',
            'type_activite_agricole' => 'sometimes|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors(),
            ], 422);
        }

        $client->update($request->only([
            'nom',
            'prenom',
            'telephone',
            'localisation',
            'surface_cultivee',
            'type_activite_agricole',
        ]));

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
