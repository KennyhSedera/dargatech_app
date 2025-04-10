<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Hash;

class DeleteAccountRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'password' => ['required', 'string', function ($attribute, $value, $fail) {
                if (!Hash::check($value, $this->user()->password)) {
                    $fail('Le mot de passe est incorrect.');
                }
            }],
            'confirmation' => ['required', 'string', 'in:delete'],
        ];
    }

    public function messages(): array
    {
        return [
            'password.required' => 'Le mot de passe est requis',
            'confirmation.required' => 'La confirmation est requise',
            'confirmation.in' => 'Veuillez taper "delete" pour confirmer la suppression',
        ];
    }
} 