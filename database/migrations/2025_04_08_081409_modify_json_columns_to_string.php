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
        Schema::table('rapport_maintenances', function (Blueprint $table) {
            $table->text('description_panne')->change();
            $table->text('diagnostic_initial')->change();
            $table->text('cause_identifiee')->change();
            $table->text('intervention_realisee')->change();
            $table->text('verification_fonctionnement')->change();
            $table->text('recommandation_client')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('rapport_maintenances', function (Blueprint $table) {
            $table->json('description_panne')->change();
            $table->json('diagnostic_initial')->change();
            $table->json('cause_identifiee')->change();
            $table->json('intervention_realisee')->change();
            $table->json('verification_fonctionnement')->change();
            $table->json('recommandation_client')->change();
        });
    }
};
