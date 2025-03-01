<?php
namespace App\Http\Controllers;

use App\Mail\BotCredentialsMail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class TechnicienController extends Controller
{
    public function store(Request $request)
    {
        DB::beginTransaction();

        try {
            $user = User::create([
                'name'      => $request->name,
                'email'     => $request->email,
                'password'  => Hash::make($request->password),
                'user_role' => 2,
            ]);

            $user->technicien()->create([
                'contact'    => $request->contact,
                'adress'     => $request->adress,
                'speciality' => $request->speciality,
                'genre'      => $request->genre,
                'photo'      => $request->photo,
            ]);

            DB::commit();

            $appLink = env('APP_URL') . '/login';
            Mail::to($request->email)->send(new BotCredentialsMail($request->password, 'dargatech_bot', $appLink, $request->name));

            return response()->json(['message' => 'Technicien créés avec succès', 'user' => $user->load('technicien')]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Erreur lors de la création', 'error' => $e->getMessage()], 500);
        }
    }

    public function index()
    {
        $data = User::with('technicien')->where('user_role', 2)->get();
        return response()->json(['data' => $data], 200);
    }

    public function show($id)
    {
        $data = User::with('technicien')->where('user_role', 2)->find($id);
        return response()->json(['data' => $data], 200);
    }

    public function update(Request $request, $id)
    {

    }

    public function destroy($id)
    {
        User::findOrFail($id)->delete();

        return response()->json([
            'message' => 'Technicien supprimé avec succès !',
            'success' => true,
        ], 200);
    }
}
