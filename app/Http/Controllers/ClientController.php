<?php
namespace App\Http\Controllers;

use App\Http\Requests\ClientRequest;
use App\Models\Client;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Log;

class ClientController extends Controller
{
    public function index()
    {
        $clients = Client::orderBy('created_at', 'asc')->get();
        return response()->json(['clients' => $clients]);
    }

    public function getclientinstallation()
    {
        $clients = Client::with('installations')
            ->orderBy('created_at', 'asc')
            ->get();
        return response()->json(['clients' => $clients]);
    }

    public function show($id)
    {
        $client = Client::with(['installations', 'installations.localisation', 'paiement'])->find($id);

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

    public function store(ClientRequest $request)
    {
        try {
            DB::beginTransaction();

            $validatedData = $request->validated();

            $client = Client::create([
                'nom' => $validatedData['nom'],
                'prenom' => $validatedData['prenom'],
                'CIN' => $validatedData['CIN'] ?? null,
                'genre' => $validatedData['genre'] ?? 'Non spécifié',
                'email' => $validatedData['email'] ?? null,
                'telephone' => $validatedData['telephone'],
                'localisation' => $validatedData['localisation'],
                'surface_cultivee' => $validatedData['surface_cultivee'],
                'type_activite_agricole' => $validatedData['type_activite_agricole'],
                'date_contrat' => Carbon::now(),
                'created_via' => $validatedData['created_via']
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Client créé avec succès !',
                'success' => true,
                'client' => $client
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Erreur création client: ' . $e->getMessage());

            return response()->json([
                'message' => 'Erreur lors de la création du client',
                'error' => $e->getMessage(),
                'success' => false
            ], 500);
        }
    }

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

            $client->update([
                'nom' => $validatedData['nom'],
                'prenom' => $validatedData['prenom'],
                'CIN' => $validatedData['CIN'] ?? $client->CIN,
                'genre' => $validatedData['genre'] ?? $client->genre,
                'email' => $validatedData['email'] ?? $client->email,
                'telephone' => $validatedData['telephone'],
                'localisation' => $validatedData['localisation'],
                'surface_cultivee' => $validatedData['surface_cultivee'],
                'type_activite_agricole' => $validatedData['type_activite_agricole'],
                'ville_acheteur' => $validatedData['ville_acheteur'],
                'pays_acheteur' => $validatedData['pays_acheteur'],
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Client mis à jour avec succès !',
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

    public function updateIsPaid($id)
    {
        $client = Client::findOrFail($id);
        $client->update([
            'is_payed' => true,
        ]);

        return response()->json(['client' => $client, 'success' => true, 'message' => 'Client mis à jour avec succès !']);
    }

    public function destroyMany(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:clients,id'
        ]);

        $ids = $request->input('ids');

        Client::whereIn('id', $ids)->delete();

        return response()->json([
            'message' => 'Clients supprimées avec succès.'
        ]);
    }

    public function editManyForm(Request $request)
    {
        $ids = $request->input('ids', []);

        $clients = Client::whereIn('id', $ids)->get();

        return Inertia::render('Form/FormulaireClientMany', [
            'clients' => $clients,
        ]);
    }

    public function updateMany(Request $request)
    {
        $validated = $request->validate([
            'clients' => 'required|array|min:1',
            'clients.*.id' => 'required|exists:clients,id',
            'clients.*.nom' => 'required|string|max:255',
            'clients.*.prenom' => 'required|string|max:255',
            'clients.*.email' => 'nullable|email|max:255',
            'clients.*.genre' => 'nullable|in:Homme,Femme',
            'clients.*.CIN' => 'nullable|string|max:255',
            'clients.*.telephone' => 'required|string|max:255',
            'clients.*.localisation' => 'nullable|string|max:255',
            'clients.*.surface_cultivee' => 'nullable|numeric|min:0',
            'clients.*.type_activite_agricole' => 'nullable|string|max:255',
            'clients.*.created_via' => 'nullable|string',
        ]);

        try {
            DB::beginTransaction();

            foreach ($validated['clients'] as $clientData) {
                $client = Client::find($clientData['id']);

                if (!$client)
                    continue;

                $client->update([
                    'nom' => $clientData['nom'],
                    'prenom' => $clientData['prenom'],
                    'email' => $clientData['email'] ?? $client->email,
                    'genre' => $clientData['genre'] ?? $client->genre,
                    'CIN' => $clientData['CIN'] ?? $client->CIN,
                    'telephone' => $clientData['telephone'],
                    'localisation' => $clientData['localisation'] ?? $client->localisation,
                    'surface_cultivee' => $clientData['surface_cultivee'] ?? $client->surface_cultivee,
                    'type_activite_agricole' => $clientData['type_activite_agricole'] ?? $client->type_activite_agricole,
                ]);
            }

            DB::commit();

            return response()->json([
                'message' => 'Clients mis à jour avec succès !',
                'success' => true,
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Erreur mise à jour multiple clients: ' . $e->getMessage());

            return response()->json([
                'message' => 'Erreur lors de la mise à jour des clients',
                'error' => $e->getMessage(),
                'success' => false,
            ], 500);
        }
    }
}
