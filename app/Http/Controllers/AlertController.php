<?php
namespace App\Http\Controllers;

use App\Models\Alerts;
use App\Models\Installation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AlertController extends Controller
{
    public function index()
    {
        $data = Alerts::with('installation', 'client')->get();

        return response()->json(['data' => $data], 200);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'client_id'       => 'required|numeric|min:0',
            'type_alert'      => 'required|string',
            'message'         => 'required|string',
            'installation_id' => 'required|numeric|min:0',
        ]);

        $installation = Installation::find($data['installation_id']);

        DB::beginTransaction();

        try {
            $installation->update(['statuts' => 'en panne']);

            Alerts::create($data);

            DB::commit();

            return response()->json([
                'message' => 'Alert ajouté avec succès !',
                'success' => true,
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Failed to add alert.',
                'error'   => $e->getMessage(),
                'success' => false,
            ], 500);
        }
    }

    public function show($id)
    {
        $data = Alerts::find($id);

        if (! $data) {
            return response()->json([
                'message' => 'Alert non trouvé.',
            ], 404);
        }

        return response()->json([$data], 200);
    }

    public function update(Request $request, $id)
    {
        $data = Alerts::find($id);

        if (! $data) {
            return response()->json([
                'message' => 'Alert non trouvé.',
            ], 404);
        }

        $new = $request->validate([
            'client_id'       => 'required|numeric|min:0',
            'type_alert'      => 'required|string',
            'message'         => 'required|string',
            'installation_id' => 'required|numeric|min:0',
        ]);

        $data->update($new);

        return response()->json([
            'message' => 'Alert modifié avec succès !',
            'success' => true,
        ], 200);
    }

    public function destroy($id)
    {
        $data = Alerts::find($id);

        if (! $data) {
            return response()->json([
                'message' => 'Alert non trouvé.',
            ], 404);
        }

        $data->delete();

        return response()->json([
            'message' => 'Alert supprimé avec succès !',
            'success' => true,
        ], 200);
    }
}
