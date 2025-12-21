<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('consultations', function (Blueprint $table) {
            $table->id();
            
            // 1. KITA UBAH JADI user_id (Biar cocok sama Model & Controller)
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); 
            
            $table->foreignId('doctor_id')->constrained('doctors')->onDelete('cascade');
            
            // 2. TAMBAHAN KOLOM PENTING (Biar bisa Chat)
            $table->text('question'); // Pasien nanya apa
            $table->text('answer')->nullable(); // Dokter jawab apa (awalnya kosong)
            
            // Status & Notes
            $table->enum('status', ['pending', 'answered', 'cancelled'])->default('pending');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('consultations');
    }
};