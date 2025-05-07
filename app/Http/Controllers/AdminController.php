<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Mail\AdminRegistered;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class AdminController extends Controller
{
    public function store(Request $request)
    {
        DB::beginTransaction();

        $request->validate([
            'name'      => 'required|string',
            'email'     => 'required|email|unique:users,email',
            'contact'   => 'required|string',
            'adress'    => 'required|string',
        ]);

        $password = Str::random(10);

        try {
            $user = User::create([
                'name'      => $request->name,
                'email'     => $request->email,
                'password'  => Hash::make($password),
                'user_role' => 1,
            ]);

            $user->profile()->create([
                'contact'    => $request->contact,
                'adress'     => $request->adress,
            ]);

            DB::commit();

            try {
                $appLink = config('app.url') . '/login';
                Mail::to($request->email)->send(new AdminRegistered(
                    $password,
                    $appLink,
                    $request->name,
                    $request->email
                ));
            } catch (\Exception $emailError) {
                Log::error('Erreur lors de l\'envoi de l\'email au admin: ' . $emailError->getMessage());
                
                return response()->json([
                    'message' => 'Admin créé avec succès, mais l\'email n\'a pas pu être envoyé',
                    'user' => $user->load('profile'),
                    'warning' => 'L\'email n\'a pas pu être envoyé'
                ], 201);
            }

            return response()->json([
                'message' => 'Admin créé avec succès',
                'user' => $user->load('profile')
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Erreur lors de la création du admin: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Erreur lors de la création du admin',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
