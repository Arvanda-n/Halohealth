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
        Schema::table('doctors', function (Blueprint $table) {
            
            // 1. Cek SIP (Kalau belum ada, baru buat)
            if (!Schema::hasColumn('doctors', 'sip')) {
                $table->string('sip')->nullable()->after('specialization');
            }

            // 2. Cek Hospital (Ini yang bikin error tadi, sekarang kita kasih IF)
            if (!Schema::hasColumn('doctors', 'hospital')) {
                $table->string('hospital')->nullable()->after('sip');
            }

            // 3. Cek Experience
            if (!Schema::hasColumn('doctors', 'experience')) {
                $table->string('experience')->nullable()->after('hospital');
            }

            // 4. Cek Price
            if (!Schema::hasColumn('doctors', 'price')) {
                 $table->decimal('price', 10, 2)->default(50000)->after('image');
            }
        });
    }
public function down()
{
    Schema::table('doctors', function (Blueprint $table) {
        $table->dropColumn(['sip', 'hospital', 'experience']);
    });
}
};
