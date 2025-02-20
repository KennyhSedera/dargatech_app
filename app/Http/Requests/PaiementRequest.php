<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PaiementRequest extends FormRequest
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
            'montant'          => 'required|numeric|min:0',
            'periode_couverte' => 'required|string|max:255',
            'client_id'        => 'required|numeric|min:1',
            'mode_paiement'    => 'required|string|max:255',
        ];
    }
}
