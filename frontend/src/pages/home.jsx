import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/header';
import Footer from '../components/Footer';

// IMPORT ASSETS
import foto1 from "../assets/foto3.png"; 
import foto2 from "../assets/foto2.png"; 
import foto3 from "../assets/foto4.png"; 

// IMPORT ICONS
import chatIcon from "../assets/icons/chat.png";
import tokoIcon from "../assets/icons/toko.png";
import homecareIcon from "../assets/icons/homecare.png";
import asuransiIcon from "../assets/icons/asuransi.png";
import skinIcon from "../assets/icons/haloskin.png";
import fitIcon from "../assets/icons/halofit.png";

// ICONS LIB
import { Loader2, User, Calendar } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
   
  // STATE DATA
  const [medicines, setMedicines] = useState([]); 
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  // STATE FILTER TAB
  const [activeTab, setActiveTab] = useState('Semua');

  const banners = [foto1, foto2, foto3];

  // 1. FETCH DATA DARI API (SINKRON DENGAN BACKEND BARU)
  useEffect(() => {
    const fetchData = async () => {
        try {
            // A. AMBIL OBAT
            const resMed = await fetch('http://127.0.0.1:8000/api/medicines');
            const dataMed = await resMed.json();
            
            // 🔥 Sinkronisasi: Ambil dari dataMed.data
            let finalMed = dataMed.data ? dataMed.data : (Array.isArray(dataMed) ? dataMed : []);
            
            // Acak posisi array (Randomizer)
            finalMed = [...finalMed].sort(() => 0.5 - Math.random());
            setMedicines(finalMed); 

            // B. AMBIL ARTIKEL
            const resArt = await fetch('http://127.0.0.1:8000/api/articles');
            const dataArt = await resArt.json();
            
            // 🔥 Sinkronisasi: Ambil dari dataArt.data
            const finalArt = dataArt.data ? dataArt.data : (Array.isArray(dataArt) ? dataArt : []);
            setArticles(finalArt.slice(0, 4));  

        } catch (error) {
            console.error("Gagal koneksi ke server:", error);
        } finally {
            setLoading(false);
        }
    };

    fetchData();
  }, []);

  // 2. LOGIKA FILTERING OBAT
  const getFilteredMedicines = () => {
    if (activeTab === 'Semua') {
        return medicines.slice(0, 4);
    }

    const keywords = {
        'Obat Cair': ['cair', 'sirup', 'syrup', 'botol', 'liquid', 'suspensi'],
        'Tablet': ['tablet', 'kapsul', 'pill', 'kaplet', 'salut'],
        'Vitamin': ['vitamin', 'suplemen', 'vit', 'minerals'],
        'Ibu & Bayi': ['ibu', 'bayi', 'anak', 'baby', 'kids', 'hamil'],
        'Herbal': ['herbal', 'jamu', 'alami', 'tradisional'],
        'P3K': ['p3k', 'perban', 'kasa', 'antiseptik', 'plester'],
        'Alat Kesehatan': ['alat', 'masker', 'termometer', 'oksigen']
    };

    const searchTerms = keywords[activeTab] || [activeTab.toLowerCase()];

    const filtered = medicines.filter(item => {
        const itemText = [
            item.name, 
            item.type, 
            item.category, 
            item.description
        ].join(' ').toLowerCase();

        return searchTerms.some(term => itemText.includes(term));
    });

    return filtered.slice(0, 4); 
  };

  // 3. FUNGSI HELPER GAMBAR (Sesuai perbaikan Admin sebelumnya)
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://placehold.co/150x150?text=No+Image";
    if (imagePath.startsWith('http')) return imagePath;
    return `http://127.0.0.1:8000/${imagePath.replace(/^\//, '')}`;
  };

  // 4. ADD TO CART
  const handleAddToCart = async (medicineId) => {
    const token = localStorage.getItem('token');
    if (!token) {
        alert("Silakan login dulu untuk belanja!");
        navigate('/login');
        return;
    }
    try {
        const response = await fetch('http://127.0.0.1:8000/api/carts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ medicine_id: medicineId })
        });
        if (response.ok) {
            alert("Berhasil masuk keranjang! 🛒");
        } else {
            alert("Gagal menambahkan ke keranjang.");
        }
    } catch (error) { console.error(error); }
  };

  // SLIDER BANNER
  useEffect(() => {
    const bannerInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 4000); 
    return () => clearInterval(bannerInterval);
  }, [banners.length]);

  // MENU STATIC
  const services = [
    { icon: chatIcon, title: "Chat dengan Dokter", subtitle: "Tanya dokter spesialis", link: "/doctors" },
    { icon: tokoIcon, title: "Toko Kesehatan", subtitle: "Cek obat & vitamin", link: "/medicines" },
    { icon: homecareIcon, title: "Homecare", subtitle: "Medis ke rumah", link: "#" },
    { icon: asuransiIcon, title: "Asuransi", subtitle: "Hubungkan asuransi", link: "#" },
    { icon: skinIcon, title: "HaloSkin", subtitle: "Solusi kulit sehat", link: "#" },
    { icon: fitIcon, title: "HaloFit", subtitle: "Olahraga & diet", link: "#" },
  ];

  const medicineTabs = ['Semua', 'Obat Cair', 'Tablet', 'Vitamin', 'Ibu & Bayi', 'P3K', 'Alat Kesehatan', 'Herbal'];

  const specialistCategories = [
    { name: "Sp. Mata", icon: "eye" }, { name: "Sp. Kulit", icon: "sparkles" },
    { name: "Sp. Kandungan", icon: "heart-handshake" }, { name: "Sp. THT", icon: "ear" },
    { name: "Sp. Anak", icon: "baby" }, { name: "Sp. Penyakit Dalam", icon: "activity" }
  ];

  const cekSehatTools = [
    { name: "Cek Stres", icon: "brain-circuit" }, { name: "Kalkulator BMI", icon: "calculator" },
    { name: "Risiko Jantung", icon: "heart-pulse" }, { name: "Risiko Diabetes", icon: "droplet" },
    { name: "Tes Depresi", icon: "frown" }, { name: "Kalender Haid", icon: "calendar-heart" },
    { name: "Pengingat Obat", icon: "pill" }, { name: "Kalender Hamil", icon: "baby" }
  ];

  const testimonials = [
    { text: "Sangat membantu.. malam2 butuh obat, gak perlu keluar rumah!", name: "Sainem W.", role: "Ibu Rumah Tangga" },
    { text: "Sangat Helpful!! Terima kasih yaa, resep obatnya manjur sekali.", name: "Lintang A.", role: "Karyawan" },
    { text: "Menggunakan HaloHealth untuk panggilan Home Service. Sangat memuaskan.", name: "Akhbar F.", role: "Mahasiswa" },
  ];

  const mainBlue = '#0ea5e9'; 
  const sectionTitle = { fontSize: '20px', fontWeight: 'bold', color: '#1e293b', marginBottom: '20px' };

  return (
    <div style={{ background: '#fff', minHeight: '100vh', fontFamily: '"Inter", sans-serif', color: '#333', display: 'flex', flexDirection: 'column' }}>
      
      <style>{`
        .article-card:hover .article-title { color: #0ea5e9 !important; transition: color 0.3s; }
        .article-card:hover img { transform: scale(1.05); transition: transform 0.3s; }
        .interactive-card { transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); cursor: pointer; }
        .interactive-card:hover { transform: translateY(-5px); box-shadow: 0 10px 25px -5px rgba(14, 165, 233, 0.15); border-color: #0ea5e9 !important; }
        .tab-btn { transition: all 0.2s; }
        .tab-btn:hover { background-color: #f1f5f9; }
        .tab-btn.active { background-color: #0ea5e9; color: white; border-color: #0ea5e9; }
      `}</style>

      <div style={{ position: 'sticky', top: 0, zIndex: 100, background: 'white', borderBottom:'1px solid #f1f5f9' }}>
        <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
            <Header />
        </div>
      </div>

      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '30px 20px', flex: 1, width: '100%' }}>

        {/* 1. BANNER */}
        <section style={{ marginBottom: '40px' }}>
            <div style={{ borderRadius: '16px', overflow: 'hidden', height: '300px', position: 'relative', boxShadow: '0 4px 15px rgba(14, 165, 233, 0.1)' }}>
                <div style={{ display: 'flex', transition: 'transform 0.5s ease-in-out', height: '100%', transform: `translateX(-${currentSlide * 100}%)` }}>
                    {banners.map((img, idx) => (
                        <img key={idx} src={img} style={{ minWidth: '100%', height: '100%', objectFit: 'cover' }} alt="banner" />
                    ))}
                </div>
            </div>
        </section>

        {/* 2. SOLUSI KESEHATAN */}
        <section style={{ marginBottom: '50px' }}>
            <h3 style={sectionTitle}>Solusi Kesehatan</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                {services.map((item, i) => (
                    <div key={i} onClick={() => item.link !== '#' && navigate(item.link)} 
                          className="interactive-card"
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', borderRadius: '12px', background: 'white', border: '1px solid #e2e8f0' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                             <img src={item.icon} style={{ width: '45px' }} alt="service" />
                             <div>
                                 <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 'bold' }}>{item.title}</h4>
                                 <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>{item.subtitle}</p>
                             </div>
                        </div>
                        <span style={{ color: mainBlue, fontWeight: 'bold', fontSize: '18px' }}>›</span>
                    </div>
                ))}
            </div>
        </section>

        {/* 3. DIAWASI MEDICAL */}
        <section style={{ marginBottom: '50px' }}>
             <div style={{ background: '#f0f9ff', borderRadius: '16px', padding: '40px', borderLeft: `6px solid ${mainBlue}`, display: 'flex', alignItems: 'center', gap: '25px' }}>
                <div style={{ fontSize: '45px' }}>🛡️</div>
                <div>
                    <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#0369a1', margin: 0 }}>Diawasi Board of Medical Excellence</h3>
                    <p style={{ margin: '5px 0 0', fontSize: '14px', color: '#334155' }}>Standar medis internasional untuk keamanan dan kenyamanan Anda.</p>
                </div>
            </div>
        </section>

        {/* 4. SPESIALIS */}
        <section style={{ marginBottom: '50px' }}>
            <h3 style={sectionTitle}>Spesialis Tepercaya</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                {specialistCategories.map((cat, i) => (
                    <div key={i} className="interactive-card" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', borderRadius: '12px', background:'white', border:'1px solid #e2e8f0' }}>
                        <img src={`https://unpkg.com/lucide-static@latest/icons/${cat.icon}.svg`} style={{ width: '24px', color: mainBlue }} alt="icon" />
                        <span style={{ fontSize: '14px', fontWeight: '600' }}>{cat.name}</span>
                    </div>
                ))}
            </div>
        </section>

        {/* 5. OBAT & SUPLEMEN */}
        <section style={{ marginBottom: '60px' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                 <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#1e293b' }}>Obat & Suplemen</h3>
                 <span onClick={() => navigate('/medicines')} style={{ color: mainBlue, fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}>Lihat Semua</span>
             </div>
             
             <div style={{ display: 'flex', gap: '10px', marginBottom: '25px', overflowX: 'auto', paddingBottom: '5px' }}>
                {medicineTabs.map((tab, i) => (
                    <button key={i} 
                        onClick={() => setActiveTab(tab)} 
                        className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                        style={{ padding: '8px 20px', borderRadius:'20px', fontSize:'13px', border: '1px solid #eee', fontWeight:'600', cursor:'pointer', whiteSpace: 'nowrap', color: '#555' }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '30px' }}><Loader2 className="animate-spin" /></div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
                    {getFilteredMedicines().length > 0 ? (
                        getFilteredMedicines().map((prod) => (
                            <div key={prod.id} className="interactive-card" style={{ borderRadius: '12px', padding: '15px', background:'white', border:'1px solid #e2e8f0', display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
                                <div style={{ height: '120px', display:'flex', justifyContent:'center', marginBottom:'10px', overflow:'hidden' }}>
                                    <img 
                                        src={getImageUrl(prod.image)} 
                                        style={{ height: '100%', objectFit: 'contain' }} 
                                        alt={prod.name}
                                        onError={(e) => e.target.src = "https://placehold.co/150x150?text=No+Image"}
                                    />
                                </div>
                                <div>
                                    <h4 style={{ margin: '0 0 5px', fontSize: '14px', fontWeight: 'bold', height:'40px', overflow:'hidden', lineHeight:'1.4' }}>{prod.name}</h4>
                                    <p style={{ color: mainBlue, fontWeight: 'bold', fontSize: '14px' }}>Rp {prod.price?.toLocaleString('id-ID')}</p>
                                    <button 
                                        onClick={() => handleAddToCart(prod.id)}
                                        style={{ width: '100%', marginTop:'10px', padding: '8px', background: 'white', border: `1px solid ${mainBlue}`, color: mainBlue, borderRadius: '8px', fontSize:'12px', fontWeight:'bold', cursor:'pointer' }}
                                    >
                                        + Keranjang
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', background: '#f8fafc', borderRadius: '12px', color: '#94a3b8' }}>
                            <p>Tidak ada produk kategori <strong>"{activeTab}"</strong></p>
                            <button onClick={() => setActiveTab('Semua')} style={{marginTop:'10px', color: mainBlue, cursor:'pointer', border:'none', background:'none', textDecoration:'underline'}}>Tampilkan Semua</button>
                        </div>
                    )}
                </div>
            )}
        </section>

        {/* 6. ARTIKEL KESEHATAN */}
        <section style={{ marginBottom: '60px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#1e293b' }}>Artikel Kesehatan</h3>
                <span onClick={() => navigate('/articles')} style={{ color: mainBlue, fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}>Lihat Semua</span>
            </div>
            
            {loading ? (
                 <div style={{ textAlign: 'center', padding: '30px' }}><Loader2 className="animate-spin" /></div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '25px' }}>
                    {articles.map((art) => (
                        <div key={art.id} onClick={() => navigate('/articles')} className="article-card interactive-card" style={{ display: 'flex', gap: '20px', borderRadius:'12px', padding:'0', overflow:'hidden', border:'none', cursor:'pointer', background: 'white' }}>
                            <img 
                                src={getImageUrl(art.thumbnail || art.image)} 
                                style={{ width: '120px', height: '120px', borderRadius: '12px', objectFit: 'cover', flexShrink: 0 }} 
                                alt="article"
                                onError={(e) => e.target.src = "https://placehold.co/150x150?text=Artikel"}
                            />
                            <div style={{ padding:'5px 0', flex: 1 }}>
                                <div style={{ marginBottom: '5px' }}>
                                    <span style={{ fontSize: '10px', background: '#e0f2fe', color: mainBlue, padding: '3px 8px', borderRadius: '4px', fontWeight:'bold', textTransform: 'uppercase' }}>
                                        {art.category || 'Umum'}
                                    </span>
                                </div>
                                <h4 className="article-title" style={{ margin: '0 0 8px', fontSize: '15px', fontWeight: 'bold', lineHeight: '1.4', color:'#333' }}>
                                    {art.title}
                                </h4>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '11px', color: '#94a3b8' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><User size={11} /> {art.author || 'Admin'}</span>
                                    {art.published_at && (
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><Calendar size={11} /> {new Date(art.published_at).toLocaleDateString('id-ID')}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>

        {/* 7. CEK KESEHATAN */}
        <section style={{ marginBottom: '60px' }}>
             <h3 style={sectionTitle}>Cek Kesehatan Mandiri</h3>
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '15px', textAlign:'center' }}>
                {cekSehatTools.map((tool, i) => (
                    <div key={i} className="interactive-card" style={{ border:'none', background:'transparent', boxShadow:'none' }}>
                        <div style={{ width:'60px', height:'60px', background:'#f8fafc', borderRadius:'50%', margin:'0 auto 10px', display:'flex', alignItems:'center', justifyContent:'center' }}>
                             <img src={`https://unpkg.com/lucide-static@latest/icons/${tool.icon}.svg`} style={{ width: '24px', color: mainBlue }} alt="icon" />
                        </div>
                        <span style={{ fontSize:'12px', fontWeight:'500', color:'#555' }}>{tool.name}</span>
                    </div>
                ))}
            </div>
        </section>

        {/* 8. TESTIMONI */}
        <section style={{ marginBottom: '80px' }}>
             <h3 style={sectionTitle}>Kata Mereka</h3>
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '25px' }}>
                {testimonials.map((testi, i) => (
                    <div key={i} className="interactive-card" style={{ background: '#f8fafc', padding: '25px', borderRadius: '16px', border: '1px solid #f1f5f9', cursor:'default' }}>
                        <div style={{ color: '#fbbf24', marginBottom: '10px', fontSize:'14px' }}>⭐⭐⭐⭐⭐</div>
                        <p style={{ fontSize: '14px', lineHeight: '1.6', fontStyle: 'italic', marginBottom: '15px', color:'#555' }}>"{testi.text}"</p>
                        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                            <div style={{ width:'35px', height:'35px', borderRadius:'50%', background:'#cbd5e1', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'bold', color:'white' }}>{testi.name.charAt(0)}</div>
                            <div>
                                <p style={{ fontWeight: 'bold', fontSize: '13px', margin:0 }}>{testi.name}</p>
                                <p style={{ fontSize: '11px', color:'#94a3b8', margin:0 }}>{testi.role}</p>
                            </div>
                        </div>
                    </div>
                ))}
             </div>
        </section>

      </div>
      <Footer />
    </div>
  )
}