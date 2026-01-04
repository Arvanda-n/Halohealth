<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ArticleSeeder extends Seeder
{
    public function run(): void
    {
        // DATA ARTIKEL REALISTIS
        $articles = [
            [
                'title' => 'Kenali Gejala Awal Diabetes di Usia Muda',
                'category' => 'Penyakit',
                'author' => 'Dr. Andi Pratama',
                'content' => 'Diabetes kini tidak hanya menyerang orang tua. Kenali tanda-tanda awalnya seperti sering haus, mudah lelah...',
                'image' => 'https://images.unsplash.com/photo-1579684385136-137af7549091?w=400&auto=format&fit=crop&q=60',
                'published_at' => now(),
            ],
            [
                'title' => 'Tips Menjaga Kesehatan Mental Pekerja Kantoran',
                'category' => 'Hidup Sehat',
                'author' => 'Indah Sundari, M.Psi',
                'content' => 'Stres kerja bisa berdampak buruk. Lakukan istirahat berkala dan kelola waktu dengan baik untuk mental yang sehat.',
                'image' => 'https://images.unsplash.com/photo-1493836512294-502baa1986e2?w=400&auto=format&fit=crop&q=60',
                'published_at' => now(),
            ],
            [
                'title' => 'Makanan Kaya Zat Besi untuk Cegah Anemia',
                'category' => 'Nutrisi',
                'author' => 'Dr. Budi Santoso',
                'content' => 'Kurang darah atau anemia bisa diatasi dengan konsumsi bayam, daging merah, dan kacang-kacangan.',
                'image' => 'https://images.unsplash.com/photo-1576091160550-2187d80aeff2?w=400&auto=format&fit=crop&q=60',
                'published_at' => now(),
            ],
            [
                'title' => 'Pentingnya Olahraga Pagi Minimal 15 Menit',
                'category' => 'Hidup Sehat',
                'author' => 'Dr. Tirta',
                'content' => 'Tidak perlu lama, olahraga ringan di pagi hari dapat meningkatkan metabolisme dan mood seharian.',
                'image' => 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&auto=format&fit=crop&q=60',
                'published_at' => now(),
            ],
             [
                'title' => 'Cara Mengatasi Insomnia Tanpa Obat Tidur',
                'category' => 'Tidur',
                'author' => 'Dr. Jiwa Sentosa',
                'content' => 'Hindari gadget sebelum tidur dan atur suhu kamar agar nyaman untuk kualitas tidur yang lebih baik.',
                'image' => 'https://images.unsplash.com/photo-1541781777621-05f7c37f3780?w=400&auto=format&fit=crop&q=60',
                'published_at' => now(),
            ],
            [
                'title' => 'Vaksinasi Lengkap untuk Anak, Apa Saja?',
                'category' => 'Ibu & Anak',
                'author' => 'Dr. Melati Suci, Sp.A',
                'content' => 'Pastikan buah hati mendapatkan imunisasi dasar lengkap untuk mencegah penyakit berbahaya.',
                'image' => 'https://images.unsplash.com/photo-1632053001876-0c67534f3c05?w=400&auto=format&fit=crop&q=60',
                'published_at' => now(),
            ]
        ];

        foreach ($articles as $art) {
            DB::table('articles')->insert([
                'title' => $art['title'],
                'category' => $art['category'],
                'author' => $art['author'],
                'content' => $art['content'],
                'image' => $art['image'],
                'published_at' => $art['published_at'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}