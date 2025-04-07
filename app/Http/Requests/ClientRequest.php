<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ClientRequest extends FormRequest
{
    /**
     * Détermine si l'utilisateur est autorisé à faire cette requête.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Règles de validation pour la requête.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'nom'                    => 'required|string',
            'prenom'                 => 'required|string',
            'telephone'              => 'required|string',
            'localisation'           => 'required|string',
            'surface_cultivee'       => 'required|numeric',
            'type_activite_agricole' => 'required|string',
            'CIN'                    => 'required|string',
            'genre'                  => 'required|string',
            'email'                  => 'required|string',
            'latitude'               => 'required|numeric',
            'longitude'              => 'required|numeric',
            'pays'                   => 'required|string',
            'ville'                  => 'required|string',
        ];
    }
}
