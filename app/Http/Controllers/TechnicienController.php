<?php
namespace App\Http\Controllers;

use App\Mail\BotCredentialsMail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class TechnicienController extends Controller
{
    public function store(Request $request)
    {
        DB::beginTransaction();

        try {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'user_role' => 2,
            ]);

            $user->technicien()->create([
                'contact' => $request->contact,
                'adress' => $request->adress,
                'speciality' => $request->speciality,
                'genre' => $request->genre,
                'photo' => $request->photo,
                'telegram_username' => $request->telegram_username
            ]);

            DB::commit();

            try {
                $appLink = config('app.url') . '/login';
                $botLink = 'https://t.me/' . env('TELEGRAM_BOT_USERNAME');

                Mail::to($request->email)->send(new BotCredentialsMail(
                    $request->password,
                    $botLink,
                    $appLink,
                    $request->name,
                    $request->email
                ));
            } catch (\Exception $emailError) {
                Log::error('Erreur lors de l\'envoi de l\'email au technicien: ' . $emailError->getMessage());

                return response()->json([
                    'message' => 'Technicien créé avec succès, mais l\'email n\'a pas pu être envoyé',
                    'user' => $user->load('technicien'),
                    'warning' => 'L\'email n\'a pas pu être envoyé'
                ], 201);
            }

            // Retour succès complet
            return response()->json([
                'message' => 'Technicien créé avec succès',
                'user' => $user->load('technicien')
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Erreur lors de la création du technicien: ' . $e->getMessage());

            return response()->json([
                'message' => 'Erreur lors de la création du technicien',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function index()
    {
        try {
            $data = User::with('technicien')
                ->where('user_role', 2)
                ->get();

            return response()->json(['data' => $data], 200);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la récupération des techniciens: ' . $e->getMessage());

            return response()->json([
                'message' => 'Erreur lors de la récupération des techniciens',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $data = User::with('technicien')
                ->where('user_role', 2)
                ->findOrFail($id);

            return response()->json(['data' => $data], 200);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la récupération du technicien: ' . $e->getMessage());

            return response()->json([
                'message' => 'Erreur lors de la récupération du technicien',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    public function update(Request $request, $id)
    {
        DB::beginTransaction();

        try {
            $user = User::findOrFail($id);

            $user->update([
                'name' => $request->name,
                'email' => $request->email,
            ]);

            if ($request->password) {
                $user->update(['password' => Hash::make($request->password)]);
            }

            $user->technicien()->update([
                'contact' => $request->contact,
                'adress' => $request->adress,
                'speciality' => $request->speciality,
                'genre' => $request->genre,
                'telegram_username' => $request->telegram_username
            ]);

            if ($request->photo) {
                $user->technicien()->update(['photo' => $request->photo]);
            }

            DB::commit();

            return response()->json([
                'message' => 'Technicien mis à jour avec succès',
                'user' => $user->load('technicien')
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Erreur lors de la mise à jour du technicien: ' . $e->getMessage());

            return response()->json([
                'message' => 'Erreur lors de la mise à jour',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $user = User::findOrFail($id);
            $user->delete();

            return response()->json([
                'message' => 'Technicien supprimé avec succès',
                'success' => true
            ], 200);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la suppression du technicien: ' . $e->getMessage());

            return response()->json([
                'message' => 'Erreur lors de la suppression',
                'error' => $e->getMessage()
            ], 500);
        }
    }

}
