import { useState } from 'react';
import Header from '../components/header';
import { 
    Search, ShoppingCart, Plus, ArrowLeft,
    Brain, Stethoscope, Heart, Pill, 
    Syringe, Baby, Apple, ChevronRight
} from 'lucide-react';

export default function Medicines() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null); 
  const [activeSubCategory, setActiveSubCategory] = useState("Semua");
  
  const [cartCount, setCartCount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const handleAddToCart = (price) => {
    setCartCount(cartCount + 1);
    const numPrice = parseInt(price.replace(/[^0-9]/g, '')); 
    setTotalPrice(totalPrice + numPrice);
  };

  const categories = [
    { name: 'Kesehatan Mental & Pikiran', icon: <Brain />, sub: ['Manajemen Stres', 'Kesehatan Tidur', 'Kesehatan Otak'] },
    { name: 'Obat & Perawatan', icon: <Stethoscope />, sub: ['Flu & Batuk', 'Demam', 'Pereda Nyeri'] },
    { name: 'Jantung', icon: <Heart />, sub: ['Darah Tinggi', 'Kolesterol'] },
    { name: 'Vitamin & Suplemen', icon: <Pill />, sub: ['Vitamin C', 'Vitamin D', 'Multivitamin'] },
    { name: 'Ibu & Anak', icon: <Baby />, sub: ['Susu Bayi', 'Popok', 'Minyak Telon'] },
    { name: 'Diet & Nutrisi', icon: <Apple />, sub: ['Susu Diet', 'Detox', 'Protein'] },
    { name: 'P3K & Alat', icon: <Syringe />, sub: ['Masker', 'Termometer', 'Perban'] },
  ];

  const allMedicines = [
    { id: 1, name: 'Sadares 25 mg 10 Tablet', price: 'Rp 21.000', category: 'Kesehatan Mental & Pikiran', sub: 'Manajemen Stres', image: '💊' },
    { id: 2, name: 'Nutriwell Magnesium 30 Kapsul', price: 'Rp 188.000', category: 'Kesehatan Mental & Pikiran', sub: 'Manajemen Stres', image: '🧂' },
    { id: 3, name: 'Blackmores Multi B 30 Tablet', price: 'Rp 154.000', category: 'Kesehatan Mental & Pikiran', sub: 'Kesehatan Otak', image: '🧠' },
    { id: 4, name: 'Nuvita Nutri Magnesium', price: 'Rp 80.000', category: 'Kesehatan Mental & Pikiran', sub: 'Kesehatan Tidur', image: '😴' },
    { id: 5, name: 'Paracetamol 500mg', price: 'Rp 5.000', category: 'Obat & Perawatan', sub: 'Demam', image: '🤒' },
    { id: 6, name: 'Panadol Merah', price: 'Rp 15.000', category: 'Obat & Perawatan', sub: 'Pereda Nyeri', image: '💊' },
  ];

  const displayedProducts = allMedicines.filter(item => {
    if (selectedCategory && item.category !== selectedCategory.name) return false;
    if (activeSubCategory !== "Semua" && item.sub !== activeSubCategory) return false;
    return item.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '80px' }}>
      <Header />

      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        
        {/* SEARCH BAR (BIRU) */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
            <div style={{ 
                flex: 1, display: 'flex', alignItems: 'center', 
                border: '1px solid #cbd5e1', borderRadius: '8px', padding: '12px 15px',
                background: 'white'
            }}>
                <Search color="#94a3b8" size={20} />
                <input 
                    type="text" 
                    placeholder="Cari obat, vitamin, atau produk..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ border: 'none', background: 'transparent', outline: 'none', marginLeft: '10px', width: '100%', fontSize: '15px' }}
                />
            </div>
            <button style={{ 
                background: '#0ea5e9', color: 'white', border: 'none', // BIRU UTAMA
                borderRadius: '8px', padding: '0 30px', fontWeight: 'bold', cursor: 'pointer' 
            }}>
                Cari
            </button>
        </div>

        {/* === TAMPILAN 1: MENU UTAMA === */}
        {!selectedCategory ? (
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', color: '#334155' }}>
                Belanja sesuai Kategori
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '20px' }}>
                {categories.map((cat, index) => (
                    <div 
                        key={index} 
                        onClick={() => { setSelectedCategory(cat); setActiveSubCategory("Semua"); }}
                        style={{ 
                            background: 'white', borderRadius: '12px', padding: '20px',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
                            cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', transition: '0.2s',
                            border: '1px solid #e2e8f0'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = '#0ea5e9'} // HOVER BIRU
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                    >
                        <div style={{ 
                            width: '50px', height: '50px', borderRadius: '50%', background: '#e0f2fe', // BIRU MUDA
                            color: '#0ea5e9', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            marginBottom: '10px'
                        }}>
                            {cat.icon}
                        </div>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>{cat.name}</span>
                    </div>
                ))}
            </div>

            {/* BANNER PROMO (BIRU) */}
            <div style={{ marginTop: '40px', background: '#e0f2fe', borderRadius: '12px', padding: '30px', textAlign: 'center' }}>
                <h2 style={{ color: '#0369a1', margin: 0 }}>💊 Promo Obat & Vitamin</h2>
                <p style={{ color: '#0284c7' }}>Diskon hingga 50% untuk pengguna baru!</p>
            </div>
          </div>
        ) : (
          
        /* === TAMPILAN 2: DETAIL KATEGORI (SIDEBAR + PRODUK) === */
          <div style={{ display: 'flex', gap: '30px', alignItems: 'start' }}>
            
            {/* SIDEBAR KIRI (BIRU STYLE) */}
            <div style={{ width: '250px', background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                <button 
                    onClick={() => setSelectedCategory(null)}
                    style={{ 
                        display: 'flex', alignItems: 'center', gap: '5px', background: 'none', border: 'none', 
                        color: '#64748b', cursor: 'pointer', marginBottom: '20px', fontWeight: 'bold' 
                    }}
                >
                    <ArrowLeft size={16} /> Kembali
                </button>

                <h4 style={{ margin: '0 0 15px 0', color: '#0ea5e9', fontSize: '16px' }}>{selectedCategory.name}</h4> {/* JUDUL BIRU */}
                
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    <li 
                        onClick={() => setActiveSubCategory("Semua")}
                        style={{ 
                            padding: '10px', cursor: 'pointer', borderRadius: '6px', fontSize: '14px',
                            // SELEKSI: BIRU MUDA
                            background: activeSubCategory === "Semua" ? '#e0f2fe' : 'transparent',
                            color: activeSubCategory === "Semua" ? '#0ea5e9' : '#475569',
                            fontWeight: activeSubCategory === "Semua" ? 'bold' : 'normal'
                        }}
                    >
                        Semua Produk
                    </li>
                    {selectedCategory.sub.map((sub, idx) => (
                        <li 
                            key={idx}
                            onClick={() => setActiveSubCategory(sub)}
                            style={{ 
                                padding: '10px', cursor: 'pointer', borderRadius: '6px', fontSize: '14px',
                                // SELEKSI: BIRU MUDA
                                background: activeSubCategory === sub ? '#e0f2fe' : 'transparent',
                                color: activeSubCategory === sub ? '#0ea5e9' : '#475569',
                                fontWeight: activeSubCategory === sub ? 'bold' : 'normal'
                            }}
                        >
                            {sub}
                        </li>
                    ))}
                </ul>
            </div>

            {/* GRID PRODUK KANAN */}
            <div style={{ flex: 1 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '15px' }}>
                    {displayedProducts.length > 0 ? displayedProducts.map((item) => (
                        <div key={item.id} style={{ 
                            background: 'white', borderRadius: '12px', padding: '15px', 
                            border: '1px solid #e2e8f0', cursor: 'pointer' 
                        }}>
                            <div style={{ height: '100px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '40px', background: '#f8fafc', borderRadius: '8px', marginBottom: '10px' }}>
                                {item.image}
                            </div>
                            <h4 style={{ fontSize: '14px', margin: '0 0 5px 0', height: '40px', overflow: 'hidden', lineHeight: '1.4' }}>{item.name}</h4>
                            <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Per Strip</p>
                            
                            <div style={{ marginTop: '10px' }}>
                                <span style={{ fontWeight: 'bold', color: '#334155', display: 'block', marginBottom: '10px' }}>{item.price}</span>
                                <button 
                                    onClick={() => handleAddToCart(item.price)}
                                    style={{ 
                                        width: '100%', padding: '8px', borderRadius: '6px', 
                                        border: '1px solid #0ea5e9', // BORDER BIRU
                                        background: 'white', 
                                        color: '#0ea5e9', // TEKS BIRU
                                        fontWeight: 'bold', cursor: 'pointer', fontSize: '13px'
                                    }}
                                    onMouseOver={(e) => { e.currentTarget.style.background = '#0ea5e9'; e.currentTarget.style.color = 'white'; }}
                                    onMouseOut={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#0ea5e9'; }}
                                >
                                    Tambah
                                </button>
                            </div>
                        </div>
                    )) : (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '50px', color: '#94a3b8' }}>
                            Produk tidak ditemukan di kategori ini.
                        </div>
                    )}
                </div>
            </div>

          </div>
        )}

      </div>

      {/* FLOATING CART BAR (TOMBOLNYA JADI BIRU JUGA) */}
      {cartCount > 0 && (
        <div style={{ 
            position: 'fixed', bottom: 0, left: 0, right: 0, 
            background: '#1e293b', padding: '15px 40px', 
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            boxShadow: '0 -4px 20px rgba(0,0,0,0.1)', color: 'white', zIndex: 100
        }}>
            <div>
                <span style={{ fontSize: '12px', opacity: 0.8 }}>Perkiraan Harga</span>
                <div style={{ fontSize: '18px', fontWeight: 'bold' }}>Rp {totalPrice.toLocaleString('id-ID')}</div>
                <div style={{ fontSize: '12px', color: '#fbbf24' }}>{cartCount} Item dalam keranjang</div>
            </div>
            
            <button style={{ 
                background: '#0ea5e9', // TOMBOL KERANJANG BIRU
                color: 'white', border: 'none', padding: '12px 30px', 
                borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', gap: '10px', alignItems: 'center'
            }}>
                <ShoppingCart size={18} /> Lihat Keranjang
            </button>
        </div>
      )}

    </div>
  );
}