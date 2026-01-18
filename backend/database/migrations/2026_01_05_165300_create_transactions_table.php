<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            
            // Ubah 'patient_id' jadi 'user_id' biar cocok sama Frontend
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            
            // 🔥 KUNCI: ->nullable() biar bisa beli obat tanpa dokter
            $table->foreignId('doctor_id')->nullable()->constrained('users')->onDelete('cascade');

            $table->decimal('amount', 12, 2);
            
            // Tambah status 'success'
            $table->enum('status', ['pending', 'paid', 'cancelled', 'success'])->default('pending');
            
            $table->string('payment_method')->nullable();

            // Tambah kolom untuk Dashboard Admin
            $table->string('type')->default('consultation'); // 'medicine' / 'consultation'
            $table->text('note')->nullable(); 

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};