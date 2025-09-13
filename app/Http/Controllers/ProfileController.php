<?php

namespace App\Http\Controllers;

use App\Http\Requests\PasswordUpdateRequest;
use App\Http\Requests\ProfileUpdateRequest;
use App\Models\Profile;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\View\View;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user()->load(['user_role', 'profile', 'technicien']);

        return Inertia::render('Profile/Edit', [
            'user' => $user,
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        // Mise à jour ou création du profil
        $profileData = $request->validate([
            'genre' => 'nullable|string|max:255',
            'contact' => 'nullable|string|max:255',
            'adress' => 'nullable|string|max:255',
            'speciality' => 'nullable|string|max:255',
        ]);

        // Mise à jour ou création du profil
        $technicienData = $request->validate([
            'genre' => 'nullable|string|max:255',
            'contact' => 'nullable|string|max:255',
            'adress' => 'nullable|string|max:255',
            'speciality' => 'nullable|string|max:255',
            'telegram_username' => 'nullable|string|max:255',
        ]);

        $partenaireData = $request->validate([
            'ville' => 'nullable|string|max:255',
            'pays' => 'nullable|string|max:255',
            'site_web' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:255',
            'highlighted' => 'nullable|boolean',
            'categorie' => 'nullable|string|max:255',
        ]);

        if ($request->user()->partenaire) {
            $request->user()->partenaire->update($partenaireData);
        }

        if ($request->user()->technicien) {
            $request->user()->technicien->update($technicienData);
        }

        // Mise à jour ou création du profil
        if ($request->user()->profile) {
            $request->user()->profile->update($profileData);
        } else {
            $request->user()->profile()->create($profileData);
        }

        return Redirect::route('profile.edit')->with('status', 'profile-updated');
    }

    public function updatePassword(PasswordUpdateRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $request->user()->update([
            'password' => Hash::make($validated['password']),
        ]);

        return Redirect::route('profile.edit')->with('status', 'password-updated');
    }

    /**
     * Update the user's profile photo.
     */
    public function updatePhoto(Request $request): RedirectResponse
    {
        $request->validate([
            'photo' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $user = $request->user();

        // Delete old photo if exists
        if ($user->profile && $user->profile->photo) {
            $oldPhotoPath = public_path($user->profile->photo);
            if (file_exists($oldPhotoPath)) {
                unlink($oldPhotoPath);
            }
        }

        if ($user->technicien && $user->technicien->photo) {
            $oldPhotoPath = public_path($user->technicien->photo);
            if (file_exists($oldPhotoPath)) {
                unlink($oldPhotoPath);
            }
        }

        if ($user->partenaire && $user->partenaire->logo) {
            $oldPhotoPath = public_path($user->partenaire->logo);
            if (file_exists($oldPhotoPath)) {
                unlink($oldPhotoPath);
            }
        }
        // Stocker la nouvelle photo dans le dossier public
        $image = $request->file('photo');
        $imageName = time() . '.' . $image->getClientOriginalExtension();
        $image->move(public_path('uploads/profile-photos'), $imageName);
        $photoPath = '/uploads/profile-photos/' . $imageName;

        if ($user->profile) {
            $user->profile->update(['photo' => $photoPath]);
        } else {
            $user->profile()->create(['photo' => $photoPath]);
        }

        if ($user->technicien) {
            $user->technicien->update(['photo' => $photoPath]);
        }

        if ($user->partenaire) {
            $user->partenaire->update(['logo' => $photoPath]);
        }

        return Redirect::route('profile.edit')->with('status', 'photo-updated');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validateWithBag('userDeletion', [
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        // Suppression de la photo de profil si elle existe
        if ($user->profile && $user->profile->photo) {
            Storage::delete($user->profile->photo);
        }

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
