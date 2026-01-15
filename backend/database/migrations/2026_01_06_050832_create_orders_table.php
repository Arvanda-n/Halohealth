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
    Schema::table('users', function (Blueprint $table) {
        // Nambah kolom data diri
        $table->enum('gender', ['Laki-laki', 'Perempuan'])->nullable()->after('email');
        $table->date('birth_date')->nullable()->after('gender');
        $table->string('phone')->nullable()->after('birth_date');
        
        // Nambah kolom kesehatan
        $table->integer('height')->nullable()->comment('cm')->after('phone');
        $table->integer('weight')->nullable()->comment('kg')->after('height');
    });
}

public function down()
{
    Schema::table('users', function (Blueprint $table) {
        $table->dropColumn(['gender', 'birth_date', 'phone', 'height', 'weight']);
    });
}
};
