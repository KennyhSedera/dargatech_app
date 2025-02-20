<?php

use App\Http\Controllers\ProfileController;
use App\Models\Client;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
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
    return Inertia::render('PaiementPage');
})->middleware(['auth', 'verified'])->name('paiements');

Route::get('/interventions', function () {
    return Inertia::render('InterventionPage');
})->middleware(['auth', 'verified'])->name('interventions');

Route::get('/parametres', function () {
    return Inertia::render('SettingPage');
})->middleware(['auth', 'verified'])->name('parametres');

Route::get('/telegram', function () {
    return Inertia::render('Bot/ChatBot');
})->middleware(['auth', 'verified'])->name('telegram');

require __DIR__ . '/auth.php';
require __DIR__ . '/api.php';
