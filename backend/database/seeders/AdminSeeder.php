<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
       User::create([
    'name' => 'Admin Halohealth',
    'email' => 'admin@halohealth.com',
    'phone' => '081234567890', // ← WAJIB DITAMBAHKAN
    'password' => Hash::make('admin123'),
    'role' => 'admin'
]);

    }
}
