<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   // database/migrations/xxxx_xx_xx_create_medicines_table.php
public function up(): void
{
    Schema::create('medicines', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->string('slug'); 
        $table->string('category'); // <--- TAMBAHAN PENTING
        $table->string('sub_category')->nullable(); // <--- TAMBAHAN PENTING
        $table->text('description')->nullable();
        $table->integer('price');
        $table->integer('stock');
        $table->string('image')->nullable();
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medicines');
    }
};
