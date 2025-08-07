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
        Schema::create('telegram_sessions', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('user_id')->index();
            $table->bigInteger('chat_id')->index();
            $table->string('command', 50)->index();
            $table->string('step', 50);
            $table->json('data')->nullable();
            $table->boolean('completed')->default(false)->index();
            $table->timestamps();

            // Index composé pour optimiser les requêtes fréquentes
            $table->index(['user_id', 'command', 'completed']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('telegram_sessions');
    }
};
