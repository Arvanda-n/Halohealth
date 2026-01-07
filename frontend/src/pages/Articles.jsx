import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../components/header';
import Footer from '../components/Footer';
import { Calendar, User, ArrowRight, Loader2, Tag } from 'lucide-react';

export default function Articles() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/articles')
      .then(res => res.json())
      .then(data => setArticles(data.data || data))
      .finally(() => setLoading(false));
  }, []);

  const getImageUrl = (img) => {
    if (!img) return 'https://placehold.co/600x400?text=No+Image';
    if (img.startsWith('http')) return img;
    return `http://127.0.0.1:8000/storage/${img.replace(/^\/|storage\//g, '')}`;
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <Header />

      {/* HERO */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          padding: '120px 20px 60px',
          textAlign: 'center',
          background: 'linear-gradient(135deg,#0ea5e9,#3b82f6)',
          color: 'white'
        }}
      >
        <h1>Artikel & Berita Kesehatan</h1>
        <p>Informasi terpercaya langsung dari tenaga medis</p>
      </motion.div>

      {/* LIST */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 20px' }}>
        {loading ? (
          <div style={{ textAlign: 'center' }}>
            <Loader2 className="animate-spin" size={40} />
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '30px' }}>
            {articles.map((item, index) => (
              <motion.div
                key={item.id}

                /* 🔥 ANIMASI MASUK */
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}

                /* 🔥 ANIMASI INTERAKSI */
                whileHover={{ y: -8, boxShadow: '0 15px 35px rgba(0,0,0,0.12)' }}
                whileTap={{ scale: 0.92 }}

                onClick={() => navigate(`/articles/${item.id}`)}

                style={{
                  background: 'white',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: '1px solid #e2e8f0'
                }}
              >
                <img
                  src={getImageUrl(item.thumbnail)}
                  alt={item.title}
                  style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                />

                <div style={{ padding: '20px' }}>
                  <span style={{ fontSize: '12px', color: '#0ea5e9' }}>
                    <Tag size={12} /> {item.category || 'Umum'}
                  </span>

                  <h3 style={{ margin: '10px 0' }}>{item.title}</h3>

                  <p style={{ fontSize: '14px', color: '#64748b' }}>
                    {item.content?.substring(0, 90)}...
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                      <Calendar size={12} /> {new Date(item.published_at).toLocaleDateString('id-ID')}
                    </span>
                    <span style={{ color: '#0ea5e9', fontWeight: 'bold' }}>
                      Baca <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
