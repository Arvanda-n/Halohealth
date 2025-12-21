<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('doctors', function (Blueprint $table) {
            $table->id();
            
            // PENTING: Sambungkan ke tabel Users
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');

            // Data Dokter Lengkap
            $table->string('specialization'); // Spesialisasi
            $table->string('license_number')->unique()->nullable(); // STR
            $table->integer('experience_years')->default(0);
            $table->integer('consultation_fee')->default(0);
            
            // Biodata Tambahan
            $table->text('address')->nullable();
            $table->string('photo')->nullable();
            $table->enum('gender', ['male', 'female'])->nullable();
            $table->date('birth_date')->nullable();
            
            $table->boolean('is_online')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('doctors');
    }
};