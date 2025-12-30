import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/header';
import Footer from '../components/Footer';
import { 
    Search, ShoppingCart, ArrowLeft,
    Pill, Droplets, Baby, Cross, 
    Thermometer, Leaf, Activity, Loader2
} from 'lucide-react';

export default function Medicines() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null); 
  const [activeSubCategory, setActiveSubCategory] = useState("Semua");
  
  // STATE DATA
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  // STATE CART (Update Terbaru Disini)
  const [cartStats, setCartStats] = useState({ totalItem: 0, totalPrice: 0 });

  // 1. FETCH DATA OBAT & KERANJANG
  useEffect(() => {
    fetchMedicines();
    fetchCartData(); // <-- Ambil data keranjang pas loading awal
  }, []);

  const fetchMedicines = async () => {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/medicines');
        if (!response.ok) throw new Error('Gagal ambil data');
        const data = await response.json();
        setMedicines(data); 
    } catch (err) {
        console.error("Error:", err);
    } finally {
        setLoading(false);
    }
  };

  // FUNGSI HITUNG TOTAL KERANJANG (BARU) 💰
  const fetchCartData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return; // Kalau belum login, gak usah hitung

      try {
          const response = await fetch('http://127.0.0.1:8000/api/carts', {
              headers: { 'Authorization': `Bearer ${token}` }
          });
          if (response.ok) {
              const data = await response.json();
              
              // Hitung Total Item & Total Harga
              const totalItem = data.reduce((acc, item) => acc + item.quantity, 0);
              const totalPrice = data.reduce((acc, item) => acc + (item.price * item.quantity), 0);
              
              setCartStats({ totalItem, totalPrice });
          }
      } catch (err) {
          console.error("Gagal hitung keranjang:", err);
      }
  };

  // 2. FUNGSI ADD TO CART
  const handleAddToCart = async (medicineId) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
        alert("Silakan login terlebih dahulu untuk belanja!");
        navigate('/login');
        return;
    }

    try {
        const response = await fetch('http://127.0.0.1:8000/api/carts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ medicine_id: medicineId })
        });

        if (response.ok) {
            // alert("Berhasil masuk keranjang! 🛒"); // <-- Alert dimatiin aja biar gak ganggu (optional)
            fetchCartData(); // <-- UPDATE ANGKA DUIT LANGSUNG!
        } else {
            alert("Gagal menambahkan ke keranjang.");
        }

    } catch (error) {
        console.error("Error add to cart:", error);
    }
  };

  // KATEGORI (Sama kayak sebelumnya)
  const categories = [
    { name: 'Obat Cair', icon: <Droplets />, sub: ['Batuk', 'Flu', 'Demam', 'Maag'] },
    { name: 'Tablet', icon: <Pill />, sub: ['Sakit Kepala', 'Nyeri', 'Diare', 'Tidur'] },
    { name: 'Vitamin', icon: <Activity />, sub: ['Daya Tahan', 'Tulang', 'Darah', 'Zinc'] },
    { name: 'Ibu & Bayi', icon: <Baby />, sub: ['Minyak Telon', 'Shampoo', 'Ruam'] },
    { name: 'P3K', icon: <Cross />, sub: ['Luka', 'Plester', 'Koyo'] },
    { name: 'Alat Kesehatan', icon: <Thermometer />, sub: ['Masker', 'Sanitizer', 'Suhu'] },
    { name: 'Herbal', icon: <Leaf />, sub: ['Masuk Angin', 'Minyak Kayu Putih'] },
  ];

  // FILTER LOGIC
  const displayedProducts = medicines.filter(item => {
    if (selectedCategory && item.category !== selectedCategory.name) return false;
    if (activeSubCategory !== "Semua") {
        const keyword = activeSubCategory.toLowerCase();
        const itemName = item.name.toLowerCase();
        const itemDesc = item.description.toLowerCase();
        if (!itemName.includes(keyword) && !itemDesc.includes(keyword)) return false;
    }
    return item.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f8fafc', fontFamily: '"Inter", sans-serif' }}>
      
      {/* HEADER FIXED */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 999, background: 'white', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <Header />
      </div>

      <div className="container" style={{ flex: 1, maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '30px 20px', paddingTop: '100px', paddingBottom: '80px' }}>
        
        {/* SEARCH BAR */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '12px 15px', background: 'white' }}>
                <Search color="#94a3b8" size={20} />
                <input type="text" placeholder="Cari obat, vitamin, atau produk..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ border: 'none', background: 'transparent', outline: 'none', marginLeft: '10px', width: '100%', fontSize: '15px' }} />
            </div>
            <button style={{ background: '#0ea5e9', color: 'white', border: 'none', borderRadius: '8px', padding: '0 30px', fontWeight: 'bold', cursor: 'pointer' }}>Cari</button>
        </div>

        {/* LOADING & CONTENT */}
        {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '50px', color: '#0ea5e9' }}><Loader2 className="animate-spin" size={40} /></div>
        ) : !selectedCategory ? (
          
          /* === MENU UTAMA === */
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', color: '#334155' }}>Belanja sesuai Kategori</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '20px' }}>
                {categories.map((cat, index) => (
                    <div key={index} onClick={() => { setSelectedCategory(cat); setActiveSubCategory("Semua"); }} style={{ background: 'white', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', transition: '0.2s', border: '1px solid #e2e8f0' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = '#0ea5e9'} onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}>
                        <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#e0f2fe', color: '#0ea5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>{cat.icon}</div>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>{cat.name}</span>
                    </div>
                ))}
            </div>
          </div>
        ) : (
          
        /* === DETAIL KATEGORI === */
          <div style={{ display: 'flex', gap: '30px', alignItems: 'start', flexDirection: 'column' }}>
             <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <button onClick={() => setSelectedCategory(null)} style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontWeight: 'bold', padding: 0 }}><ArrowLeft size={18} /> Kembali</button>
                 <h3 style={{ margin: 0, color: '#0ea5e9' }}>{selectedCategory.name}</h3>
             </div>

             <div style={{ display: 'flex', gap: '30px', width: '100%', alignItems: 'start' }}>
                <div className="hidden-mobile" style={{ width: '200px', flexShrink: 0, background: 'white', borderRadius: '12px', padding: '15px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                    <p style={{ fontWeight: 'bold', fontSize: '13px', color: '#94a3b8', marginBottom: '10px' }}>FILTER</p>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        <li onClick={() => setActiveSubCategory("Semua")} style={{ padding: '10px', cursor: 'pointer', borderRadius: '6px', fontSize: '14px', marginBottom: '5px', background: activeSubCategory === "Semua" ? '#0ea5e9' : 'transparent', color: activeSubCategory === "Semua" ? 'white' : '#475569', fontWeight: activeSubCategory === "Semua" ? 'bold' : 'normal', transition: '0.2s' }}>Semua</li>
                        {selectedCategory.sub.map((sub, idx) => (
                            <li key={idx} onClick={() => setActiveSubCategory(sub)} style={{ padding: '10px', cursor: 'pointer', borderRadius: '6px', fontSize: '14px', marginBottom: '5px', background: activeSubCategory === sub ? '#0ea5e9' : 'transparent', color: activeSubCategory === sub ? 'white' : '#475569', fontWeight: activeSubCategory === sub ? 'bold' : 'normal', transition: '0.2s' }}>{sub}</li>
                        ))}
                    </ul>
                </div>

                <div style={{ flex: 1 }}>
                    {displayedProducts.length > 0 ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                            {displayedProducts.map((item) => (
                                <div key={item.id} style={{ background: 'white', borderRadius: '12px', padding: '15px', border: '1px solid #e2e8f0', cursor: 'pointer', transition: '0.2s', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                    <div style={{ height: '140px', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#fff', borderRadius: '8px', marginBottom: '15px', overflow: 'hidden' }}>
                                        <img src={item.image.startsWith('http') ? item.image : `http://127.0.0.1:8000${item.image}`} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={(e) => { e.target.src = "https://placehold.co/150x150?text=No+Image" }} />
                                    </div>
                                    <div>
                                        <h4 style={{ fontSize: '15px', margin: '0 0 5px 0', height: '40px', overflow: 'hidden', lineHeight: '1.4', color: '#334155' }}>{item.name}</h4>
                                        <span style={{ fontWeight: 'bold', color: '#0f172a', display: 'block', marginBottom: '10px', fontSize: '16px' }}>Rp {item.price.toLocaleString('id-ID')}</span>
                                        
                                        <button 
                                            onClick={() => handleAddToCart(item.id)}
                                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #0ea5e9', background: 'white', color: '#0ea5e9', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px', transition: '0.2s' }}
                                            onMouseOver={(e) => { e.currentTarget.style.background = '#0ea5e9'; e.currentTarget.style.color = 'white'; }}
                                            onMouseOut={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#0ea5e9'; }}
                                        >
                                            + Keranjang
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '50px', background: 'white', borderRadius: '12px', border: '1px dashed #cbd5e1' }}><p style={{color: '#64748b', fontSize: '16px'}}>Produk tidak ditemukan.</p></div>
                    )}
                </div>
             </div>
          </div>
        )}
      </div>

      {/* === FLOATING CART BAR (YANG INI UDAH PINTAR) === */}
      {/* Hanya muncul kalau ada barang di keranjang */}
      {cartStats.totalItem > 0 && (
          <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#1e293b', padding: '15px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 -4px 20px rgba(0,0,0,0.1)', color: 'white', zIndex: 100 }}>
                <div>
                    <span style={{ fontSize: '12px', opacity: 0.8, display: 'block' }}>Total Belanja ({cartStats.totalItem} Barang)</span>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#fbbf24', marginTop: '2px' }}>
                        Rp {cartStats.totalPrice.toLocaleString('id-ID')}
                    </div>
                </div>
                <button 
                    onClick={() => navigate('/cart')} 
                    style={{ background: '#0ea5e9', color: 'white', border: 'none', padding: '12px 30px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', gap: '10px', alignItems: 'center' }}
                >
                    <ShoppingCart size={18} /> Lihat Keranjang
                </button>
          </div>
      )}

      <Footer />
    </div>
  );
}