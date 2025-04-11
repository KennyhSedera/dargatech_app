<?php

use App\Http\Controllers\ProfileController;
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

Route::get('/form/paiement', function () {
    return Inertia::render('Paiement/FormulairePaiement');
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

Route::get('/paiement/pdf', function () {
    return view('pdf.paiement', [
        'data' => [
            'numero' => '1234567890',
            'date' => '2023-01-01',
            'montant' => 100000,
            'nom_vendeur' => 'John Doe',
            'ville_vendeur' => 'Paris',
            'pays_vendeur' => 'France',
            'nom_acheteur' => 'Jane Smith',
            'ville_acheteur' => 'Paris',
            'pays_acheteur' => 'France',
            'produits' => [
                [
                    'designation' => 'Produit 1',
                    'quantite' => 1,
                    'prix_unitaire' => 100000,
                    'tva' => 20,
                    'reference' => '1234567890',
                    'total_ht' => 100000,
                    'total_ttc' => 120000,
                    'total_tva' => 20000,
                    'montant_tva' => 20000,
                ]
            ],
            'a_payer' => 100000,
            'montant_paye' => 100000,
            'mode_paiement' => 'Espèce',
            'banque' => 'Banque de France',
            'iban' => 'FR7610001000000000000000000',
            'lieu_creation' => 'Paris',
            'date_creation' => '2023-01-01',
            'periode_couverte' => '2023-01-01',
            'civilite_acheteur' => 'Monsieur',
            'nom_acheteur' => 'John Doe',
            'ville_acheteur' => 'Paris',
            'pays_acheteur' => 'France',
            'nom_vendeur' => 'John Doe',
            'ville_vendeur' => 'Paris',
            'pays_vendeur' => 'France',
            'total_ht' => 100000,
            'total_tva' => 20000,
            'total_ttc' => 120000,
        ]
    ]);
})->middleware(['auth', 'verified'])->name('paiement.pdf');

require __DIR__ . '/auth.php';
require __DIR__ . '/api.php';
