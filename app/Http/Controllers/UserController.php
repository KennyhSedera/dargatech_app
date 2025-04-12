<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with(['user_role', 'technicien', 'profile', 'partenaire'])->get();
        return response()->json($users);
    }

    public function destroy($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'Utilisateur non trouvé', 'success' => false]);
        }
        $user->delete();
        return response()->json(['message' => 'Utilisateur supprimé avec succès', 'success' => true]);
    }
}
