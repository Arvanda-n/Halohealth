<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    // database/migrations/xxxx_xx_xx_create_consultations_table.php
public function up(): void
{
    Schema::create('consultations', function (Blueprint $table) {
        $table->id();
        $table->foreignId('patient_id')->constrained('users'); // Pasien
        $table->foreignId('doctor_id')->constrained('doctors'); // Dokter
        $table->enum('status', ['pending', 'active', 'completed', 'cancelled'])->default('pending');
        $table->text('notes')->nullable(); // Catatan dokter
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('consultations');
    }
};
