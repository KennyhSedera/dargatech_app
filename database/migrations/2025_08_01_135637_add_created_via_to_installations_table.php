<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('installations', function (Blueprint $table) {
            $table->enum('created_via', ['web', 'telegram_bot'])->default('web');
            $table->json('photos_installation')->nullable();
        });
    }

    public function down()
    {
        Schema::table('installations', function (Blueprint $table) {
            $table->dropColumn('created_via');
        });
    }
};
