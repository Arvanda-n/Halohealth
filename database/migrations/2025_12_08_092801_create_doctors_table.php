<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDoctorsTable extends Migration
{
    public function up(){
        Schema::create('doctors', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('specialist');
            $table->foreignId('category_id')->constrained('categories')->cascadeOnDelete();
            $table->text('profile')->nullable();
            $table->string('photo')->nullable();
            $table->timestamps();
    });

    }

    public function down()
    {
        Schema::dropIfExists('doctors');
    }
}
