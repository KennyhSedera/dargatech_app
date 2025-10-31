<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class InstallationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'client_id' => 'required|numeric',
            'code_installation' => 'required|string',
            'date_installation' => 'required|date',
            'puissance_pompe' => 'required|numeric',
            'profondeur_forage' => 'required|numeric',
            'debit_nominal' => 'required|numeric',
            'numero_serie' => 'required|string',
            'source_eau' => 'required|string',
            'hmt' => 'required|numeric',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'pays' => 'nullable|string',
            'ville' => 'nullable|string',
            'created_via' => 'required|string',
            'photos_installation' => 'nullable|array',
            'photos_installation.*' => 'image|mimes:jpg,jpeg,png,gif|max:5120',
            'qte_eau' => 'nullable|numeric',
            'qte_co2' => 'nullable|numeric',
        ];
    }

    public function messages(): array
    {
        return [
            'client_id.exists' => 'Le client sélectionné n\'existe pas.',
            'code_installation.unique' => 'Ce code d\'installation existe déjà.',
            'date_installation.before_or_equal' => 'La date d\'installation ne peut pas être dans le futur.',
            'numero_serie.unique' => 'Ce numéro de série existe déjà.',
            'latitude.between' => 'La latitude doit être comprise entre -90 et 90.',
            'longitude.between' => 'La longitude doit être comprise entre -180 et 180.',
            'photos_installation.image' => 'Le fichier doit être une image.',
            'photos_installation.mimes' => 'L\'image doit être au format: jpeg, png, jpg ou gif.',
            'photos_installation.max' => 'L\'image ne doit pas dépasser 2MB.',
            'qte_eau.numeric' => 'La quantité d\'eau doit être un nombre.',
            'qte_co2.numeric' => 'La quantité de CO2 doit être un nombre.',
        ];
    }
}
