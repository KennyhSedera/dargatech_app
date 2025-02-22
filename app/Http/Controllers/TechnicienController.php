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
                'name'     => $request->name,
                'email'    => $request->email,
                'password' => Hash::make($request->password),
                'role'     => 'technicien',
            ]);

            $user->profile()->create([
                'contact'    => $request->contact,
                'adress'     => $request->adress,
                'speciality' => $request->speciality,
                'genre'      => $request->genre,
                'photo'      => $request->photo,
            ]);

            DB::commit();

            $appLink = env('APP_URL') . '/login';
            Mail::to($request->email)->send(new BotCredentialsMail($request->password, 'dargatech_bot', $appLink, $request->name));

            return response()->json(['message' => 'Technicien créés avec succès', 'user' => $user->load('profile')]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Erreur lors de la création', 'error' => $e->getMessage()], 500);
        }
    }

    public function sendEmail($email, $botUsername, $password)
    {
        $startLink = "https://t.me/{$botUsername}?start";
        $appLink   = "http://localhost:8000/login";

        Mail::raw("Voici votre mot de passe {$password}, vous pouvez authentifier sur le site {$appLink} \n Cliquez ici pour démarrer : {$startLink}", function ($message) use ($email) {
            $message->to($email)
                ->subject('Démarrez la conversation avec notre bot Telegram');
        });

        return response()->json(['message' => 'E-mail envoyé avec succès']);
    }

    public function index()
    {
        $data = User::with('profile')->where('role', 'technicien')->get();
        return response()->json(['data' => $data], 200);
    }

    public function show($id)
    {

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
