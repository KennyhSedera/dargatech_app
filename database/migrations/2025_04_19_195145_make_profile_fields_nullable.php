<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('profiles', function (Blueprint $table) {
            $table->string('contact')->nullable()->change();
            $table->string('genre')->nullable()->change();
            $table->string('adress')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('profiles', function (Blueprint $table) {
            $table->string('contact')->nullable(false)->change();
            $table->string('genre')->nullable(false)->change();
            $table->string('adress')->nullable(false)->change();
        });
    }
};

