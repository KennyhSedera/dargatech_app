<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\User;
use App\Models\Partenaire;
use Illuminate\Support\Facades\Mail;
use App\Mail\PartenaireEmail;

class PartenaireController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $partenaires = Partenaire::with('user')->get();
        return response()->json($partenaires);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'logo' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'adresse' => 'required|string|max:255',
            'ville' => 'nullable|string|max:255',
            'pays' => 'nullable|string|max:255',
            'telephone' => 'required|string|max:255',
            'site_web' => 'nullable|string|max:255',
            'categorie' => 'required|string|max:255',
            'description' => 'nullable|string|max:255',
            'highlighted' => 'required|boolean',
        ]);

        $password = Str::random(10);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($password),
            'user_role' => 3,
        ]);
        
        $logoPath = null;
        if ($request->hasFile('logo')) {
            $logoName = time() . '-' . $request->logo->getClientOriginalName();
            $request->logo->move(public_path('logos'), $logoName);
            $logoPath = '/logos/' . $logoName;
        }
        
        $partenaire = Partenaire::create([
            'logo' => $logoPath,
            'user_id' => $user->id,
            'adresse' => $request->adresse,
            'ville' => $request->ville,
            'pays' => $request->pays,
            'telephone' => $request->telephone,
            'site_web' => $request->site_web,
            'categorie' => $request->categorie,
            'description' => $request->description,
            'highlighted' => $request->highlighted,
        ]);

        $appLink = config('app.url') . '/login';
        Mail::to($request->email)->send(new PartenaireEmail(
            $password,
            $appLink,
            $request->name
        ));

        return response()->json([
            'message' => 'Utilisateur et partenaire créés avec succès', 
            'user' => $user,
            'partenaire' => $partenaire, 
            'success' => true
        ]); 
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $partenaire = Partenaire::with('user')->find($id);
        return response()->json($partenaire);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $partenaire = Partenaire::with('user')->find($id);
        $partenaire->update($request->all());
        return response()->json(['message' => 'Partenaire modifié avec succès', 'success' => true]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $partenaire = Partenaire::with('user')->find($id);
        $partenaire->delete();
        return response()->json(['message' => 'Partenaire supprimé avec succès', 'success' => true]);
    }
}
