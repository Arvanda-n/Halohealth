import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 👈 Import useNavigate
import Header from '../components/header';
import Footer from '../components/Footer';
import { Calendar, User, ArrowRight, Loader2, Tag } from 'lucide-react';

export default function Articles() {
  const navigate = useNavigate(); // 👈 Pake hook ini
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  // FETCH DATA DARI API (Tanpa Dummy-dummyan)
  useEffect(() => {
    const fetchArticles = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/articles');
            if (response.ok) {
                const data = await response.json();
                setArticles(data);
            } else {
                console.error("Gagal ambil artikel");
            }
        } catch (err) {
            console.error("Error backend:", err);
        } finally {
            setLoading(false);
        }
    };
    fetchArticles();
  }, []);

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: '"Inter", sans-serif' }}>
      
      {/* HEADER FIXED */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 99, background: 'white', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <Header />
      </div>

      {/* HERO SECTION */}
      <div style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)', padding: '120px 20px 60px', textAlign: 'center', color: 'white' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '10px' }}>Artikel & Berita Kesehatan</h1>
          <p style={{ opacity: 0.9, fontSize: '16px', maxWidth: '600px', margin: '0 auto' }}>Informasi terpercaya langsung dari para ahli medis kami.</p>
      </div>

      {/* LIST ARTIKEL */}
      <div className="container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 20px' }}>
        
        {loading ? (
             <div style={{ textAlign: 'center', padding: '50px' }}>
                <Loader2 className="animate-spin" size={40} color="#0ea5e9" style={{ margin: '0 auto' }} />
                <p style={{ marginTop: '10px', color: '#64748b' }}>Memuat artikel...</p>
             </div>
        ) : articles.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
                {articles.map((item) => (
                    <div key={item.id} 
                         style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', transition: '0.3s', cursor: 'pointer', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}
                         onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)'; }}
                         onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)'; }}
                    >
                        {/* GAMBAR */}
                        <div style={{ height: '200px', overflow: 'hidden', background: '#f1f5f9' }}>
                            <img 
                                src={item.image.startsWith('http') ? item.image : `http://127.0.0.1:8000${item.image}`} 
                                alt={item.title} 
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                onError={(e) => e.target.src = "https://placehold.co/600x400?text=No+Image"} // Jaga-jaga kalau gambar error
                            />
                        </div>

                        {/* KONTEN */}
                        <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                            
                            {/* TAG CATEGORY */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                <span style={{ background: '#e0f2fe', color: '#0ea5e9', fontSize: '12px', fontWeight: 'bold', padding: '5px 10px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <Tag size={12} /> {item.category || 'Umum'}
                                </span>
                                <span style={{ fontSize: '12px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <Calendar size={12} /> {new Date(item.created_at).toLocaleDateString('id-ID')}
                                </span>
                            </div>

                            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b', marginBottom: '10px', lineHeight: '1.4' }}>
                                {item.title}
                            </h3>
                            
                            {/* PREVIEW KONTEN (Potong biar gak kepanjangan) */}
                            <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6', marginBottom: '20px', flex: 1 }}>
                                {item.content ? item.content.substring(0, 100) + "..." : "Baca selengkapnya..."}
                            </p>

                            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ width: '25px', height: '25px', borderRadius: '50%', background: '#cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                        <User size={14}/>
                                    </div>
                                    <span style={{ fontSize: '13px', color: '#475569', fontWeight: '500' }}>{item.author || 'Admin'}</span>
                                </div>
                                <span style={{ color: '#0ea5e9', fontSize: '14px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    Baca <ArrowRight size={16} />
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div style={{ textAlign: 'center', padding: '50px', color: '#64748b' }}>
                <p>Belum ada artikel yang tersedia.</p>
            </div>
        )}

      </div>

      <Footer />
    </div>
  );
}