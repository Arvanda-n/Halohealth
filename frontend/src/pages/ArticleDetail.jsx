import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/header';
import Footer from '../components/Footer';
import { Calendar, User, ArrowLeft, Loader2, Tag } from 'lucide-react';

export default function ArticleDetail() {
  const { id } = useParams(); // Ambil ID dari URL
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/articles/${id}`); // Panggil API Detail
        if (response.ok) {
           const result = await response.json();
           // Ambil data dari dalam bungkusan { status: true, data: {...} }
           setArticle(result.data ? result.data : result);
        } else {
           console.error("Artikel tidak ditemukan");
        }
      } catch (error) {
        console.error("Error backend:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  // Helper URL Gambar
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://placehold.co/800x400?text=No+Image";
    if (imagePath.startsWith('http')) return imagePath;
    const cleanPath = imagePath.replace(/^\/|storage\//g, ''); 
    return `http://127.0.0.1:8000/storage/${cleanPath}`;
  };

  if (loading) return (
    <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100vh' }}>
        <Loader2 className="animate-spin" color="#0ea5e9" size={40} />
    </div>
  );

  if (!article) return (
    <div style={{ textAlign:'center', padding:'50px' }}>
        <h2>Artikel tidak ditemukan 😔</h2>
        <button onClick={() => navigate('/articles')} style={{ marginTop:'10px', color:'#0ea5e9' }}>Kembali</button>
    </div>
  );

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: '"Inter", sans-serif' }}>
      <Header />
      
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '120px 20px 60px' }}>
        
        {/* Tombol Kembali */}
        <button onClick={() => navigate(-1)} style={{ display:'flex', alignItems:'center', gap:'5px', border:'none', background:'transparent', color:'#64748b', cursor:'pointer', marginBottom:'20px', fontSize:'14px' }}>
            <ArrowLeft size={16} /> Kembali
        </button>

        {/* Judul & Meta */}
        <span style={{ background: '#e0f2fe', color: '#0ea5e9', fontSize: '12px', fontWeight: 'bold', padding: '5px 12px', borderRadius: '20px', display: 'inline-flex', alignItems: 'center', gap: '5px', marginBottom:'15px' }}>
            <Tag size={12} /> {article.category || 'Kesehatan'}
        </span>

        <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1e293b', lineHeight: '1.4', marginBottom: '20px' }}>
            {article.title}
        </h1>

        <div style={{ display:'flex', alignItems:'center', gap:'20px', color:'#64748b', fontSize:'14px', marginBottom:'30px', borderBottom:'1px solid #e2e8f0', paddingBottom:'20px' }}>
            <span style={{ display:'flex', alignItems:'center', gap:'5px' }}><User size={16}/> {article.author || 'Admin HaloHealth'}</span>
            <span style={{ display:'flex', alignItems:'center', gap:'5px' }}><Calendar size={16}/> {new Date(article.published_at || article.created_at).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>

        {/* Gambar Utama */}
        <div style={{ width:'100%', height:'400px', borderRadius:'16px', overflow:'hidden', marginBottom:'40px', boxShadow:'0 10px 30px rgba(0,0,0,0.1)' }}>
             <img 
                src={getImageUrl(article.thumbnail || article.image)} 
                style={{ width:'100%', height:'100%', objectFit:'cover' }}
                alt={article.title}
             />
        </div>

        {/* Isi Artikel */}
        <div style={{ fontSize:'18px', lineHeight:'1.8', color:'#334155', whiteSpace:'pre-line' }}>
            {article.content}
        </div>

      </div>

      <Footer />
    </div>
  );
}