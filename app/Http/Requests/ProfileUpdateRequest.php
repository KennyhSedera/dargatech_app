<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
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
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique(User::class)->ignore($this->user()->id)],
            'genre' => 'nullable|string|max:255',
            'contact' => 'nullable|string|max:255',
            'adress' => 'nullable|string|max:255',
            'speciality' => 'nullable|string|max:255',
            'telegram_username' => 'nullable|string|max:255',
            'ville' => 'nullable|string|max:255',
            'pays' => 'nullable|string|max:255',
            'site_web' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:255',
            'highlighted' => 'nullable|boolean',
            'categorie' => 'nullable|string|max:255',
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'email.unique' => 'Cet email est deja utilisé.',
            'email.required' => 'Veuillez entrer un email.',
            'email.string' => 'Le champ email doit être une chaîne de caractères.',
            'email.email' => 'Le champ email doit être une adresse email valide.',
            'email.max' => 'Le champ email ne doit pas contenir plus de :max caractères.',
            'name.required' => 'Veuillez entrer un nom.',
            'name.string' => 'Le champ nom doit être une chaîne de caractères.',
            'name.max' => 'Le champ nom ne doit pas contenir plus de :max caractères.',
            'genre.string' => 'Le champ genre doit être une chaîne de caractères.',
            'genre.max' => 'Le champ genre ne doit pas contenir plus de :max caractères.',
            'contact.string' => 'Le champ contact doit être une chaîne de caractères.',
            'contact.max' => 'Le champ contact ne doit pas contenir plus de :max caractères.',
        ];
    }
}
