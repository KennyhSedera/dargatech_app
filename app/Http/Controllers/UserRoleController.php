<?php
namespace App\Http\Controllers;

use App\Http\Requests\UseRoleRequest;
use App\Models\UserRole;

class UserRoleController extends Controller
{
    public function index()
    {
        $data = UserRole::all();

        return response()->json([
            $data,
            'success' => true,
        ], 201);
    }

    public function store(UseRoleRequest $request)
    {
        UserRole::create($request->validate());

        return response()->json([
            'message' => 'Role utilisateur créé avec succès !',
            'success' => true,
        ], 201);
    }

    public function show($id)
    {
        $data = UserRole::find($id);

        if (! $data) {
            return response()->json([
                'message' => 'Role utilisateur non trouvé.',
            ], 404);
        }

        return response()->json([$data], 200, );
    }

    public function update(UseRoleRequest $request, $id)
    {
        $user_role = UserRole::find($id);

        if (! $user_role) {
            return response()->json([
                'message' => 'Role utilisateur non trouvé.',
            ], 404);
        }

        $user_role->update($request->validated());

        return response()->json([
            'message' => 'Role utilisateur mis à jour avec succès !',
            'success' => true,
        ]);
    }

    public function destroy($id)
    {
        $user_role = UserRole::find($id);

        if (! $user_role) {
            return response()->json([
                'message' => 'Role utilisateur non trouvé.',
            ], 404);
        }

        $user_role->delete();

        return response()->json([
            'message' => 'Role utilisateur supprimé avec succès !',
            'success' => true,
        ]);
    }
}
