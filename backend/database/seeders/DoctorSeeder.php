<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DoctorSeeder extends Seeder
{
    public function run(): void
    {
        // KUMPULAN FOTO DOKTER (Link Unsplash yang stabil)
        $imgMale = 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400';
        $imgFemale = 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=400';

        $doctors = [
            // 1. DOKTER UMUM
            ['name' => 'Dr. Andi Pratama', 'spec' => 'Umum', 'exp' => 5, 'fee' => 35000, 'img' => $imgMale],
            ['name' => 'Dr. Sarah Amelia', 'spec' => 'Umum', 'exp' => 3, 'fee' => 30000, 'img' => $imgFemale],
            
            // 2. SPESIALIS ANAK
            ['name' => 'Dr. Anisa Putri, Sp.A', 'spec' => 'Anak', 'exp' => 8, 'fee' => 120000, 'img' => $imgFemale],
            ['name' => 'Dr. Bambang Wijaya, Sp.A', 'spec' => 'Anak', 'exp' => 15, 'fee' => 150000, 'img' => $imgMale],

            // 3. DOKTER GIGI
            ['name' => 'Drg. Citra Kirana', 'spec' => 'Gigi', 'exp' => 4, 'fee' => 75000, 'img' => $imgFemale],
            
            // 4. KANDUNGAN
            ['name' => 'Dr. Lestari Dewi, Sp.OG', 'spec' => 'Kandungan', 'exp' => 10, 'fee' => 175000, 'img' => $imgFemale],
        ];

        foreach ($doctors as $index => $doc) {
            // A. Bikin Email Otomatis (biar tabel users gak error)
            // Contoh: Dr. Andi Pratama -> andipratama@halohealth.com
            $cleanName = strtolower(preg_replace('/[^a-zA-Z]/', '', $doc['name']));
            $email = $cleanName . '@halohealth.com';
            
            // B. Bikin No HP Unik
            $phone = '081234567' . str_pad($index, 3, '0', STR_PAD_LEFT);

            // C. Insert ke Tabel USERS Dulu (Akun Login)
            $userId = DB::table('users')->insertGetId([
                'name' => $doc['name'],
                'email' => $email,        // <--- WAJIB ADA
                'phone' => $phone,
                'password' => Hash::make('123456'), // Password default
                'role' => 'doctor',
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // D. Baru Insert ke Tabel DOCTORS (Profil)
            DB::table('doctors')->insert([
                'user_id' => $userId,     // <--- KUNCI RELASINYA DI SINI
                'specialization' => $doc['spec'],
                'experience_years' => $doc['exp'],
                'consultation_fee' => $doc['fee'],
                'image' => $doc['img'],
                'is_online' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}