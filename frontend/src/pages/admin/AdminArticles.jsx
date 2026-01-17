import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // 🔥 Tambah useNavigate
import { Plus, Pencil, Trash2, Search, Loader2 } from 'lucide-react';

export default function AdminArticles() {
  const navigate = useNavigate(); // 🔥 Inisialisasi Navigasi
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // 1. Ambil Data dari API
  const fetchArticles = async () => {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/articles');
        const result = await response.json();
        setArticles(result.data ? result.data : result);
    } catch (error) {
        console.error("Error:", error);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  // 2. Fungsi Hapus Artikel
  const handleDelete = async (id) => {
    if(!confirm("Yakin mau hapus artikel ini?")) return;

    try {
        const response = await fetch(`http://127.0.0.1:8000/api/articles/${id}`, {
            method: 'DELETE'
        });
        if(response.ok) {
            alert("Artikel berhasil dihapus!");
            fetchArticles(); // Refresh data
        }
    } catch (error) {
        alert("Gagal menghapus data");
    }
  };

  // Filter Pencarian
  const filteredArticles = articles.filter(item => 
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
        {/* HEADER HALAMAN */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px' }}>
            <div>
                <h1 style={{ fontSize:'24px', fontWeight:'bold', color:'#1e293b' }}>Kelola Artikel</h1>
                <p style={{ color:'#64748b' }}>Daftar semua berita & tips kesehatan.</p>
            </div>
            <Link to="/admin/articles/create" style={{ background:'#0ea5e9', color:'white', padding:'10px 16px', borderRadius:'8px', textDecoration:'none', display:'flex', alignItems:'center', gap:'8px', fontWeight:'600' }}>
                <Plus size={18} /> Tambah Artikel
            </Link>
        </div>

        {/* SEARCH BAR */}
        <div style={{ background:'white', padding:'16px', borderRadius:'12px', boxShadow:'0 2px 5px rgba(0,0,0,0.05)', marginBottom:'20px', display:'flex', alignItems:'center', gap:'10px' }}>
            <Search size={20} color="#94a3b8" />
            <input 
                type="text" 
                placeholder="Cari judul artikel..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ border:'none', outline:'none', width:'100%', fontSize:'14px', color:'#334155' }}
            />
        </div>

        {/* TABEL DATA */}
        <div style={{ background:'white', borderRadius:'12px', boxShadow:'0 4px 6px -1px rgba(0,0,0,0.1)', overflow:'hidden' }}>
            {loading ? (
                <div style={{ padding:'40px', textAlign:'center' }}><Loader2 className="animate-spin" style={{margin:'0 auto'}} color="#0ea5e9" /></div>
            ) : (
                <table style={{ width:'100%', borderCollapse:'collapse', textAlign:'left' }}>
                    <thead style={{ background:'#f8fafc', borderBottom:'1px solid #e2e8f0' }}>
                        <tr>
                            <th style={{ padding:'16px', fontSize:'14px', color:'#475569' }}>No</th>
                            <th style={{ padding:'16px', fontSize:'14px', color:'#475569' }}>Judul Artikel</th>
                            <th style={{ padding:'16px', fontSize:'14px', color:'#475569' }}>Kategori</th>
                            <th style={{ padding:'16px', fontSize:'14px', color:'#475569' }}>Penulis</th>
                            <th style={{ padding:'16px', fontSize:'14px', color:'#475569', textAlign:'center' }}>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredArticles.length > 0 ? filteredArticles.map((item, index) => (
                            <tr key={item.id} style={{ borderBottom:'1px solid #f1f5f9' }}>
                                <td style={{ padding:'16px', color:'#64748b' }}>{index + 1}</td>
                                
                                <td style={{ padding:'16px', fontWeight:'500', color:'#1e293b' }}>
                                    <Link to={`/articles/${item.id}`} target="_blank" style={{ textDecoration:'none', color:'#0ea5e9', fontWeight:'bold' }}>
                                        {item.title}
                                    </Link> 
                                    <br/>
                                    <span style={{ fontSize:'12px', color:'#94a3b8' }}>{new Date(item.created_at).toLocaleDateString('id-ID')}</span>
                                </td>

                                <td style={{ padding:'16px' }}>
                                    <span style={{ background:'#e0f2fe', color:'#0284c7', padding:'4px 10px', borderRadius:'20px', fontSize:'12px', fontWeight:'600' }}>
                                        {item.category || 'Umum'}
                                    </span>
                                </td>
                                <td style={{ padding:'16px', color:'#475569' }}>{item.author || 'Admin'}</td>
                                <td style={{ padding:'16px', textAlign:'center' }}>
                                    <div style={{ display:'flex', justifyContent:'center', gap:'10px' }}>
                                        
                                        {/* 🔥 TOMBOL EDIT (SUDAH AKTIF) */}
                                        <button 
                                            onClick={() => navigate(`/admin/articles/edit/${item.id}`)}
                                            style={{ background:'#fef3c7', border:'none', padding:'8px', borderRadius:'6px', cursor:'pointer', color:'#d97706' }}
                                        >
                                            <Pencil size={16} />
                                        </button>

                                        {/* Tombol Hapus */}
                                        <button onClick={() => handleDelete(item.id)} style={{ background:'#fee2e2', border:'none', padding:'8px', borderRadius:'6px', cursor:'pointer', color:'#ef4444' }}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5" style={{ padding:'30px', textAlign:'center', color:'#94a3b8' }}>Tidak ada data artikel.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    </div>
  );
}