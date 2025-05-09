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
        Schema::create('installations', function (Blueprint $table) {
            $table->id();
            $table->string('code_installation')->unique()->default('I0001');
            $table->foreignId('client_id')->constrained()->onDelete('cascade');
            $table->date('date_installation');
            $table->float('puissance_pompe');
            $table->float('profondeur_forage');
            $table->float('debit_nominal');
            $table->float('surface_panneaux');
            $table->string('statuts')->default('installée');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('installations');
    }
};
