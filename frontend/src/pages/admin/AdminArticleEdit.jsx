import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Save, ArrowLeft, Upload, Loader2 } from 'lucide-react';

export default function AdminArticleEdit() {
  const { id } = useParams(); // Ambil ID dari URL
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // State Form
  const [formData, setFormData] = useState({
    title: '',
    category: 'Tips Sehat',
    content: '',
    author: '',
  });

  const [thumbnail, setThumbnail] = useState(null); // File baru (jika ada)
  const [preview, setPreview] = useState(null);     // Preview gambar

  // 1. AMBIL DATA LAMA SAAT LOAD
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/articles/${id}`);
        const result = await response.json();
        const data = result.data ? result.data : result;

        setFormData({
            title: data.title,
            category: data.category,
            content: data.content,
            author: data.author
        });

        // Set preview gambar lama jika ada
        if(data.thumbnail) {
            const imgUrl = data.thumbnail.startsWith('http') 
                ? data.thumbnail 
                : `http://127.0.0.1:8000/storage/${data.thumbnail}`;
            setPreview(imgUrl);
        }
      } catch (error) {
        alert("Gagal mengambil data artikel");
      } finally {
        setFetching(false);
      }
    };
    fetchData();
  }, [id]);

  // Handle Input Teks
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Input File
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        setThumbnail(file);
        setPreview(URL.createObjectURL(file));
    }
  };

  // 2. PROSES UPDATE (PUT)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('title', formData.title);
    data.append('category', formData.category);
    data.append('content', formData.content);
    data.append('author', formData.author);
    
    // 🔥 PENTING: Trik Laravel untuk Upload File di method PUT
    data.append('_method', 'PUT'); 

    // Kirim gambar HANYA JIKA user upload baru
    if (thumbnail) {
        data.append('thumbnail', thumbnail);
    }

    try {
        // Perhatikan: Method tetap POST, tapi bawa _method: PUT di body
        const response = await fetch(`http://127.0.0.1:8000/api/articles/${id}`, {
            method: 'POST', 
            body: data,
        });

        if (response.ok) {
            alert('Artikel berhasil diperbarui! 🎉');
            navigate('/admin/articles');
        } else {
            const err = await response.json();
            alert('Gagal: ' + (err.message || 'Cek koneksi backend'));
        }
    } catch (error) {
        console.error(error);
        alert('Terjadi kesalahan sistem');
    } finally {
        setLoading(false);
    }
  };

  if(fetching) return <div style={{padding:'50px', textAlign:'center'}}>Loading data...</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* HEADER */}
        <div style={{ display:'flex', alignItems:'center', gap:'15px', marginBottom:'30px' }}>
            <Link to="/admin/articles" style={{ background:'white', padding:'10px', borderRadius:'50%', display:'flex', alignItems:'center', color:'#64748b', boxShadow:'0 2px 5px rgba(0,0,0,0.05)' }}>
                <ArrowLeft size={20} />
            </Link>
            <div>
                <h1 style={{ fontSize:'24px', fontWeight:'bold', color:'#1e293b' }}>Edit Artikel</h1>
                <p style={{ color:'#64748b' }}>Perbarui informasi artikel ini.</p>
            </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} style={{ background:'white', padding:'30px', borderRadius:'16px', boxShadow:'0 4px 20px rgba(0,0,0,0.05)' }}>
            
            {/* Judul */}
            <div style={{ marginBottom:'20px' }}>
                <label style={{ display:'block', marginBottom:'8px', fontWeight:'600', color:'#334155' }}>Judul Artikel</label>
                <input 
                    type="text" name="title" required
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
                <div style={{ border:'2px dashed #cbd5e1', borderRadius:'12px', padding:'20px', textAlign:'center', position:'relative', background: '#f8fafc' }}>
                    <input 
                        type="file" accept="image/*" onChange={handleFileChange}
                        style={{ position:'absolute', top:0, left:0, width:'100%', height:'100%', opacity:0, cursor:'pointer' }}
                    />
                    {preview ? (
                        <div>
                            <img src={preview} alt="Preview" style={{ maxHeight:'200px', borderRadius:'8px', marginBottom:'10px' }} />
                            <p style={{ fontSize:'12px', color:'#0ea5e9', fontWeight:'bold' }}>Klik untuk ganti gambar baru</p>
                        </div>
                    ) : (
                        <div style={{ padding:'20px', color:'#94a3b8' }}>
                            <Upload size={30} />
                            <p>Upload Gambar Baru</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Isi Artikel */}
            <div style={{ marginBottom:'30px' }}>
                <label style={{ display:'block', marginBottom:'8px', fontWeight:'600', color:'#334155' }}>Isi Artikel</label>
                <textarea 
                    name="content" rows="10" required
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
                {loading ? 'Menyimpan Perubahan...' : 'Simpan Perubahan'}
            </button>

        </form>
    </div>
  );
}