<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Buat User Admin (Biar bisa login admin)
        User::firstOrCreate(
            ['email' => 'admin@gmail.com'],
            [
                'name' => 'Admin HaloHealth',
                'phone' => '081234567890',
                'password' => Hash::make('123456'),
                'role' => 'admin',
            ]
        );

        // 2. JALANKAN SEMUA SEEDER (Dokter, Obat, Artikel)
        $this->call([
            DoctorSeeder::class,    // Pastikan file DoctorSeeder.php sudah ada
            MedicineSeeder::class,  // Ini yang baru kita buat
            ArticleSeeder::class,   // Ini yang baru kita buat
        ]);
    }
}