<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('installations', function (Blueprint $table) {
            $table->double('qte_eau')->nullable()->default(0)->change();
            $table->double('qte_co2')->nullable()->default(0)->change();
        });
    }

    public function down(): void
    {
        Schema::table('installations', function (Blueprint $table) {
            $table->integer('qte_eau')->change();
            $table->integer('qte_co2')->change();
        });
    }
};
