<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('techniciens', function (Blueprint $table) {
            $table->string('telegram_user_id', 50)->nullable()->unique();
            $table->string('telegram_username', 100)->nullable();
            $table->boolean('bot_active')->default(true);
        });
    }

    public function down()
    {
        Schema::table('techniciens', function (Blueprint $table) {
            $table->dropColumn(['telegram_user_id', 'telegram_username', 'bot_active']);
        });
    }
};
