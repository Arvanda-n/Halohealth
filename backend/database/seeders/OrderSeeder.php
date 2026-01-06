<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Order;
use App\Models\User;

class OrderSeeder extends Seeder
{
    public function run()
    {
        // Pastikan ada user dulu (Admin / User biasa)
        $user = User::first(); 
        if(!$user) return; // Kalau db kosong, skip

        $statuses = ['pending', 'process', 'completed', 'cancelled'];

        // Buat 10 Transaksi Random
        for ($i = 1; $i <= 10; $i++) {
            Order::create([
                'invoice_code' => 'INV-' . date('Ymd') . '-' . sprintf('%03d', $i),
                'user_id' => $user->id, // Pakai user yang ada aja
                'total_price' => rand(15000, 250000), // Harga random
                'status' => $statuses[array_rand($statuses)], // Status random
                'note' => 'Paracetamol (2), Vitamin C (1), Betadine (1)', // Contoh barang
            ]);
        }
    }
}