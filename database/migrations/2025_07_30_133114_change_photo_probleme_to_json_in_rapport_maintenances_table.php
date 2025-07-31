<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

class ChangePhotoProblemeToJsonInRapportMaintenancesTable extends Migration
{
    public function up()
    {
        Schema::table('rapport_maintenances', function ($table) {
            $table->dropColumn('photo_probleme');
        });

        Schema::table('rapport_maintenances', function ($table) {
            $table->json('photo_probleme')->nullable();
        });
    }

    public function down()
    {
        Schema::table('rapport_maintenances', function ($table) {
            $table->dropColumn('photo_probleme');
        });

        Schema::table('rapport_maintenances', function ($table) {
            $table->text('photo_probleme')->nullable();
        });
    }
}
