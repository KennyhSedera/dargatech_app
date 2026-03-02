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

        Schema::table('paiements', function (Blueprint $table) {
            $table->dropColumn('pays_acheteur');
            $table->dropColumn('ville_acheteur');
        });

        Schema::table('clients', function (Blueprint $table) {
            $table->string('pays_acheteur')->nullable()->default('Togo');
            $table->string('ville_acheteur')->nullable()->default('Lome');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {

        Schema::table('paiements', function (Blueprint $table) {
            $table->string('pays_acheteur')->nullable()->default('Togo');
            $table->string('ville_acheteur')->nullable()->default('Lome');
        });

        Schema::table('clients', function (Blueprint $table) {
            $table->dropColumn('pays_acheteur');
            $table->dropColumn('ville_acheteur');
        });
    }
};
