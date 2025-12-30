<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class MedicineSeeder extends Seeder
{
    public function run(): void
    {
        $medicines = [
            // === KATEGORI: OBAT CAIR & SIRUP ===
            [
                'name' => 'OBH Combi Batuk Berdahak',
                'description' => 'Obat batuk hitam untuk meredakan batuk berdahak.',
                'price' => 18000,
                'category' => 'Obat Cair',
                'image' => '/images/obh_combi.webp' // 👈 HAPUS 'medicines/', LANGSUNG KE IMAGES
            ],
            [
                'name' => 'Sanmol Sirup',
                'description' => 'Penurun panas dan pereda nyeri untuk anak.',
                'price' => 22000,
                'category' => 'Obat Cair',
                'image' => '/images/sanmol_sirup.webp'
            ],
            [
                'name' => 'Siladex Cough & Cold',
                'description' => 'Sirup obat batuk dan pilek, melegakan tenggorokan.',
                'price' => 19500,
                'category' => 'Obat Cair',
                'image' => '/images/siladex_merah.webp'
            ],
            [
                'name' => 'Termorex Sirup',
                'description' => 'Sirup penurun panas bebas alkohol untuk anak.',
                'price' => 15000,
                'category' => 'Obat Cair',
                'image' => '/images/termorex.jpg'
            ],
            [
                'name' => 'Vicks Formula 44',
                'description' => 'Meredakan batuk tidak berdahak dan tenggorokan gatal.',
                'price' => 24000,
                'category' => 'Obat Cair',
                'image' => '/images/vicks_formula_44.jpg'
            ],
            [
                'name' => 'Mylanta Cair',
                'description' => 'Mengatasi sakit maag dan asam lambung berlebih.',
                'price' => 45000,
                'category' => 'Obat Cair',
                'image' => '/images/mylanta.jpg'
            ],

            // === KATEGORI: TABLET & KAPLET ===
            [
                'name' => 'Panadol Merah (Extra)',
                'description' => 'Meredakan sakit kepala dan nyeri mengganggu.',
                'price' => 14000,
                'category' => 'Tablet',
                'image' => '/images/panadol_merah.webp'
            ],
            [
                'name' => 'Panadol Biru (Regular)',
                'description' => 'Meredakan demam dan nyeri otot.',
                'price' => 12500,
                'category' => 'Tablet',
                'image' => '/images/panadol_biru.webp'
            ],
            [
                'name' => 'Bodrex Sakit Kepala',
                'description' => 'Obat sakit kepala yang terpercaya sejak lama.',
                'price' => 5000,
                'category' => 'Tablet',
                'image' => '/images/bodrex.jpg'
            ],
            [
                'name' => 'Sanmol Tablet',
                'description' => 'Paracetamol tablet untuk penurun panas dewasa.',
                'price' => 4000,
                'category' => 'Tablet',
                'image' => '/images/sanmol_tablet.webp'
            ],
            [
                'name' => 'Promag Tablet',
                'description' => 'Ahlinya lambung, cepat atasi sakit maag.',
                'price' => 8500,
                'category' => 'Tablet',
                'image' => '/images/promag.webp'
            ],
            [
                'name' => 'Procold Flu & Batuk',
                'description' => 'Meringankan gejala flu seperti demam, sakit kepala, hidung tersumbat.',
                'price' => 6000,
                'category' => 'Tablet',
                'image' => '/images/procold.webp'
            ],
            [
                'name' => 'Diapet Kapsul',
                'description' => 'Mengatasi diare mencret dengan ekstrak daun jambu biji.',
                'price' => 7500,
                'category' => 'Tablet',
                'image' => '/images/diapet.webp'
            ],
            [
                'name' => 'Lelap Kaplet',
                'description' => 'Membantu meringankan gangguan tidur (insomnia).',
                'price' => 15000,
                'category' => 'Tablet',
                'image' => '/images/Lelap Kaplet.jpg'
            ],

            // === KATEGORI: VITAMIN & SUPLEMEN ===
            [
                'name' => 'Enervon-C Multivitamin',
                'description' => 'Jaga daya tahan tubuh biar gak gampang sakit.',
                'price' => 6500,
                'category' => 'Vitamin',
                'image' => '/images/enervon_c.webp'
            ],
            [
                'name' => 'Imboost Force',
                'description' => 'Suplemen kesehatan untuk meningkatkan kekebalan tubuh.',
                'price' => 45000,
                'category' => 'Vitamin',
                'image' => '/images/Imboost.jpg'
            ],
            [
                'name' => 'CDR (Calcium-D-Redoxon)',
                'description' => 'Kalsium untuk tulang kuat dan vitamin C.',
                'price' => 55000,
                'category' => 'Vitamin',
                'image' => '/images/cdr.jpg'
            ],
            [
                'name' => 'Redoxon Zinc',
                'description' => 'Vitamin C dosis tinggi + Zinc untuk perlindungan ganda.',
                'price' => 48000,
                'category' => 'Vitamin',
                'image' => '/images/redoxon.jpg'
            ],
            [
                'name' => 'Neurobion Forte',
                'description' => 'Vitamin neurotropik untuk kesehatan syaraf (anti kebas).',
                'price' => 32000,
                'category' => 'Vitamin',
                'image' => '/images/Neurobion.jpg'
            ],
            [
                'name' => 'Sangobion',
                'description' => 'Penambah darah untuk mengatasi anemia.',
                'price' => 18000,
                'category' => 'Vitamin',
                'image' => '/images/Sangobion.jpg'
            ],
            [
                'name' => 'Blackmores Vitamin C',
                'description' => 'Suplemen vitamin C 500mg untuk sehari-hari.',
                'price' => 120000,
                'category' => 'Vitamin',
                'image' => '/images/blackmores_c.jpg'
            ],
            [
                'name' => 'Blackmores Fish Oil',
                'description' => 'Minyak ikan omega 3 untuk kesehatan jantung.',
                'price' => 150000,
                'category' => 'Vitamin',
                'image' => '/images/blackmores_fish_oil.jpg'
            ],
            [
                'name' => 'Ester-C Holisticare',
                'description' => 'Vitamin C yang tidak perih di lambung.',
                'price' => 45000,
                'category' => 'Vitamin',
                'image' => '/images/ester_c.jpg'
            ],

            // === KATEGORI: IBU & BAYI ===
            [
                'name' => 'Minyak Telon My Baby',
                'description' => 'Menghangatkan tubuh bayi dan melindungi dari nyamuk.',
                'price' => 28000,
                'category' => 'Ibu & Bayi',
                'image' => '/images/minyak_telon_mybaby.jpg'
            ],
            [
                'name' => 'Zwitsal Baby Shampoo',
                'description' => 'Sampo bayi yang lembut dan tidak pedih di mata.',
                'price' => 25000,
                'category' => 'Ibu & Bayi',
                'image' => '/images/zwitsal_shampoo.jpg'
            ],
            [
                'name' => 'Bepanthen Salep',
                'description' => 'Salep ruam popok untuk kulit bayi sensitif.',
                'price' => 65000,
                'category' => 'Ibu & Bayi',
                'image' => '/images/bepanthen.jpg'
            ],

            // === KATEGORI: PERAWATAN LUKA & ALAT KESEHATAN ===
            [
                'name' => 'Betadine Antiseptic',
                'description' => 'Obat merah untuk mencegah infeksi pada luka.',
                'price' => 35000,
                'category' => 'P3K',
                'image' => '/images/betadine.jpg'
            ],
            [
                'name' => 'Hansaplast Kain',
                'description' => 'Plester luka kain yang elastis dan kuat.',
                'price' => 7000,
                'category' => 'P3K',
                'image' => '/images/hansaplast.jpg'
            ],
            [
                'name' => 'Salonpas Koyo',
                'description' => 'Pereda nyeri otot dan pegal linu.',
                'price' => 12000,
                'category' => 'P3K',
                'image' => '/images/salonpas.jpg'
            ],
            [
                'name' => 'Masker Sensi (Isi 5)',
                'description' => 'Masker medis 3-ply untuk perlindungan sehari-hari.',
                'price' => 15000,
                'category' => 'Alat Kesehatan',
                'image' => '/images/masker_sensi.jpg'
            ],
            [
                'name' => 'Hand Sanitizer Gel',
                'description' => 'Pembersih tangan antiseptik tanpa bilas.',
                'price' => 20000,
                'category' => 'Alat Kesehatan',
                'image' => '/images/hand_sanitizer.jpg'
            ],
            [
                'name' => 'Termometer Digital',
                'description' => 'Alat pengukur suhu tubuh akurat.',
                'price' => 35000,
                'category' => 'Alat Kesehatan',
                'image' => '/images/termometer.jpg'
            ],

            // === KATEGORI: HERBAL & LAINNYA ===
            [
                'name' => 'Tolak Angin Cair',
                'description' => 'Obat herbal terstandar untuk masuk angin.',
                'price' => 4500,
                'category' => 'Herbal',
                'image' => '/images/tolak_angin.jpg'
            ],
            [
                'name' => 'Antangin Cair',
                'description' => 'Sirup herbal pereda masuk angin.',
                'price' => 4000,
                'category' => 'Herbal',
                'image' => '/images/antangin.jpg'
            ],
            [
                'name' => 'Minyak Kayu Putih Cap Lang',
                'description' => 'Minyak hangat serbaguna.',
                'price' => 22000,
                'category' => 'Herbal',
                'image' => '/images/minyak_kayu_putih.jpg'
            ],
        ];

        foreach ($medicines as $med) {
            DB::table('medicines')->insert([
                'name' => $med['name'],
                'slug' => Str::slug($med['name']),
                'description' => $med['description'],
                'price' => $med['price'],
                'category' => $med['category'],
                'image' => $med['image'], 
                'stock' => 100,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}