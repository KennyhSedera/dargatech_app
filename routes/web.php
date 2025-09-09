<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TelegramFormController;
use App\Models\Client;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Http\Request;

Route::get('/', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::post('/api/profile/photo', [ProfileController::class, 'updatePhoto'])->name('profile.photo.update');
});

Route::get('/clients', function () {
    return Inertia::render('Client/ClientPage');
})->middleware(['auth', 'verified'])->name('clients');

Route::get('/client/{id}', function ($id) {
    $client = Client::findOrFail($id);

    return Inertia::render('Client/ClientDetailPage', [
        'client' => $client,
    ]);
})->middleware(['auth', 'verified'])->name('clients.detail');

Route::get('/pompes', function () {
    return Inertia::render('PompePage');
})->middleware(['auth', 'verified'])->name('pompes');

Route::get('/installations', function () {
    return Inertia::render('InstallationPage');
})->middleware(['auth', 'verified'])->name('installations');

Route::get('/paiements', function () {
    return Inertia::render('Paiement/PaiementPage');
})->middleware(['auth', 'verified'])->name('paiements');

Route::get('/form/paiement', function (Request $request) {
    return Inertia::render('Paiement/FormulairePaiement', [
        'client_id' => $request->input('client_id'),
        'amount' => $request->input('amount'),
        'designation' => $request->input('designation'),
    ]);
})->middleware(['auth', 'verified'])->name('form_paiement');

Route::get('/interventions', function () {
    return Inertia::render('InterventionPage');
})->middleware(['auth', 'verified'])->name('interventions');

Route::get('/parametres', function () {
    return Inertia::render('SettingPage');
})->middleware(['auth', 'verified'])->name('parametres');

Route::get('/telegram', function () {
    return Inertia::render('Bot/ChatBot');
})->middleware(['auth', 'verified'])->name('telegram');

Route::get('/technicien', function () {
    return Inertia::render('Technicien');
})->middleware(['auth', 'verified'])->name('technicien');

Route::get('/alert', function () {
    return Inertia::render('Alert/AlertPage');
})->middleware(['auth', 'verified'])->name('alert');

Route::get('/rapport', function (Request $request) {
    return Inertia::render('rapport/RapportMaintenance', [
        'intervention_id' => $request->input('intervention_id')
    ]);
})->middleware(['auth', 'verified'])->name('rapport');

Route::get('/rapport/{id}', function ($id) {
    return Inertia::render('rapport/RapportMaintenance', [
        'intervention_id' => $id
    ]);
})->middleware(['auth', 'verified'])->name('rapport.show');

Route::get('/affiche', function () {
    return Inertia::render('paiements/AfficherPaiement');
})->name('affiche');

Route::get('/users', function () {
    return Inertia::render('UsersPage');
})->middleware(['auth', 'verified'])->name('users');

Route::get('/partenaires', function () {
    return Inertia::render('PartenairePage');
})->middleware(['auth', 'verified'])->name('partenaires');

Route::get('/installation/{id}', function ($id) {
    $installation = \App\Models\Installation::findOrFail($id)->load('client', 'localisation');
    return Inertia::render('InstallationDetailsPage', ['installation' => $installation]);
})->middleware(['auth', 'verified'])->name('installation_detail');

Route::middleware(['web', 'telegram.token'])->group(function () {
    Route::get('/formulaire/client', [TelegramFormController::class, 'clientForm'])
        ->name('telegram.client.form');

    Route::get('/formulaire/installation', [TelegramFormController::class, 'installationForm'])
        ->name('telegram.installation.form');
});

require __DIR__ . '/auth.php';
require __DIR__ . '/api.php';
