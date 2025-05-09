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
        Schema::create('maintenaces_semestres', function (Blueprint $table) {
            $table->id();
            $table->foreignId('installationId');
            $table->string('categorie');
            $table->string('point_controller');
            $table->string('statut');
            $table->string('actions');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('maintenaces_semestres');
    }
};
