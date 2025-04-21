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
        ], [
            'name.required' => 'Le nom est obligatoire.',
            'name.string' => 'Le nom doit être une chaîne de caractères.',
            'name.max' => 'Le nom ne doit pas dépasser 255 caractères.',
            
            'email.required' => 'L\'email est obligatoire.',
            'email.string' => 'L\'email doit être une chaîne de caractères.',
            'email.email' => 'L\'email doit être une adresse email valide.',
            'email.max' => 'L\'email ne doit pas dépasser 255 caractères.',
            'email.unique' => 'Cet email est déjà utilisé.',
        
            'logo.image' => 'Le logo doit être une image.',
            'logo.mimes' => 'Le logo doit être un fichier de type: jpeg, png, jpg, gif, svg.',
            'logo.max' => 'Le logo ne doit pas dépasser 2 Mo.',
        
            'adresse.required' => 'L\'adresse est obligatoire.',
            'adresse.string' => 'L\'adresse doit être une chaîne de caractères.',
            'adresse.max' => 'L\'adresse ne doit pas dépasser 255 caractères.',
        
            'ville.string' => 'La ville doit être une chaîne de caractères.',
            'ville.max' => 'La ville ne doit pas dépasser 255 caractères.',
        
            'pays.string' => 'Le pays doit être une chaîne de caractères.',
            'pays.max' => 'Le pays ne doit pas dépasser 255 caractères.',
        
            'telephone.required' => 'Le numéro de téléphone est obligatoire.',
            'telephone.string' => 'Le numéro de téléphone doit être une chaîne de caractères.',
            'telephone.max' => 'Le numéro de téléphone ne doit pas dépasser 255 caractères.',
        
            'site_web.required' => 'Le site web est obligatoire.',
            'site_web.string' => 'Le site web doit être une chaîne de caractères.',
            'site_web.max' => 'Le site web ne doit pas dépasser 255 caractères.',
        
            'categorie.string' => 'La catégorie doit être une chaîne de caractères.',
            'categorie.max' => 'La catégorie ne doit pas dépasser 255 caractères.',
        
            'description.string' => 'La description doit être une chaîne de caractères.',
            'description.max' => 'La description ne doit pas dépasser 255 caractères.',
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
