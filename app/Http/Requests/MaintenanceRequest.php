<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MaintenanceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules()
    {
        return [
            'installation_id' => 'required|exists:installations,id',
            'type_intervention' => 'required|string',
            'description_probleme' => 'required|string',
            'date_intervention' => 'required|date',
            'created_via' => 'required|string',
            'photo_probleme' => 'nullable|array',
            'photo_probleme.*' => 'nullable|image|mimes:jpg,jpeg,png,gif|max:5120',
        ];
    }

    public function messages(): array
    {
        return [
            'photo_probleme.image' => 'Le fichier doit être une image.',
            'photo_probleme.mimes' => 'L\'image doit être au format: jpeg, png, jpg ou gif.',
            'photo_probleme.max' => 'L\'image ne doit pas dépasser 2MB.',
        ];
    }
}
