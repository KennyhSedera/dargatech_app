<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('rapport_maintenances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('clientId');
            $table->foreignId('technicienId');
            $table->foreignId('maintenanceId');
            $table->json(column: 'description_panne');
            $table->json(column: 'diagnostic_initial');
            $table->json('cause_identifiee');
            $table->json('intervention_realisee');
            $table->json('verification_fonctionnement');
            $table->json(column: 'recommandation_client');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rapport_maintenances');
    }
};
