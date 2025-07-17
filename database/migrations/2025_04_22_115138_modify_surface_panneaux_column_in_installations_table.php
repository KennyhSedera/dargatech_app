<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('installations', function (Blueprint $table) {
            $table->dropColumn('surface_panneaux');
            $table->string('numero_serie')->after('debit_nominal');
            $table->string(column: 'source_eau')->after(column: 'debit_nominal');
            $table->integer('hmt')->after('debit_nominal');
        });
    }

    public function down(): void
    {
        Schema::table('installations', function (Blueprint $table) {
            $table->dropColumn('numero_serie');
            $table->dropColumn('source_eau');
            $table->dropColumn('hmt');
            $table->float('surface_panneaux')->after('debit_nominal');
        });
    }
};
