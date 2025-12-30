<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DoctorSeeder extends Seeder
{
    public function run(): void
    {
        // KUMPULAN FOTO DOKTER HD (UNSPLASH)
        $imgDocMale1 = 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400';
        $imgDocMale2 = 'https://images.unsplash.com/photo-1537368910025-bc005fbede68?auto=format&fit=crop&q=80&w=400';
        $imgDocMale3 = 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400';
        $imgDocFemale1 = 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=400';
        $imgDocFemale2 = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400';
        $imgDocFemale3 = 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&q=80&w=400';

        $doctors = [
            // --- 1. DOKTER UMUM (General Practitioner) ---
            [
                'name' => 'Dr. Andi Pratama',
                'specialization' => 'Dokter Umum',
                'experience_years' => 5,
                'consultation_fee' => 35000,
                'hospital' => 'Klinik Sehat Selalu',
                'image' => $imgDocMale1
            ],
            [
                'name' => 'Dr. Sarah Amelia',
                'specialization' => 'Dokter Umum',
                'experience_years' => 3,
                'consultation_fee' => 30000,
                'hospital' => 'Puskesmas Tebet',
                'image' => $imgDocFemale1
            ],
            [
                'name' => 'Dr. Budi Santoso',
                'specialization' => 'Dokter Umum',
                'experience_years' => 10,
                'consultation_fee' => 45000,
                'hospital' => 'RSUD Jakarta Pusat',
                'image' => $imgDocMale2
            ],

            // --- 2. SPESIALIS ANAK (Pediatrician) ---
            [
                'name' => 'Dr. Anisa Putri, Sp.A',
                'specialization' => 'Spesialis Anak',
                'experience_years' => 8,
                'consultation_fee' => 120000,
                'hospital' => 'RS Ibu & Anak Bunda',
                'image' => $imgDocFemale2
            ],
            [
                'name' => 'Dr. Bambang Wijaya, Sp.A',
                'specialization' => 'Spesialis Anak',
                'experience_years' => 15,
                'consultation_fee' => 150000,
                'hospital' => 'RS Hermina Jatinegara',
                'image' => $imgDocMale3
            ],
            [
                'name' => 'Dr. Melati Suci, Sp.A',
                'specialization' => 'Spesialis Anak',
                'experience_years' => 6,
                'consultation_fee' => 110000,
                'hospital' => 'Klinik Tumbuh Kembang',
                'image' => $imgDocFemale3
            ],

            // --- 3. SPESIALIS KULIT (Dermatologist) ---
            [
                'name' => 'Dr. Rina Wulandari, Sp.KK',
                'specialization' => 'Spesialis Kulit',
                'experience_years' => 7,
                'consultation_fee' => 180000,
                'hospital' => 'Glow Skin Clinic',
                'image' => $imgDocFemale1
            ],
            [
                'name' => 'Dr. Cahya Nugraha, Sp.KK',
                'specialization' => 'Spesialis Kulit',
                'experience_years' => 12,
                'consultation_fee' => 200000,
                'hospital' => 'Erha Dermatology',
                'image' => $imgDocMale1
            ],

            // --- 4. PENYAKIT DALAM (Internist) ---
            [
                'name' => 'Dr. Hadi Hartono, Sp.PD',
                'specialization' => 'Penyakit Dalam',
                'experience_years' => 20,
                'consultation_fee' => 250000,
                'hospital' => 'RS Cipto Mangunkusumo',
                'image' => $imgDocMale2
            ],
            [
                'name' => 'Dr. Siti Aminah, Sp.PD',
                'specialization' => 'Penyakit Dalam',
                'experience_years' => 14,
                'consultation_fee' => 220000,
                'hospital' => 'RS Siloam Kebon Jeruk',
                'image' => $imgDocFemale2
            ],

            // --- 5. KANDUNGAN (OBGYN) ---
            [
                'name' => 'Dr. Lestari Dewi, Sp.OG',
                'specialization' => 'Kandungan',
                'experience_years' => 10,
                'consultation_fee' => 175000,
                'hospital' => 'RS Pondok Indah',
                'image' => $imgDocFemale3
            ],
            [
                'name' => 'Dr. Setiawan Budi, Sp.OG',
                'specialization' => 'Kandungan',
                'experience_years' => 18,
                'consultation_fee' => 210000,
                'hospital' => 'RS YPK Mandiri',
                'image' => $imgDocMale3
            ],

            // --- 6. SPESIALIS THT (ENT) ---
            [
                'name' => 'Dr. Eka Putra, Sp.THT',
                'specialization' => 'Spesialis THT',
                'experience_years' => 9,
                'consultation_fee' => 140000,
                'hospital' => 'RS THT Proklamasi',
                'image' => $imgDocMale1
            ],
            [
                'name' => 'Dr. Maya Anggraini, Sp.THT',
                'specialization' => 'Spesialis THT',
                'experience_years' => 11,
                'consultation_fee' => 150000,
                'hospital' => 'RS Columbia Asia',
                'image' => $imgDocFemale1
            ],

            // --- 7. KESEHATAN JIWA (Psychiatrist) ---
            [
                'name' => 'Dr. Jiwa Sentosa, Sp.KJ',
                'specialization' => 'Kesehatan Jiwa',
                'experience_years' => 16,
                'consultation_fee' => 300000,
                'hospital' => 'RS Jiwa Dharmawangsa',
                'image' => $imgDocMale2
            ],
            [
                'name' => 'Dr. Ratna Juwita, Sp.KJ',
                'specialization' => 'Kesehatan Jiwa',
                'experience_years' => 8,
                'consultation_fee' => 250000,
                'hospital' => 'Klinik Mentari',
                'image' => $imgDocFemale2
            ],

            // --- 8. DOKTER GIGI (Dentist) ---
            [
                'name' => 'Drg. Citra Kirana',
                'specialization' => 'Dokter Gigi',
                'experience_years' => 4,
                'consultation_fee' => 75000,
                'hospital' => 'Klinik Gigi Happy Tooth',
                'image' => $imgDocFemale3
            ],
            [
                'name' => 'Drg. Doni Darmawan',
                'specialization' => 'Dokter Gigi',
                'experience_years' => 12,
                'consultation_fee' => 100000,
                'hospital' => 'RSGM FKG UI',
                'image' => $imgDocMale3
            ],
            [
                'name' => 'Drg. Bella Saphira, Sp.Ort',
                'specialization' => 'Dokter Gigi',
                'experience_years' => 9,
                'consultation_fee' => 150000,
                'hospital' => 'Audy Dental Clinic',
                'image' => $imgDocFemale1
            ],

            // --- 9. DOKTER HEWAN (Veterinarian) ---
            [
                'name' => 'Drh. Satwa Lia',
                'specialization' => 'Dokter Hewan',
                'experience_years' => 5,
                'consultation_fee' => 60000,
                'hospital' => 'Klinik Hewan Sahabat',
                'image' => $imgDocFemale2
            ],
            [
                'name' => 'Drh. Rexy Kucing',
                'specialization' => 'Dokter Hewan',
                'experience_years' => 7,
                'consultation_fee' => 85000,
                'hospital' => 'Groovy Pet Care',
                'image' => $imgDocMale1
            ],

            // --- 10. SPESIALIS MATA (Ophthalmologist) ---
            [
                'name' => 'Dr. Mata Elang, Sp.M',
                'specialization' => 'Spesialis Mata',
                'experience_years' => 13,
                'consultation_fee' => 190000,
                'hospital' => 'JEC Eye Center',
                'image' => $imgDocMale2
            ],
            [
                'name' => 'Dr. Vina Panduwinata, Sp.M',
                'specialization' => 'Spesialis Mata',
                'experience_years' => 8,
                'consultation_fee' => 165000,
                'hospital' => 'RS Mata Aini',
                'image' => $imgDocFemale3
            ]
        ];

        foreach ($doctors as $index => $doc) {
            // Generate nomor HP unik biar gak error unique constraint
            $phoneNumber = '081234567' . str_pad($index, 3, '0', STR_PAD_LEFT);

            // 1. Buat Akun User
            $userId = DB::table('users')->insertGetId([
                'name' => $doc['name'],
                'phone' => $phoneNumber,
                'password' => Hash::make('password123'),
                'role' => 'doctor',
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // 2. Buat Profil Dokter
            DB::table('doctors')->insert([
                'user_id' => $userId,
                'specialization' => $doc['specialization'],
                'experience_years' => $doc['experience_years'],
                'consultation_fee' => $doc['consultation_fee'],
                'hospital' => $doc['hospital'],
                'image' => $doc['image'],
                'is_online' => rand(0, 1) == 1, // Random online/offline biar variatif
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}