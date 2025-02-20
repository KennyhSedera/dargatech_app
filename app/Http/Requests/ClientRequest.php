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
            'nom'                    => 'required|string|max:255',
            'prenom'                 => 'required|string|max:255',
            'telephone'              => 'required|string|max:20',
            'localisation'           => 'required|string|max:255',
            'surface_cultivee'       => 'required|numeric|min:0',
            'type_activite_agricole' => 'required|string|max:255',
        ];
    }
}
