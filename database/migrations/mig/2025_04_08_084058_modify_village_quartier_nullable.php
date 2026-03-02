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
        Schema::table('localisations', function (Blueprint $table) {
            $table->string('village')->nullable()->change();
            $table->string('quartier')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('localisations', function (Blueprint $table) {
            $table->string('village')->nullable(false)->change();
            $table->string('quartier')->nullable(false)->change();
        });
    }
};
