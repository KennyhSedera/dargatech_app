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
        Schema::create('clients', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string('prenom');
            $table->string('telephone');
            $table->string('localisation');
            $table->string('genre')->nullable();
            $table->string('email')->nullable();
            $table->string('CIN')->nullable();
            $table->date('date_contrat')->nullable();
            $table->string('type_activite_agricole');
            $table->float('surface_cultivee');
            $table->foreignId('localisation_id')->constrained('localisations')->onDelete('cascade')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clients');
    }
};
