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
            // Création de l'utilisateur
            $user = User::create([
                'name'      => $request->name,
                'email'     => $request->email,
                'password'  => Hash::make($request->password),
                'user_role' => 2,
            ]);

            // Création du technicien
            $user->technicien()->create([
                'contact'    => $request->contact,
                'adress'     => $request->adress,
                'speciality' => $request->speciality,
                'genre'      => $request->genre,
                'photo'      => $request->photo,
            ]);

            DB::commit();

            // Envoi de l'email dans un try-catch séparé
            try {
                $appLink = config('app.url') . '/login';
                Mail::to($request->email)->send(new BotCredentialsMail(
                    $request->password,
                    'dargatech_bot',
                    $appLink,
                    $request->name
                ));
            } catch (\Exception $emailError) {
                // Log l'erreur d'envoi d'email mais ne pas échouer la création
                Log::error('Erreur lors de l\'envoi de l\'email au technicien: ' . $emailError->getMessage());
                
                // Retourner succès avec avertissement
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

    public function testEmail()
    {
        try {
            $appLink = config('app.url') . '/login';
            Mail::to('test@example.com')->send(new BotCredentialsMail(
                'test123',
                'dargatech_bot',
                $appLink,
                'Test User'
            ));
            
            return response()->json([
                'message' => 'Email de test envoyé avec succès'
            ]);
        } catch (\Exception $e) {
            Log::error('Test email error: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Erreur lors du test d\'envoi d\'email',
                'error' => $e->getMessage(),
                'smtp_settings' => [
                    'host' => config('mail.mailers.smtp.host'),
                    'port' => config('mail.mailers.smtp.port'),
                    'encryption' => config('mail.mailers.smtp.encryption'),
                    'username' => config('mail.mailers.smtp.username'),
                    'from_address' => config('mail.from.address'),
                ]
            ], 500);
        }
    }
}
