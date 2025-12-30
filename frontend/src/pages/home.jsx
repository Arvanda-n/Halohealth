import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/header';

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

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const banners = [foto1, foto2, foto3];
  const promoImages = [foto2, foto3, foto1];

  // SLIDER OTOMATIS
  useEffect(() => {
    const bannerInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 4000); 
    return () => clearInterval(bannerInterval);
  }, [banners.length]);

  // --- DATA KONTEN ---
  const services = [
    { icon: chatIcon, title: "Chat dengan Dokter", subtitle: "Tanya dokter spesialis", link: "/doctors" },
    { icon: tokoIcon, title: "Toko Kesehatan", subtitle: "Cek obat & vitamin", link: "/medicines" },
    { icon: homecareIcon, title: "Homecare", subtitle: "Medis ke rumah", link: "#" },
    { icon: asuransiIcon, title: "Asuransi", subtitle: "Hubungkan asuransi", link: "#" },
    { icon: skinIcon, title: "HaloSkin", subtitle: "Solusi kulit sehat", link: "#" },
    { icon: fitIcon, title: "HaloFit", subtitle: "Olahraga & diet", link: "#" },
  ];

  const needsCategories = [
    { name: "Kulit", icon: "sparkles" }, { name: "Seksual", icon: "heart-handshake" },
    { name: "Mental", icon: "brain" }, { name: "Hewan", icon: "paw-print" },
    { name: "Diabetes", icon: "droplet" }, { name: "Jantung", icon: "heart-pulse" },
    { name: "Parenting", icon: "baby" }, { name: "Bidan", icon: "stethoscope" }
  ];

  const specialistCategories = [
    { name: "Sp. Mata", icon: "eye" }, { name: "Sp. Kulit", icon: "sparkles" },
    { name: "Sp. Kandungan", icon: "heart-handshake" }, { name: "Sp. THT", icon: "ear" },
    { name: "Sp. Anak", icon: "baby" }, { name: "Sp. Penyakit Dalam", icon: "activity" }
  ];

  const medicineTabs = ["Vitamin", "Kecantikan", "Seksual", "P3K"];
  const products = [
    { name: "Neurobion Forte", unit: "Per Strip", price: "Rp 53.600", image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200" },
    { name: "Imunped Sirup", unit: "Per Botol", price: "Rp 71.700", image: "https://images.unsplash.com/photo-1584036561566-b45238f2e141?w=200" },
    { name: "Imboost Force", unit: "Per Strip", price: "Rp 90.500", image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200" },
    { name: "Astria 4mg", unit: "Per Strip", price: "Rp 40.000", image: "https://images.unsplash.com/photo-1584483766114-2cea6fac257d?w=200" },
  ];

  const articles = [
    { title: "Cara Menghilangkan Jerawat dengan Cepat", category: "Acne Care", image: "https://images.unsplash.com/photo-1579684385136-137af7549091?w=400" },
    { title: "Penyebab Insomnia dan Cara Mengatasinya", category: "Insomnia", image: "https://images.unsplash.com/photo-1493836512294-502baa1986e2?w=400" },
    { title: "Kenali Bintik Merah DBD Sejak Dini", category: "Demam", image: "https://images.unsplash.com/photo-1576091160550-2187d80aeff2?w=400" },
    { title: "Aturan Euthanasia di Indonesia", category: "Umum", image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400" }
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

  // STYLE VARIABLE
  const mainBlue = '#0ea5e9'; 
  const sectionTitle = { fontSize: '20px', fontWeight: 'bold', color: '#1e293b', marginBottom: '20px' };

  return (
    <div style={{ background: '#fff', minHeight: '100vh', fontFamily: '"Inter", sans-serif', color: '#333' }}>
      
      {/* CSS CUSTOM: ANIMASI & HOVER EFFECT */}
      <style>{`
        /* Hover Effect Artikel: Judul jadi Biru */
        .article-card:hover .article-title {
          color: #0ea5e9 !important;
          transition: color 0.3s;
        }
        .article-card:hover img {
          transform: scale(1.05);
          transition: transform 0.3s;
        }

        /* Hover Effect Umum */
        .interactive-card {
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          cursor: pointer;
        }
        .interactive-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px -5px rgba(14, 165, 233, 0.15);
          border-color: #0ea5e9 !important;
        }
        .interactive-card:active {
          transform: scale(0.98);
        }

        /* Tombol Biru */
        .btn-primary:hover {
          background-color: #0284c7 !important;
          color: white !important;
        }
      `}</style>

      {/* HEADER */}
      <div style={{ position: 'sticky', top: 0, zIndex: 100, background: 'white', borderBottom:'1px solid #f1f5f9' }}>
        <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
            <Header />
        </div>
      </div>

      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '30px 20px' }}>

        {/* 1. BANNER */}
        <section style={{ marginBottom: '40px' }}>
            <div style={{ borderRadius: '16px', overflow: 'hidden', height: '300px', position: 'relative', boxShadow: '0 4px 15px rgba(14, 165, 233, 0.1)' }}>
                <div style={{ display: 'flex', transition: 'transform 0.5s ease-in-out', height: '100%', transform: `translateX(-${currentSlide * 100}%)` }}>
                    {banners.map((img, idx) => (
                        <img key={idx} src={img} style={{ minWidth: '100%', height: '100%', objectFit: 'cover' }} />
                    ))}
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '15px' }}>
                {banners.map((_, idx) => (
                    <div key={idx} onClick={() => setCurrentSlide(idx)}
                        style={{ width: currentSlide === idx ? '24px' : '8px', height: '8px', borderRadius: '4px', background: currentSlide === idx ? mainBlue : '#cbd5e1', cursor: 'pointer', transition: '0.3s' }}
                    ></div>
                ))}
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
                             <img src={item.icon} style={{ width: '45px' }} />
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

        {/* 4. DIAWASI MEDICAL */}
        <section style={{ marginBottom: '50px' }}>
             <div style={{ background: '#f0f9ff', borderRadius: '16px', padding: '40px', borderLeft: `6px solid ${mainBlue}`, display: 'flex', alignItems: 'center', gap: '25px' }}>
                <div style={{ fontSize: '45px' }}>🛡️</div>
                <div>
                    <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#0369a1', margin: 0 }}>Diawasi Board of Medical Excellence</h3>
                    <p style={{ margin: '5px 0 0', fontSize: '14px', color: '#334155' }}>Standar medis internasional untuk keamanan dan kenyamanan Anda.</p>
                </div>
            </div>
        </section>

{/* 5. DUKUNGAN KEBUTUHAN */}
        <section style={{ marginBottom: '60px' }}>
             <h3 style={sectionTitle}>Dukungan Kebutuhan</h3>
             <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap:'wrap', gap:'15px' }}>
                {needsCategories.map((item, i) => (
                    <div key={i} className="icon-hover" style={{ textAlign: 'center', cursor: 'pointer', width:'100px' }}>
                        <div className="interactive-card" style={{ width: '70px', height: '70px', borderRadius: '50%', margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                             <img src={`https://unpkg.com/lucide-static@latest/icons/${item.icon}.svg`} style={{ width: '30px', opacity: 0.7 }} />
                        </div>
                        <span style={{ fontSize: '13px', fontWeight: '500', color: '#475569' }}>{item.name}</span>
                    </div>
                ))}
            </div>
        </section>

        {/* 6. SPESIALIS */}
        <section style={{ marginBottom: '50px' }}>
            <h3 style={sectionTitle}>Spesialis Tepercaya</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                {specialistCategories.map((cat, i) => (
                    <div key={i} className="interactive-card" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', borderRadius: '12px', background:'white', border:'1px solid #e2e8f0' }}>
                        <img src={`https://unpkg.com/lucide-static@latest/icons/${cat.icon}.svg`} style={{ width: '24px', color: mainBlue }} />
                        <span style={{ fontSize: '14px', fontWeight: '600' }}>{cat.name}</span>
                    </div>
                ))}
            </div>
        </section>

        {/* 7. BELI OBAT */}
        <section style={{ marginBottom: '60px' }}>
             <h3 style={sectionTitle}>Obat & Suplemen</h3>
             <div style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
                {medicineTabs.map((tab, i) => (
                    <button key={i} className="btn-primary" style={{ padding: '8px 20px', background: i===0?'#e0f2fe':'white', color: i===0? mainBlue :'#555', borderRadius:'20px', fontSize:'13px', border: i===0?'none':'1px solid #eee', fontWeight:'600', cursor:'pointer' }}>{tab}</button>
                ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                {products.map((prod, i) => (
                    <div key={i} className="interactive-card" style={{ borderRadius: '12px', padding: '15px', background:'white', border:'1px solid #e2e8f0' }}>
                        <div style={{ height: '120px', display:'flex', justifyContent:'center', marginBottom:'10px' }}>
                            <img src={prod.image} style={{ height: '100%', objectFit: 'contain' }} />
                        </div>
                        <h4 style={{ margin: '0 0 5px', fontSize: '14px', fontWeight: 'bold' }}>{prod.name}</h4>
                        <p style={{ color: mainBlue, fontWeight: 'bold', fontSize: '14px' }}>{prod.price}</p>
                        <button className="btn-primary" style={{ width: '100%', marginTop:'10px', padding: '8px', background: 'white', border: `1px solid ${mainBlue}`, color: mainBlue, borderRadius: '8px', fontSize:'12px', fontWeight:'bold', cursor:'pointer' }}>+ Keranjang</button>
                    </div>
                ))}
            </div>
        </section>

        {/* 8. ARTIKEL (HOVER JUDUL BIRU) */}
        <section style={{ marginBottom: '60px' }}>
            <h3 style={sectionTitle}>Artikel Kesehatan</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '25px' }}>
                {articles.map((art, i) => (
                    <div key={i} className="article-card interactive-card" style={{ display: 'flex', gap: '20px', borderRadius:'12px', padding:'0', overflow:'hidden', border:'none', boxShadow:'none' }}>
                        <img src={art.image} style={{ width: '120px', height: '100px', borderRadius: '12px', objectFit: 'cover' }} />
                        <div style={{ padding:'5px 0' }}>
                            {/* CLASS TITLE UNTUK HOVER */}
                            <h4 className="article-title" style={{ margin: '0 0 10px', fontSize: '16px', fontWeight: 'bold', lineHeight: '1.4', color:'#333' }}>{art.title}</h4>
                            <span style={{ fontSize: '11px', background: '#e0f2fe', color: mainBlue, padding: '4px 10px', borderRadius: '4px', fontWeight:'bold' }}>{art.category}</span>
                        </div>
                    </div>
                ))}
            </div>
        </section>

        {/* 9. CEK KESEHATAN */}
        <section style={{ marginBottom: '60px' }}>
             <h3 style={sectionTitle}>Cek Kesehatan Mandiri</h3>
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '15px', textAlign:'center' }}>
                {cekSehatTools.map((tool, i) => (
                    <div key={i} className="interactive-card" style={{ border:'none', background:'transparent', boxShadow:'none' }}>
                        <div style={{ width:'60px', height:'60px', background:'#f8fafc', borderRadius:'50%', margin:'0 auto 10px', display:'flex', alignItems:'center', justifyContent:'center' }}>
                             <img src={`https://unpkg.com/lucide-static@latest/icons/${tool.icon}.svg`} style={{ width: '24px', color: mainBlue }} />
                        </div>
                        <span style={{ fontSize:'12px', fontWeight:'500', color:'#555' }}>{tool.name}</span>
                    </div>
                ))}
            </div>
        </section>

        {/* 10. TESTIMONI DENGAN BINTANG */}
        <section style={{ marginBottom: '80px' }}>
             <h3 style={sectionTitle}>Kata Mereka</h3>
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '25px' }}>
                {testimonials.map((testi, i) => (
                    <div key={i} className="interactive-card" style={{ background: '#f8fafc', padding: '25px', borderRadius: '16px', border: '1px solid #f1f5f9', cursor:'default' }}>
                        {/* BINTANG */}
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

      {/* FOOTER BARU YANG LEBIH RAPI */}
      <footer style={{ background: '#0f172a', color: 'white', padding: '60px 0 20px', borderTop: '4px solid #0ea5e9' }}>
        <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '0 20px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '40px' }}>
            
            {/* KOLOM 1: BRAND */}
            <div>
                <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '15px', color: mainBlue }}>HaloHealth<span style={{color:'white'}}>.</span></h2>
                <p style={{ color: '#94a3b8', lineHeight: '1.6', fontSize: '14px', marginBottom: '20px' }}>
                    Solusi kesehatan digital terpercaya di Indonesia. Kami hadir untuk memudahkan akses kesehatan bagi Anda dan keluarga.
                </p>
                {/* Social Media Dummy */}
                <div style={{ display: 'flex', gap: '15px' }}>
                    {['facebook', 'twitter', 'instagram', 'linkedin'].map((social, i) => (
                        <div key={i} style={{ width: '35px', height: '35px', background: '#1e293b', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: '0.3s' }}
                             onMouseEnter={(e) => e.currentTarget.style.background = mainBlue}
                             onMouseLeave={(e) => e.currentTarget.style.background = '#1e293b'}
                        >
                            <img src={`https://unpkg.com/lucide-static@latest/icons/${social}.svg`} style={{ width: '18px', filter: 'invert(1)' }} />
                        </div>
                    ))}
                </div>
            </div>

            {/* KOLOM 2: PERUSAHAAN */}
            <div>
                <h4 style={{ fontWeight: 'bold', marginBottom: '20px', color: 'white' }}>Perusahaan</h4>
                <ul style={{ listStyle: 'none', padding: 0, color: '#cbd5e1', fontSize: '14px', lineHeight: '2.5' }}>
                    <li style={{ cursor: 'pointer', transition: '0.2s' }} onMouseEnter={(e)=>e.target.style.color=mainBlue} onMouseLeave={(e)=>e.target.style.color='#cbd5e1'}>Tentang Kami</li>
                    <li style={{ cursor: 'pointer', transition: '0.2s' }} onMouseEnter={(e)=>e.target.style.color=mainBlue} onMouseLeave={(e)=>e.target.style.color='#cbd5e1'}>Karir</li>
                    <li style={{ cursor: 'pointer', transition: '0.2s' }} onMouseEnter={(e)=>e.target.style.color=mainBlue} onMouseLeave={(e)=>e.target.style.color='#cbd5e1'}>Blog</li>
                    <li style={{ cursor: 'pointer', transition: '0.2s' }} onMouseEnter={(e)=>e.target.style.color=mainBlue} onMouseLeave={(e)=>e.target.style.color='#cbd5e1'}>Mitra Kami</li>
                </ul>
            </div>

            {/* KOLOM 3: LAYANAN */}
            <div>
                <h4 style={{ fontWeight: 'bold', marginBottom: '20px', color: 'white' }}>Layanan</h4>
                <ul style={{ listStyle: 'none', padding: 0, color: '#cbd5e1', fontSize: '14px', lineHeight: '2.5' }}>
                    <li style={{ cursor: 'pointer', transition: '0.2s' }} onMouseEnter={(e)=>e.target.style.color=mainBlue} onMouseLeave={(e)=>e.target.style.color='#cbd5e1'}>Chat Dokter</li>
                    <li style={{ cursor: 'pointer', transition: '0.2s' }} onMouseEnter={(e)=>e.target.style.color=mainBlue} onMouseLeave={(e)=>e.target.style.color='#cbd5e1'}>Toko Kesehatan</li>
                    <li style={{ cursor: 'pointer', transition: '0.2s' }} onMouseEnter={(e)=>e.target.style.color=mainBlue} onMouseLeave={(e)=>e.target.style.color='#cbd5e1'}>Buat Janji RS</li>
                    <li style={{ cursor: 'pointer', transition: '0.2s' }} onMouseEnter={(e)=>e.target.style.color=mainBlue} onMouseLeave={(e)=>e.target.style.color='#cbd5e1'}>Cek Lab</li>
                </ul>
            </div>

            {/* KOLOM 4: DOWNLOAD APP */}
            <div>
                <h4 style={{ fontWeight: 'bold', marginBottom: '20px', color: 'white' }}>Download App</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ background: '#1e293b', padding: '10px 15px', borderRadius: '8px', border: '1px solid #334155', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {/* Ganti Emoji Apple dengan Icon SVG jika mau, sementara pakai teks/icon unicode yang aman */}
                        <div style={{ fontSize: '20px', color:'white' }}></div>
                        <div>
                            <div style={{ fontSize: '10px', color: '#94a3b8' }}>Download on the</div>
                            <div style={{ fontSize: '14px', fontWeight: 'bold' }}>App Store</div>
                        </div>
                    </div>
                    <div style={{ background: '#1e293b', padding: '10px 15px', borderRadius: '8px', border: '1px solid #334155', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ fontSize: '20px', color:'white' }}>▶</div>
                        <div>
                            <div style={{ fontSize: '10px', color: '#94a3b8' }}>Get it on</div>
                            <div style={{ fontSize: '14px', fontWeight: 'bold' }}>Google Play</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* COPYRIGHT BAR */}
        <div style={{ maxWidth: '1300px', margin: '50px auto 0', padding: '20px 20px 0', borderTop: '1px solid #1e293b', textAlign: 'center', color: '#64748b', fontSize: '13px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span>&copy; 2024 HaloHealth Indonesia. All rights reserved.</span>
            <div style={{ display:'flex', gap:'20px' }}>
                <span style={{ cursor:'pointer' }}>Syarat & Ketentuan</span>
                <span style={{ cursor:'pointer' }}>Kebijakan Privasi</span>
            </div>
        </div>
      </footer>

    </div>
  )
}