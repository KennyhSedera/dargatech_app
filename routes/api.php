<?php

use App\Http\Controllers\AlertController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\InstallationController;
use App\Http\Controllers\LocalisationController;
use App\Http\Controllers\MaintenanceController;
use App\Http\Controllers\MaterielController;
use App\Http\Controllers\PaiementController;
use App\Http\Controllers\RapportController;
use App\Http\Controllers\TechnicienController;
use App\Http\Controllers\TypePaiementController;
use App\Http\Controllers\UserRoleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PartenaireController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::group(['prefix' => 'api'], function () {
    Route::get('/test', function() {
        return response()->json([
            'message' => 'API is working!',
            'status' => 'success'
        ]);
    });

    Route::group(['prefix' => 'clients', 'as' => 'clients.', 'middleware' => 'auth'], function () {
        Route::get('/', [ClientController::class, 'index'])->name('index');
        Route::get('/avec/installation', [ClientController::class, 'getclientinstallation'])->name('getclientinstallation');
        Route::get('/{id}', [ClientController::class, 'show'])->name('show');
        Route::post('/', [ClientController::class, 'store'])->name('store');
        Route::put('/{id}', [ClientController::class, 'update'])->name('update');
        Route::delete('/{id}', [ClientController::class, 'destroy'])->name('destroy');
    });

    Route::group(['prefix' => 'maintenance', 'as' => 'maintenance.', 'middleware' => 'auth'], function () {
        Route::get('/', [MaintenanceController::class, 'index'])->name('index');
        Route::get('/{id}', [MaintenanceController::class, 'show'])->name('show');
        Route::post('/', [MaintenanceController::class, 'store'])->name('store');
        Route::put('/{id}', [MaintenanceController::class, 'update'])->name('update');
        Route::delete('/{id}', [MaintenanceController::class, 'destroy'])->name('destroy');
    });

    Route::group(['prefix' => 'rapport-maintenances', 'as' => 'rapport-maintenances.', 'middleware' => 'auth'], function () {
        Route::post('/', [RapportController::class, 'storeRapportMaintenance'])->name('store');
    });

    Route::group(['prefix' => 'alert', 'as' => 'alert.', 'middleware' => 'auth'], function () {
        Route::get('/', [AlertController::class, 'index'])->name('index');
        Route::get('/{id}', [AlertController::class, 'show'])->name('show');
        Route::post('/', [AlertController::class, 'store'])->name('store');
        Route::put('/{id}', [AlertController::class, 'update'])->name('update');
        Route::delete('/{id}', [AlertController::class, 'destroy'])->name('destroy');
    });

    Route::group(['prefix' => 'installation', 'as' => 'installation.', 'middleware' => 'auth'], function () {
        Route::get('/', [InstallationController::class, 'index'])->name('index');
        Route::get('/en/panne', [InstallationController::class, 'getInstallation'])->name('getInstallation');
        Route::get('/{id}', [InstallationController::class, 'show'])->name('show');
        Route::post('/', [InstallationController::class, 'store'])->name('store');
        Route::put('/{id}', [InstallationController::class, 'update'])->name('update');
        Route::delete('/{id}', [InstallationController::class, 'destroy'])->name('destroy');
    });

    Route::group(['prefix' => 'localisation', 'as' => 'localisation.', 'middleware' => 'auth'], function () {
        Route::get('/', [LocalisationController::class, 'index'])->name('index');
        Route::get('/{id}', [LocalisationController::class, 'show'])->name('show');
        Route::post('/', [LocalisationController::class, 'store'])->name('store');
        Route::put('/{id}', [LocalisationController::class, 'update'])->name('update');
        Route::delete('/{id}', [LocalisationController::class, 'destroy'])->name('destroy');
    });

    Route::group(['prefix' => 'materiel', 'as' => 'materiel.', 'middleware' => 'auth'], function () {
        Route::get('/', [MaterielController::class, 'index'])->name('index');
        Route::get('/{id}', [MaterielController::class, 'show'])->name('show');
        Route::post('/', [MaterielController::class, 'store'])->name('store');
        Route::put('/{id}', [MaterielController::class, 'update'])->name('update');
        Route::delete('/{id}', [MaterielController::class, 'destroy'])->name('destroy');
    });

    Route::group(['prefix' => 'paiement', 'as' => 'paiement.', 'middleware' => 'auth'], function () {
        Route::get('/', [PaiementController::class, 'index'])->name('index');
        Route::get('/{id}', [PaiementController::class, 'show'])->name('show');
        Route::post('/', [PaiementController::class, 'store'])->name('store');
        Route::put('/{id}', [PaiementController::class, 'update'])->name('update');
        Route::delete('/{id}', [PaiementController::class, 'destroy'])->name('destroy');
    });

    Route::group(['prefix' => 'rapport', 'as' => 'rapport.', 'middleware' => 'auth'], function () {
        Route::get('/', [RapportController::class, 'index'])->name('index');
        Route::get('/{id}', [RapportController::class, 'show'])->name('show');
        Route::post('/', [RapportController::class, 'store'])->name('store');
        Route::put('/{id}', [RapportController::class, 'update'])->name('update');
        Route::delete('/{id}', [RapportController::class, 'destroy'])->name('destroy');
    });

    Route::group(['prefix' => 'type_paiement', 'as' => 'type_paiement.', 'middleware' => 'auth'], function () {
        Route::get('/', [TypePaiementController::class, 'index'])->name('index');
        Route::get('/{id}', [TypePaiementController::class, 'show'])->name('show');
        Route::post('/', [TypePaiementController::class, 'store'])->name('store');
        Route::put('/{id}', [TypePaiementController::class, 'update'])->name('update');
        Route::delete('/{id}', [TypePaiementController::class, 'destroy'])->name('destroy');
    });

    Route::group(['prefix' => 'user_role', 'as' => 'user_role.', 'middleware' => 'auth'], function () {
        Route::get('/', [UserRoleController::class, 'index'])->name('index');
        Route::get('/{id}', [UserRoleController::class, 'show'])->name('show');
        Route::post('/', [UserRoleController::class, 'store'])->name('store');
        Route::put('/{id}', [UserRoleController::class, 'update'])->name('update');
        Route::delete('/{id}', [UserRoleController::class, 'destroy'])->name('destroy');
    });

    Route::group(['prefix' => 'technicien', 'as' => 'technicien.', 'middleware' => 'auth'], function () {
        Route::get('/', [TechnicienController::class, 'index'])->name('index');
        Route::get('/{id}', [TechnicienController::class, 'show'])->name('show');
        // Route::get('/by/user{id}', [TechnicienController::class, 'byuser'])->name('byuser');
        Route::post('/', [TechnicienController::class, 'store'])->name('store');
        Route::put('/{id}', [TechnicienController::class, 'update'])->name('update');
        Route::delete('/{id}', [TechnicienController::class, 'destroy'])->name('destroy');
    });

    Route::group(['prefix' => 'dashboard', 'as' => 'dasboard.', 'middleware' => 'auth'], function () {
        Route::get('/count', [DashboardController::class, 'count'])->name('count');
    });

    Route::get('/user', function () {
        return response()->json([
            'user' => Auth::user()->load('user_role'),
        ]);
    })->middleware('auth');

    Route::get('/users', [UserController::class, 'index'])->name('users.index');

    Route::get('/rapport/maintenance/{maintenance_id}', [RapportController::class, 'showByMaintenanceId']);

    Route::group(['prefix' => 'partenaire', 'as' => 'partenaire.', 'middleware' => 'auth'], function () {
        Route::get('/', [PartenaireController::class, 'index'])->name('index');
        Route::post('/', [PartenaireController::class, 'store'])->name('store');
        Route::get('/{id}', [PartenaireController::class, 'show'])->name('show');
        Route::put('/{id}', [PartenaireController::class, 'update'])->name('update');
        Route::delete('/{id}', [PartenaireController::class, 'destroy'])->name('destroy');
    });
});
