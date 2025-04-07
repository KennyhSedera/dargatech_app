<?php
namespace App\Http\Controllers;

use App\Http\Requests\InstallationRequest;
use App\Models\Installation;
use Illuminate\Http\Request;

class InstallationController extends Controller
{
    public function index()
    {
        $installations = Installation::with('client')->orderBy('code_installation', 'asc')->get();
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
        Installation::create($request->validated());

        return response()->json([
            'message' => 'Installation créé avec succès !',
            'success' => true,
        ], 201);
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
