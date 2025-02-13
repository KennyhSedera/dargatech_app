<?php

use App\Http\Controllers\ClientController;
use App\Http\Controllers\InstallationController;
// use App\Http\Controllers\TelegramBotController;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Route;

Route::group(['prefix' => 'api'], function () {
    Route::group(['prefix' => 'clients', 'as' => 'clients.', 'middleware' => 'auth'], function () {
        Route::get('/', [ClientController::class, 'index'])->name('index');
        Route::get('/{id}', [ClientController::class, 'show'])->name('show');
        Route::post('/', [ClientController::class, 'store'])->name('store');
        Route::put('/{id}', [ClientController::class, 'update'])->name('update');
        Route::delete('/{id}', [ClientController::class, 'destroy'])->name('destroy');
    });

    Route::group(['prefix' => 'installation', 'as' => 'installation.', 'middleware' => 'auth'], function () {
        Route::get('/', [InstallationController::class, 'index'])->name('index');
        Route::get('/{id}', [InstallationController::class, 'show'])->name('show');
        Route::post('/', [InstallationController::class, 'store'])->name('store');
        Route::put('/{id}', [InstallationController::class, 'update'])->name('update');
        Route::delete('/{id}', [InstallationController::class, 'destroy'])->name('destroy');
    });
});

// Route::post('/telegram/webhook', [TelegramBotController::class, 'handle']);
Route::post('/telegram/webhook', function (Request $request) {
    Log::info('Requête Telegram Webhook reçue', $request->all());

    return response()->json(['status' => 'ok']);
});
