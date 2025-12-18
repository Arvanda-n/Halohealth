<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Medicine;
use App\Models\Doctor;
use App\Models\Article;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Buat User Admin
        User::create([
            'name' => 'Admin HaloHealth',
            'phone' => '081234567890',
            'password' => Hash::make('password123'),
            'role' => 'admin',
        ]);

        // 2. Buat User Dokter & Data Dokternya
        $doctorUser = User::create([
            'name' => 'Dr. Strange',
            'phone' => '081298765432',
            'password' => Hash::make('password123'),
            'role' => 'doctor',
        ]);

        Doctor::create([
            'user_id' => $doctorUser->id,
            'specialization' => 'Spesialis Bedah Syaraf',
            'experience_years' => 10,
            'consultation_fee' => 50000,
            'is_online' => true
        ]);

        // 3. Buat Data Obat Dummy
        Medicine::create([
            'name' => 'Paracetamol 500mg',
            'slug' => 'paracetamol-500mg',
            'description' => 'Obat penurun demam dan pereda nyeri.',
            'price' => 5000,
            'stock' => 100,
            'image' => 'https://via.placeholder.com/150'
        ]);

        Medicine::create([
            'name' => 'Vitamin C 1000mg',
            'slug' => 'vitamin-c-1000mg',
            'description' => 'Menjaga daya tahan tubuh.',
            'price' => 15000,
            'stock' => 50,
            'image' => 'https://via.placeholder.com/150'
        ]);

        // 4. Buat Artikel Dummy
        Article::create([
            'title' => 'Tips Menjaga Kesehatan di Musim Hujan',
            'content' => 'Lorem ipsum dolor sit amet...',
            'author' => 'Dr. Strange',
            'published_at' => now(),
            'image' => 'https://via.placeholder.com/300'
        ]);
    }
}