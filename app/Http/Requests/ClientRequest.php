<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ClientRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'nom' => 'required|string',
            'prenom' => 'required|string',
            'telephone' => 'required|string',
            'localisation' => 'required|string',
            'surface_cultivee' => 'required|numeric',
            'type_activite_agricole' => 'required|string',
            'email' => 'nullable|email',
            'CIN' => 'nullable|string',
            'genre' => 'nullable|string',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'pays' => 'required|string',
            'ville' => 'required|string',
            'quartier' => 'nullable|string',
            'village' => 'nullable|string'
        ];
    }

    public function messages()
    {
        return [
            'nom.required' => 'Le nom est obligatoire',
            'prenom.required' => 'Le prénom est obligatoire',
            'telephone.required' => 'Le téléphone est obligatoire',
            'localisation.required' => 'La localisation est obligatoire',
            'surface_cultivee.required' => 'La surface cultivée est obligatoire',
            'surface_cultivee.numeric' => 'La surface cultivée doit être un nombre',
            'type_activite_agricole.required' => 'Le type d\'activité agricole est obligatoire',
            'pays.required' => 'Le pays est obligatoire',
            'ville.required' => 'La ville est obligatoire'
        ];
    }
}