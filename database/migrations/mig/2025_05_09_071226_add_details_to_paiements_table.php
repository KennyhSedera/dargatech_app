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
        Schema::table('paiements', function (Blueprint $table) {
            $table->date('date_creation')->default(DB::raw('CURRENT_DATE'));
            $table->date('date')->default(DB::raw('CURRENT_DATE'));
            $table->string('lieu_creation')->default('Atakpamé');
            $table->string('date_additionnel')->default('Date de vente');
            $table->string('nom_vendeur')->default('Darga');
            $table->string('nom_vendeurs')->default('DARGATECH TOGO');
            $table->string('select1')->default('Numéro TVA');
            $table->string('num_tva')->nullable();
            $table->string('nom_rue_vendeur')->default('Kara');
            $table->string('ville_vendeur')->default('Kara');
            $table->string('pays_vendeur')->default('Togo');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('paiements', function (Blueprint $table) { 
            $table->dropColumn([
                'date_creation',
                'date',
                'lieu_creation',
                'date_additionnel',
                'nom_vendeur',
                'nom_vendeurs',
                'select1',
                'num_tva',
                'nom_rue_vendeur',
                'ville_vendeur',
                'pays_vendeur',
            ]);
        });
    }
};
