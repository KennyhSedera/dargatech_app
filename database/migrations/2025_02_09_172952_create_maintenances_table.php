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
        Schema::create('maintenances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('installation_id')->constrained()->onDelete('cascade');
            $table->string('type_intervention');
            $table->text('description_probleme');
            $table->text('solutions_apportees');
            $table->date('date_intervention');
            $table->time('duree_intervention');
            $table->string('technicien');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('maintenances');
    }
};
