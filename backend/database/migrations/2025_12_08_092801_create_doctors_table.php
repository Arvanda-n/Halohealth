<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    // database/migrations/xxxx_xx_xx_create_doctors_table.php
public function up()
{
    Schema::create('doctors', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
        $table->string('specialization');
        $table->integer('experience_years');
        $table->integer('consultation_fee');
        $table->string('image')->nullable(); // 👈 PASTIKAN INI 'image', BUKAN 'photo'
        $table->string('hospital')->nullable();
        $table->boolean('is_online')->default(false);
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('doctors');
    }
};
