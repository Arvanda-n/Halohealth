<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDoctorsTable extends Migration
{
    public function up()
    {
        Schema::create('doctors', function (Blueprint $table) {
            $table->id();
            $table->string('name');                 // nama lengkap
            $table->string('email')->unique()->nullable();
            $table->string('phone')->nullable();
            $table->string('specialty')->nullable(); // spesialisasi
            $table->string('license_number')->unique()->nullable(); // nomor izin/praktik
            $table->text('address')->nullable();
            $table->enum('gender', ['male','female','other'])->nullable();
            $table->date('birth_date')->nullable();
            $table->string('photo')->nullable();    // path foto
            $table->boolean('active')->default(true);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('doctors');
    }
}
