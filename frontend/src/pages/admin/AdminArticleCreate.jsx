import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Save, ArrowLeft, Upload, Loader2 } from 'lucide-react';

export default function AdminArticleCreate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // State untuk form
  const [formData, setFormData] = useState({
    title: '',
    category: 'Tips Sehat', // Default value
    content: '',
    author: 'Admin HaloHealth', // Hardcode dulu atau ambil dari user login
  });   
  
  const [thumbnail, setThumbnail] = useState(null); // File mentah
  const [preview, setPreview] = useState(null);     // URL Preview gambar

  // Handle Perubahan Input Teks
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Perubahan File Gambar
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        setThumbnail(file);
        setPreview(URL.createObjectURL(file)); // Buat preview biar admin bisa lihat
    }
  };

  // Handle Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Pakai FormData karena kita kirim File
    const data = new FormData();
    data.append('title', formData.title);
    data.append('category', formData.category);
    data.append('content', formData.content);
    data.append('author', formData.author);
    data.append('published_at', new Date().toISOString().slice(0, 10)); // Tanggal hari ini
    
    if (thumbnail) {
        data.append('thumbnail', thumbnail);
    }

    try {
        const response = await fetch('http://127.0.0.1:8000/api/articles', {
            method: 'POST',
            body: data, // Jangan kasih header 'Content-Type', biar browser yang atur
        });

        if (response.ok) {
            alert('Artikel berhasil diterbitkan! 🎉');
            navigate('/admin/articles'); // Balik ke tabel
        } else {
            const errorData = await response.json();
            alert('Gagal: ' + (errorData.message || 'Cek inputanmu'));
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Terjadi kesalahan sistem');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* HEADER */}
        <div style={{ display:'flex', alignItems:'center', gap:'15px', marginBottom:'30px' }}>
            <Link to="/admin/articles" style={{ background:'white', padding:'10px', borderRadius:'50%', display:'flex', alignItems:'center', color:'#64748b', boxShadow:'0 2px 5px rgba(0,0,0,0.05)' }}>
                <ArrowLeft size={20} />
            </Link>
            <div>
                <h1 style={{ fontSize:'24px', fontWeight:'bold', color:'#1e293b' }}>Tulis Artikel Baru</h1>
                <p style={{ color:'#64748b' }}>Bagikan informasi kesehatan untuk pengguna.</p>
            </div>
        </div>

        {/* FORM CARD */}
        <form onSubmit={handleSubmit} style={{ background:'white', padding:'30px', borderRadius:'16px', boxShadow:'0 4px 20px rgba(0,0,0,0.05)' }}>
            
            {/* Judul */}
            <div style={{ marginBottom:'20px' }}>
                <label style={{ display:'block', marginBottom:'8px', fontWeight:'600', color:'#334155' }}>Judul Artikel</label>
                <input 
                    type="text" name="title" required
                    placeholder="Contoh: 5 Cara Mencegah Flu..."
                    value={formData.title} onChange={handleChange}
                    style={{ width:'100%', padding:'12px', borderRadius:'8px', border:'1px solid #e2e8f0', outline:'none', fontSize:'16px' }}
                />
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px', marginBottom:'20px' }}>
                {/* Kategori */}
                <div>
                    <label style={{ display:'block', marginBottom:'8px', fontWeight:'600', color:'#334155' }}>Kategori</label>
                    <select 
                        name="category" value={formData.category} onChange={handleChange}
                        style={{ width:'100%', padding:'12px', borderRadius:'8px', border:'1px solid #e2e8f0', outline:'none', background:'white' }}
                    >
                        <option value="Tips Sehat">Tips Sehat</option>
                        <option value="Penyakit">Info Penyakit</option>
                        <option value="Nutrisi">Nutrisi & Diet</option>
                        <option value="Ibu & Anak">Ibu & Anak</option>
                        <option value="Mental Health">Kesehatan Mental</option>
                    </select>
                </div>

                {/* Penulis */}
                <div>
                    <label style={{ display:'block', marginBottom:'8px', fontWeight:'600', color:'#334155' }}>Penulis</label>
                    <input 
                        type="text" name="author"
                        value={formData.author} onChange={handleChange}
                        style={{ width:'100%', padding:'12px', borderRadius:'8px', border:'1px solid #e2e8f0', outline:'none', background:'#f8fafc' }}
                    />
                </div>
            </div>

            {/* Upload Gambar */}
            <div style={{ marginBottom:'20px' }}>
                <label style={{ display:'block', marginBottom:'8px', fontWeight:'600', color:'#334155' }}>Gambar Sampul</label>
                <div style={{ border:'2px dashed #cbd5e1', borderRadius:'12px', padding:'30px', textAlign:'center', position:'relative', cursor:'pointer', background: preview ? '#f8fafc' : 'white' }}>
                    <input 
                        type="file" accept="image/*" onChange={handleFileChange}
                        style={{ position:'absolute', top:0, left:0, width:'100%', height:'100%', opacity:0, cursor:'pointer' }}
                    />
                    
                    {preview ? (
                        <div>
                            <img src={preview} alt="Preview" style={{ maxHeight:'200px', borderRadius:'8px', boxShadow:'0 4px 10px rgba(0,0,0,0.1)' }} />
                            <p style={{ marginTop:'10px', fontSize:'12px', color:'#0ea5e9' }}>Klik untuk ganti gambar</p>
                        </div>
                    ) : (
                        <div style={{ color:'#64748b' }}>
                            <Upload size={40} style={{ marginBottom:'10px', color:'#94a3b8' }} />
                            <p>Klik atau geser file gambar ke sini</p>
                            <span style={{ fontSize:'12px', color:'#94a3b8' }}>JPG, PNG (Max 2MB)</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Konten Utama */}
            <div style={{ marginBottom:'30px' }}>
                <label style={{ display:'block', marginBottom:'8px', fontWeight:'600', color:'#334155' }}>Isi Artikel</label>
                <textarea 
                    name="content" rows="10" required
                    placeholder="Tulis isi artikel di sini..."
                    value={formData.content} onChange={handleChange}
                    style={{ width:'100%', padding:'12px', borderRadius:'8px', border:'1px solid #e2e8f0', outline:'none', fontSize:'15px', lineHeight:'1.6', fontFamily:'sans-serif' }}
                ></textarea>
            </div>

            {/* Tombol Simpan */}
            <button 
                type="submit" disabled={loading}
                style={{ 
                    width:'100%', padding:'14px', background:'#0ea5e9', color:'white', border:'none', borderRadius:'10px', 
                    fontSize:'16px', fontWeight:'bold', cursor: loading ? 'not-allowed' : 'pointer', display:'flex', justifyContent:'center', alignItems:'center', gap:'10px',
                    opacity: loading ? 0.7 : 1
                }}
            >
                {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                {loading ? 'Menyimpan...' : 'Terbitkan Artikel'}
            </button>

        </form>
    </div>
  );
}