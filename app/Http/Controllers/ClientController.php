<?php
namespace App\Http\Controllers;

use App\Http\Requests\ClientRequest;
use App\Models\Client;

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
        Client::create($request->validated());

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
