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
            'client_id'         => 'required|numeric',
            'code_installation' => 'required|string',
            'date_installation' => 'required|date',
            'puissance_pompe'   => 'required|numeric',
            'profondeur_forage' => 'required|numeric',
            'debit_nominal'     => 'required|numeric',
            'numero_serie'      => 'required|string',
            'source_eau'        => 'required|string',
            'hmt'               => 'required|numeric',
            'latitude'          => 'required|numeric',
            'longitude'         => 'required|numeric',
            'pays'              => 'nullable|string',
            'ville'             => 'nullable|string',
        ];
    }
}
