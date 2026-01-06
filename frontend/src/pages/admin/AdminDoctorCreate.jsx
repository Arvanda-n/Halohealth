import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Save, ArrowLeft, User, Stethoscope, Loader2 } from 'lucide-react'; 

export default function AdminDoctorCreate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // 1. STATE FORM LENGKAP
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '', 
    password: '',
    specialization: 'Umum',
    experience_years: '',
    consultation_fee: '',
  });
  
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);

  // Fungsi Handle Change (Penting biar bisa ngetik)
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        setPhoto(file);
        setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('phone', formData.phone);
    data.append('password', formData.password);
    data.append('specialization', formData.specialization);
    data.append('experience_years', formData.experience_years);
    data.append('consultation_fee', formData.consultation_fee);
    
    if (photo) {
        data.append('photo', photo);
    }

    try {
        const response = await fetch('http://127.0.0.1:8000/api/doctors', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
            },
            body: data,
        });

        const result = await response.json();

        if (response.ok) {
            alert('Dokter berhasil ditambahkan! 🎉');
            navigate('/admin/doctors');
        } else {
            alert('Gagal: ' + (result.message || JSON.stringify(result)));
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Terjadi kesalahan sistem');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        {/* HEADER */}
        <div style={{ display:'flex', alignItems:'center', gap:'15px', marginBottom:'30px' }}>
            <Link to="/admin/doctors" style={{ background:'white', padding:'10px', borderRadius:'50%', display:'flex', alignItems:'center', color:'#64748b', boxShadow:'0 2px 5px rgba(0,0,0,0.05)' }}>
                <ArrowLeft size={20} />
            </Link>
            <div>
                <h1 style={{ fontSize:'24px', fontWeight:'bold', color:'#1e293b' }}>Tambah Dokter Baru</h1>
                <p style={{ color:'#64748b' }}>Buat akun login & profil dokter sekaligus.</p>
            </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:'24px' }}>
            
            {/* KOLOM KIRI: DATA UTAMA */}
            <div style={{ background:'white', padding:'30px', borderRadius:'16px', boxShadow:'0 4px 20px rgba(0,0,0,0.05)' }}>
                <h3 style={{ fontSize:'18px', fontWeight:'bold', marginBottom:'20px', display:'flex', alignItems:'center', gap:'10px', color:'#334155' }}>
                    <User size={20} color="#0ea5e9"/> Akun & Biodata
                </h3>

                <div style={{ marginBottom:'15px' }}>
                    <label style={{ display:'block', marginBottom:'8px', fontWeight:'600', color:'#334155' }}>Nama Lengkap (Gelar)</label>
                    <input type="text" name="name" required placeholder="Contoh: Dr. Budi Santoso, Sp.PD"
                        value={formData.name} onChange={handleChange}
                        style={{ width:'100%', padding:'12px', borderRadius:'8px', border:'1px solid #e2e8f0' }}
                    />
                </div>

                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'15px', marginBottom:'15px' }}>
                    <div>
                        <label style={{ display:'block', marginBottom:'8px', fontWeight:'600', color:'#334155' }}>Email Login</label>
                        <input 
                            type="email" 
                            name="email" // ✅ Wajib lowercase
                            required 
                            placeholder="email@dokter.com"
                            autoComplete="off" // ✅ Biar gak stuck kena autofill
                            value={formData.email} 
                            onChange={handleChange}
                            style={{ width:'100%', padding:'12px', borderRadius:'8px', border:'1px solid #e2e8f0' }}
                        />
                    </div>
                    <div>
                        <label style={{ display:'block', marginBottom:'8px', fontWeight:'600', color:'#334155' }}>Nomor HP</label>
                        <input type="text" name="phone" required placeholder="0812..."
                            value={formData.phone} onChange={handleChange}
                            style={{ width:'100%', padding:'12px', borderRadius:'8px', border:'1px solid #e2e8f0' }}
                        />
                    </div>
                </div>

                <div style={{ marginBottom:'15px' }}>
                    <label style={{ display:'block', marginBottom:'8px', fontWeight:'600', color:'#334155' }}>Password</label>
                    <input 
                        type="password" 
                        name="password" // ✅ Wajib lowercase
                        required 
                        placeholder="Minimal 6 karakter"
                        autoComplete="new-password" // ✅ Biar password baru gak nyangkut
                        value={formData.password} 
                        onChange={handleChange}
                        style={{ width:'100%', padding:'12px', borderRadius:'8px', border:'1px solid #e2e8f0' }}
                    />
                </div>

                <hr style={{ margin:'30px 0', border:'none', borderTop:'1px dashed #cbd5e1' }} />

                <h3 style={{ fontSize:'18px', fontWeight:'bold', marginBottom:'20px', display:'flex', alignItems:'center', gap:'10px', color:'#334155' }}>
                    <Stethoscope size={20} color="#0ea5e9"/> Data Medis
                </h3>

                <div style={{ marginBottom:'15px' }}>
                    <label style={{ display:'block', marginBottom:'8px', fontWeight:'600', color:'#334155' }}>Spesialisasi</label>
                    <select name="specialization" value={formData.specialization} onChange={handleChange}
                        style={{ width:'100%', padding:'12px', borderRadius:'8px', border:'1px solid #e2e8f0', background:'white' }}>
                        <option value="Umum">Dokter Umum</option>
                        <option value="Gigi">Dokter Gigi</option>
                        <option value="Anak">Spesialis Anak</option>
                        <option value="Kandungan">Spesialis Kandungan</option>
                        <option value="Bedah">Spesialis Bedah</option>
                        <option value="Kulit">Spesialis Kulit</option>
                        <option value="Saraf">Spesialis Saraf</option>
                        <option value="Penyakit Dalam">Penyakit Dalam</option>
                        <option value="Mata">Spesialis Mata</option>
                        <option value="THT">Spesialis THT</option>
                    </select>
                </div>

                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'15px' }}>
                    <div>
                        <label style={{ display:'block', marginBottom:'8px', fontWeight:'600', color:'#334155' }}>Pengalaman (Tahun)</label>
                        <input 
                            type="number" 
                            name="experience_years" 
                            required 
                            placeholder="Contoh: 5"
                            min="0"
                            onKeyDown={(e) => { if(e.key === '-' || e.key === 'e') e.preventDefault() }}
                            value={formData.experience_years} 
                            onChange={handleChange}
                            style={{ width:'100%', padding:'12px', borderRadius:'8px', border:'1px solid #e2e8f0' }}
                        />
                    </div>
                    <div>
                        <label style={{ display:'block', marginBottom:'8px', fontWeight:'600', color:'#334155' }}>Biaya Konsultasi</label>
                        <input 
                            type="number" 
                            name="consultation_fee" 
                            required 
                            placeholder="Contoh: 50000"
                            min="0"
                            onKeyDown={(e) => { if(e.key === '-' || e.key === 'e') e.preventDefault() }}
                            value={formData.consultation_fee} 
                            onChange={handleChange}
                            style={{ width:'100%', padding:'12px', borderRadius:'8px', border:'1px solid #e2e8f0' }}
                        />
                    </div>
                </div>
            </div>

            {/* KOLOM KANAN: FOTO & TOMBOL */}
            <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
                <div style={{ background:'white', padding:'20px', borderRadius:'16px', boxShadow:'0 4px 20px rgba(0,0,0,0.05)', textAlign:'center' }}>
                    <label style={{ display:'block', marginBottom:'15px', fontWeight:'600', color:'#334155' }}>Foto Profil</label>
                    
                    <div style={{ position:'relative', width:'150px', height:'150px', margin:'0 auto', borderRadius:'50%', overflow:'hidden', border:'4px solid #f1f5f9', background:'#f8fafc' }}>
                        {preview ? (
                            <img src={preview} alt="Preview" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                        ) : (
                            <div style={{ width:'100%', height:'100%', display:'flex', justifyContent:'center', alignItems:'center', color:'#cbd5e1' }}>
                                <User size={60} />
                            </div>
                        )}
                        <input type="file" accept="image/*" onChange={handleFileChange} 
                            style={{ position:'absolute', top:0, left:0, width:'100%', height:'100%', opacity:0, cursor:'pointer' }}
                        />
                    </div>
                    <p style={{ marginTop:'10px', fontSize:'13px', color:'#64748b' }}>Klik foto untuk upload</p>
                </div>

                <button type="submit" disabled={loading}
                    style={{ 
                        width:'100%', padding:'14px', background:'#0ea5e9', color:'white', border:'none', borderRadius:'10px', 
                        fontSize:'16px', fontWeight:'bold', cursor: loading ? 'not-allowed' : 'pointer', 
                        display:'flex', justifyContent:'center', alignItems:'center', gap:'10px',
                        boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)'
                    }}
                >
                    {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                    {loading ? 'Menyimpan...' : 'Simpan Dokter'}
                </button>
            </div>

        </form>
    </div>
  );
}