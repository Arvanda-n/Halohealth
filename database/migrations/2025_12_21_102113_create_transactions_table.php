<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->string('user_nid'); 
            $table->string('type'); // medicine / consultation / appointment
            $table->unsignedBigInteger('item_id');
            $table->integer('total_price');
            $table->enum('status', ['pending', 'paid', 'cancel'])->default('pending');
            $table->timestamps(); // created_at otomatis
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};

