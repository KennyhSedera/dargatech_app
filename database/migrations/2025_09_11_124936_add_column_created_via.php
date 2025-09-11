<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('rapport_maintenances', function (Blueprint $table) {
            $table->enum('created_via', allowed: ['web', 'telegram_bot'])->default('web');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('rapport_maintenances', function (Blueprint $table) {
            $table->dropColumn('created_via');
        });
    }
};
