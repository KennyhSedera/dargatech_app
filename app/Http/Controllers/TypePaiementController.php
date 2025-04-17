<?php
namespace App\Http\Controllers;

use App\Http\Requests\TypePaiementRequest;
use App\Models\Type_paiements;
use Illuminate\Http\Request;

class TypePaiementController extends Controller
{
    public function index()
    {
        $typePaiements = Type_paiements::all();

        return response()->json(['type' => $typePaiements], 200);
    }

    public function store(Request $request)
    {
        $validate = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $logoPath = null;
        if ($request->hasFile('logo_path')) {
            $logoName = time() . '-' . $request->logo_path->getClientOriginalName();
            $request->logo_path->move(public_path('logos'), $logoName);
            $logoPath = 'logos/' . $logoName;
        }

        Type_paiements::create([
            'name'      => $validate['name'],
            'logo_path' => $logoPath,
        ]);

        return response()->json([
            'message' => 'Type de paiement créé avec succès',
            'success' => true,
        ], 201);
    }

    public function show($id)
    {
        $data = Type_paiements::find($id);
        if (! $data) {
            return response()->json([
                'message' => 'Type paiement non trouvé.',
            ], 404);
        }
        return response()->json([$data], 200);
    }

    public function update(TypePaiementRequest $request, $id)
    {
        $type_paiement = Type_paiements::find($id);

        if (! $type_paiement) {
            return response()->json([
                'message' => 'Type paiement non trouvé.',
            ], 404);
        }

        $type_paiement->update($request->validated());

        return response()->json([
            'message' => 'Type paiement mis à jour avec succès !',
            'success' => true,
        ]);
    }

    public function destroy($id)
    {
        $type_paiement = Type_paiements::find($id);

        if (! $type_paiement) {
            return response()->json([
                'message' => 'Type paiement non trouvé.',
            ], 404);
        }

        $type_paiement->delete();

        return response()->json([
            'message' => 'Type paiement supprimé avec succès !',
            'success' => true,
        ]);
    }

    public function create(Request $request)
    {
        $request->validate([
            'name'      => 'required|string|max:255',
            'logo_path' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        if ($request->hasFile('logo_path')) {
            $imagePath = $request->file('logo_path')->store('logos', 'public');
        } else {
            $imagePath = 'default.png';
        }

        $typePaiement = Type_paiements::create([
            'name'      => $request->name,
            'logo_path' => $imagePath,
        ]);

        return response()->json([
            'message'      => 'Type de paiement créé avec succès',
            'typePaiement' => $typePaiement,
        ]);
    }

}
