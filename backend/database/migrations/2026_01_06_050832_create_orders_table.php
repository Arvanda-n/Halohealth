<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   public function up()
{
    Schema::create('orders', function (Blueprint $table) {
        $table->id();
        $table->string('invoice_code'); // Contoh: INV-001
        $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // Yang beli siapa
        $table->integer('total_price');
        $table->string('status')->default('pending'); // pending, process, completed, cancelled
        $table->text('note')->nullable(); // Catatan obat (JSON string simpel dulu)
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
