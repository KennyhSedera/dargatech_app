<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MaintenanceRequest extends FormRequest
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
            'installation_id'      => 'required|numeric',
            'type_intervention'    => 'required|string|max:255',
            'description_probleme' => 'required|text',
            'solutions_apportees'  => 'required|text',
            'date_intervention'    => 'required|date',
            'duree_intervention'   => 'required|numeric|min:1',
        ];
    }
}
