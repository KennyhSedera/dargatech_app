<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProductsTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('designation');
            $table->string('reference')->nullable();
            $table->integer('quantite')->default(1);
            $table->string('unite')->nullable();
            $table->float('tva')->default(0);
            $table->float('prix_unitaire')->default(0);
            $table->float('total_ht')->default(0);
            $table->float('total_ttc')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
}
