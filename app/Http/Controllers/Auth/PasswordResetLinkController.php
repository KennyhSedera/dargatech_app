<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Mail;
use App\Mail\ResetPasswordMail;

class PasswordResetLinkController extends Controller
{
    /**
     * Display the password reset link request view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/ForgotPassword', [
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming password reset link request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request)
{
    $request->validate([
        'email' => 'required|email|exists:users,email',
    ], [
        'email.required' => 'L\'email est obligatoire.',
        'email.email' => 'L\'email doit être une adresse email valide.',
        'email.exists' => 'Cet email n\'existe pas.',
    ]);

    $user = User::where('email', $request->email)->first();
    $token = Password::createToken($user);
    Mail::to($user->email)->send(new ResetPasswordMail($token, $user->email, $user->name));

    return response()->json(['message' => 'Un lien de réinitialisation a été envoyé à votre email.' ], 200);
}
}
