import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/header';
import Footer from '../components/Footer';
import { 
    Search, ShoppingCart, ArrowLeft,
    Pill, Droplets, Baby, Cross, 
    Thermometer, Leaf, Activity, Loader2, Filter
} from 'lucide-react';

export default function Medicines() {
  const navigate = useNavigate();
  
  // --- STATE ---
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null); 
  const [activeSubCategory, setActiveSubCategory] = useState("Semua");
  
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartStats, setCartStats] = useState({ totalItem: 0, totalPrice: 0 });

  // --- EFFECT ---
  useEffect(() => {
    fetchMedicines();
    fetchCartData();
  }, []);

  // --- 1. FETCH OBAT ---
  const fetchMedicines = async () => {
    try {
        setLoading(true);
        const response = await fetch('http://127.0.0.1:8000/api/medicines');
        const result = await response.json();
        const finalData = Array.isArray(result) ? result : (result.data || []);
        setMedicines(finalData); 
    } catch (err) {
        console.error("Error ambil obat:", err);
    } finally {
        setLoading(false);
    }
  };

  // --- 2. FETCH KERANJANG ---
  const fetchCartData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
          const response = await fetch('http://127.0.0.1:8000/api/carts', {
              headers: { 'Authorization': `Bearer ${token}` }
          });
          if (response.ok) {
              const result = await response.json();
              const cartData = Array.isArray(result) ? result : (result.data || []);
              const totalItem = cartData.reduce((acc, item) => acc + (item.quantity || 0), 0);
              const totalPrice = cartData.reduce((acc, item) => acc + ((item.price || 0) * (item.quantity || 0)), 0);
              setCartStats({ totalItem, totalPrice });
          }
      } catch (err) { console.error(err); }
  };

  // --- 3. ADD TO CART ---
  const handleAddToCart = async (medicineId) => {
    const token = localStorage.getItem('token');
    if (!token) {
        alert("Silakan login terlebih dahulu!");
        navigate('/login');
        return;
    }
    try {
        const response = await fetch('http://127.0.0.1:8000/api/carts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ medicine_id: medicineId })
        });
        if (response.ok) fetchCartData(); 
        else alert("Gagal menambahkan ke keranjang.");
    } catch (error) { console.error(error); }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://placehold.co/150x150?text=No+Image";
    if (imagePath.startsWith('http')) return imagePath;
    return `http://127.0.0.1:8000/${imagePath.replace(/^\//, '')}`;
  };

  const categories = [
    { name: 'Obat Cair', icon: <Droplets />, sub: ['Batuk', 'Flu', 'Demam', 'Maag'] },
    { name: 'Tablet', icon: <Pill />, sub: ['Sakit Kepala', 'Nyeri', 'Diare', 'Tidur'] },
    { name: 'Vitamin', icon: <Activity />, sub: ['Daya Tahan', 'Tulang', 'Darah', 'Zinc'] },
    { name: 'Ibu & Bayi', icon: <Baby />, sub: ['Minyak Telon', 'Shampoo', 'Ruam'] },
    { name: 'P3K', icon: <Cross />, sub: ['Luka', 'Plester', 'Koyo'] },
    { name: 'Alat Kesehatan', icon: <Thermometer />, sub: ['Masker', 'Sanitizer', 'Suhu'] },
    { name: 'Herbal', icon: <Leaf />, sub: ['Masuk Angin', 'Minyak Kayu Putih'] },
  ];

  // --- 4. FILTERING LOGIC ---
  const displayedProducts = medicines.filter(item => {
    const name = (item.name || item.nama_obat || "").toLowerCase();
    const type = (item.type || "").toLowerCase();
    const category = (item.category || "").toLowerCase();
    const description = (item.description || "").toLowerCase();
    const search = searchTerm.toLowerCase();

    // A. Filter Search (PRIORITAS UTAMA)
    // Kalau ada search, harus cocok namanya.
    if (search && !name.includes(search)) return false;

    // B. Filter Kategori (Kalau User Klik Kategori)
    if (selectedCategory) {
        const catName = selectedCategory.name.toLowerCase();
        if (!category.includes(catName) && !type.includes(catName)) return false; 

        // C. Filter Sub-Kategori
        if (activeSubCategory !== "Semua") {
            const sub = activeSubCategory.toLowerCase();
            if (!name.includes(sub) && !description.includes(sub)) return false;
        }
    }

    return true;
  });

  // --- 🔥 LOGIKA TAMPILAN BARU ---
  // Tampilkan List Produk JIKA: (Ada Kategori yg dipilih) ATAU (Ada kata kunci pencarian)
  const showProductList = selectedCategory || searchTerm.length > 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f8fafc', fontFamily: '"Inter", sans-serif' }}>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 999, background: 'white', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <Header />
      </div>

      <div className="container" style={{ flex: 1, maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '30px 20px', paddingTop: '100px', paddingBottom: '80px' }}>
        
        {/* SEARCH BAR (GLOBAL) */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '12px 15px', background: 'white' }}>
                <Search color="#94a3b8" size={20} />
                <input 
                    type="text" 
                    placeholder="Cari obat, vitamin, atau produk..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    style={{ border: 'none', background: 'transparent', outline: 'none', marginLeft: '10px', width: '100%', fontSize: '15px' }} 
                />
            </div>
            <button style={{ background: '#0ea5e9', color: 'white', border: 'none', borderRadius: '8px', padding: '0 30px', fontWeight: 'bold', cursor: 'pointer' }}>Cari</button>
        </div>

        {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '50px', color: '#0ea5e9' }}><Loader2 className="animate-spin" size={40} /></div>
        ) : !showProductList ? ( // 🔥 UBAH LOGIKA DISINI
          
          /* === TAMPILAN MENU KATEGORI (Hanya jika TIDAK cari & TIDAK pilih kategori) === */
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', color: '#334155' }}>Belanja sesuai Kategori</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '20px' }}>
                {categories.map((cat, index) => (
                    <div key={index} 
                         onClick={() => { setSelectedCategory(cat); setActiveSubCategory("Semua"); setSearchTerm(""); }} 
                         style={{ background: 'white', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', transition: '0.2s', border: '1px solid #e2e8f0' }} 
                         onMouseEnter={(e) => e.currentTarget.style.borderColor = '#0ea5e9'} 
                         onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                    >
                        <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#e0f2fe', color: '#0ea5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>{cat.icon}</div>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>{cat.name}</span>
                    </div>
                ))}
            </div>
            
            <div style={{ marginTop: '40px', padding: '30px', background: 'linear-gradient(to right, #0ea5e9, #38bdf8)', borderRadius: '16px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Diskon Spesial Hari Ini!</h2>
                    <p style={{ margin: '5px 0 0', opacity: 0.9 }}>Dapatkan potongan harga untuk vitamin & suplemen.</p>
                </div>
                <div style={{ background: 'white', color: '#0ea5e9', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '18px' }}>%</div>
            </div>
          </div>

        ) : (
          
          /* === TAMPILAN LIST PRODUK (Hasil Cari ATAU Kategori) === */
          <div style={{ display: 'flex', gap: '30px', alignItems: 'start', flexDirection: 'column' }}>
             
             {/* Header Navigasi */}
             <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <button onClick={() => { setSelectedCategory(null); setSearchTerm(""); }} style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontWeight: 'bold', padding: 0 }}>
                    <ArrowLeft size={18} /> Kembali
                 </button>
                 {selectedCategory ? (
                    <h3 style={{ margin: 0, color: '#0ea5e9', display:'flex', alignItems:'center', gap:'10px' }}>
                        {selectedCategory.icon} {selectedCategory.name}
                    </h3>
                 ) : (
                    <h3 style={{ margin: 0, color: '#0ea5e9' }}>Hasil Pencarian: "{searchTerm}"</h3>
                 )}
             </div>

             <div style={{ display: 'flex', gap: '30px', width: '100%', alignItems: 'start', flexWrap: 'wrap' }}>
                
                {/* SIDEBAR FILTER (Hanya Muncul kalau pilih kategori) */}
                {selectedCategory && (
                    <div style={{ width: '200px', flexShrink: 0, background: 'white', borderRadius: '12px', padding: '15px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'15px', color:'#94a3b8' }}>
                            <Filter size={16}/> 
                            <span style={{ fontWeight: 'bold', fontSize: '13px' }}>FILTER</span>
                        </div>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            <li onClick={() => setActiveSubCategory("Semua")} style={{ padding: '10px', cursor: 'pointer', borderRadius: '6px', fontSize: '14px', marginBottom: '5px', background: activeSubCategory === "Semua" ? '#0ea5e9' : 'transparent', color: activeSubCategory === "Semua" ? 'white' : '#475569', fontWeight: activeSubCategory === "Semua" ? 'bold' : 'normal', transition: '0.2s' }}>Semua</li>
                            {selectedCategory.sub.map((sub, idx) => (
                                <li key={idx} onClick={() => setActiveSubCategory(sub)} style={{ padding: '10px', cursor: 'pointer', borderRadius: '6px', fontSize: '14px', marginBottom: '5px', background: activeSubCategory === sub ? '#0ea5e9' : 'transparent', color: activeSubCategory === sub ? 'white' : '#475569', fontWeight: activeSubCategory === sub ? 'bold' : 'normal', transition: '0.2s' }}>{sub}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* PRODUCT GRID */}
                <div style={{ flex: 1, minWidth: '300px' }}>
                    {displayedProducts.length > 0 ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                            {displayedProducts.map((item) => (
                                <div key={item.id} style={{ background: 'white', borderRadius: '12px', padding: '15px', border: '1px solid #e2e8f0', cursor: 'pointer', transition: '0.2s', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }} className="hover-card">
                                    <div style={{ height: '140px', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f8fafc', borderRadius: '8px', marginBottom: '15px', overflow: 'hidden' }}>
                                        <img 
                                            src={getImageUrl(item.image)} 
                                            alt={item.name} 
                                            style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                                            onError={(e) => { e.target.src = "https://placehold.co/150x150?text=No+Image" }} 
                                        />
                                    </div>
                                    <div>
                                        <h4 style={{ fontSize: '15px', margin: '0 0 5px 0', height: '40px', overflow: 'hidden', lineHeight: '1.4', color: '#334155', fontWeight: 'bold' }}>{item.name || item.nama_obat}</h4>
                                        <span style={{ fontWeight: 'bold', color: '#0ea5e9', display: 'block', marginBottom: '10px', fontSize: '16px' }}>Rp {(item.price || 0).toLocaleString('id-ID')}</span>
                                        <button onClick={(e) => { e.stopPropagation(); handleAddToCart(item.id); }} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: 'none', background: '#0ea5e9', color: 'white', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px', display:'flex', alignItems:'center', justifyContent:'center', gap:'5px' }}>
                                            <ShoppingCart size={16}/> + Keranjang
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '50px', background: 'white', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                            <Search size={48} color="#94a3b8" style={{ margin: '0 auto 15px' }} />
                            <p style={{color: '#64748b', fontSize: '16px'}}>Produk "{searchTerm}" tidak ditemukan.</p>
                            <button onClick={() => setSearchTerm("")} style={{marginTop:'10px', color:'#0ea5e9', background:'none', border:'none', cursor:'pointer', fontWeight:'bold'}}>Reset Pencarian</button>
                        </div>
                    )}
                </div>
             </div>
          </div>
        )}
      </div>

      {/* FOOTER KERANJANG */}
      {cartStats.totalItem > 0 && (
          <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#1e293b', padding: '15px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 -4px 20px rgba(0,0,0,0.1)', color: 'white', zIndex: 100 }}>
                <div>
                    <span style={{ fontSize: '12px', opacity: 0.8, display: 'block' }}>Total Belanja ({cartStats.totalItem} Barang)</span>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#fbbf24', marginTop: '2px' }}>Rp {cartStats.totalPrice.toLocaleString('id-ID')}</div>
                </div>
                <button onClick={() => navigate('/cart')} style={{ background: '#0ea5e9', color: 'white', border: 'none', padding: '12px 30px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <ShoppingCart size={18} /> Lihat Keranjang
                </button>
          </div>
      )}
      <Footer />
    </div>
  );
}