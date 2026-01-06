import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Save, ArrowLeft, User, Stethoscope, Loader2 } from 'lucide-react';

export default function AdminDoctorEdit() {
  const navigate = useNavigate();
  const { id } = useParams(); // Ambil ID dari URL
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // State Form
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '', // Password kosongkan saja kalau tdk mau diganti
    specialization: '',
    experience_years: '',
    consultation_fee: '',
  });

  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);

  // 1. AMBIL DATA DOKTER LAMA
  useEffect(() => {
    const fetchDoctor = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/doctors/${id}`);
            const result = await response.json();
            
            if(result.data) {
                const doc = result.data;
                setFormData({
                    name: doc.user?.name || '',
                    email: doc.user?.email || '',
                    phone: doc.user?.phone || '',
                    password: '', // Biarkan kosong
                    specialization: doc.specialization,
                    experience_years: doc.experience_years,
                    consultation_fee: doc.consultation_fee,
                });
                setPreview(doc.image); // Tampilkan foto lama
            }
        } catch (error) {
            alert("Gagal mengambil data dokter");
        } finally {
            setInitialLoading(false);
        }
    };
    fetchDoctor();
  }, [id]);

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

  // 2. PROSES UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('phone', formData.phone);
    data.append('specialization', formData.specialization);
    data.append('experience_years', formData.experience_years);
    data.append('consultation_fee', formData.consultation_fee);
    
    // Kalau password diisi, kirim. Kalau kosong, jangan kirim.
    if(formData.password) {
        data.append('password', formData.password);
    }

    if (photo) {
        data.append('photo', photo);
    }

    // 🔥 TRIK LARAVEL: Method spoofing biar bisa upload file di PUT
    data.append('_method', 'PUT'); 

    try {
        const response = await fetch(`http://127.0.0.1:8000/api/doctors/${id}`, {
            method: 'POST', // Tetap POST, tapi bawa _method: PUT
            headers: {
                'Accept': 'application/json',
            },
            body: data,
        });

        const result = await response.json();

        if (response.ok) {
            alert('Data dokter berhasil diperbarui! 🎉');
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

  if (initialLoading) return <div style={{textAlign:'center', padding:'50px'}}>Loading data...</div>;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* HEADER */}
        <div style={{ display:'flex', alignItems:'center', gap:'15px', marginBottom:'30px' }}>
            <Link to="/admin/doctors" style={{ background:'white', padding:'10px', borderRadius:'50%', display:'flex', alignItems:'center', color:'#64748b', boxShadow:'0 2px 5px rgba(0,0,0,0.05)' }}>
                <ArrowLeft size={20} />
            </Link>
            <div>
                <h1 style={{ fontSize:'24px', fontWeight:'bold', color:'#1e293b' }}>Edit Dokter</h1>
                <p style={{ color:'#64748b' }}>Perbarui informasi dokter.</p>
            </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:'24px' }}>
            
            {/* KIRI: DATA UTAMA */}
            <div style={{ background:'white', padding:'30px', borderRadius:'16px', boxShadow:'0 4px 20px rgba(0,0,0,0.05)' }}>
                <h3 style={{ fontSize:'18px', fontWeight:'bold', marginBottom:'20px', display:'flex', alignItems:'center', gap:'10px', color:'#334155' }}>
                    <User size={20} color="#0ea5e9"/> Akun & Biodata
                </h3>

                <div style={{ marginBottom:'15px' }}>
                    <label style={{ display:'block', marginBottom:'8px', fontWeight:'600', color:'#334155' }}>Nama Lengkap</label>
                    <input type="text" name="name" required value={formData.name} onChange={handleChange}
                        style={{ width:'100%', padding:'12px', borderRadius:'8px', border:'1px solid #e2e8f0' }} />
                </div>

                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'15px', marginBottom:'15px' }}>
                    <div>
                        <label style={{ display:'block', marginBottom:'8px', fontWeight:'600', color:'#334155' }}>Email</label>
                        <input type="email" name="email" required value={formData.email} onChange={handleChange}
                            style={{ width:'100%', padding:'12px', borderRadius:'8px', border:'1px solid #e2e8f0' }} />
                    </div>
                    <div>
                        <label style={{ display:'block', marginBottom:'8px', fontWeight:'600', color:'#334155' }}>No HP</label>
                        <input type="text" name="phone" required value={formData.phone} onChange={handleChange}
                            style={{ width:'100%', padding:'12px', borderRadius:'8px', border:'1px solid #e2e8f0' }} />
                    </div>
                </div>

                <div style={{ marginBottom:'15px' }}>
                    <label style={{ display:'block', marginBottom:'8px', fontWeight:'600', color:'#334155' }}>Password (Opsional)</label>
                    <input type="password" name="password" placeholder="Isi jika ingin mengganti password"
                        value={formData.password} onChange={handleChange}
                        style={{ width:'100%', padding:'12px', borderRadius:'8px', border:'1px solid #e2e8f0' }} />
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
                        <input type="number" name="experience_years" required min="0" value={formData.experience_years} onChange={handleChange}
                            style={{ width:'100%', padding:'12px', borderRadius:'8px', border:'1px solid #e2e8f0' }} />
                    </div>
                    <div>
                        <label style={{ display:'block', marginBottom:'8px', fontWeight:'600', color:'#334155' }}>Biaya Konsultasi</label>
                        <input type="number" name="consultation_fee" required min="0" value={formData.consultation_fee} onChange={handleChange}
                            style={{ width:'100%', padding:'12px', borderRadius:'8px', border:'1px solid #e2e8f0' }} />
                    </div>
                </div>
            </div>

            {/* KANAN: FOTO */}
            <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
                <div style={{ background:'white', padding:'20px', borderRadius:'16px', boxShadow:'0 4px 20px rgba(0,0,0,0.05)', textAlign:'center' }}>
                    <label style={{ display:'block', marginBottom:'15px', fontWeight:'600', color:'#334155' }}>Foto Profil</label>
                    <div style={{ position:'relative', width:'150px', height:'150px', margin:'0 auto', borderRadius:'50%', overflow:'hidden', border:'4px solid #f1f5f9', background:'#f8fafc' }}>
                        {preview ? <img src={preview} alt="Preview" style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : <User size={60} />}
                        <input type="file" accept="image/*" onChange={handleFileChange} style={{ position:'absolute', top:0, left:0, width:'100%', height:'100%', opacity:0, cursor:'pointer' }} />
                    </div>
                    <p style={{ marginTop:'10px', fontSize:'13px', color:'#64748b' }}>Klik foto untuk ganti</p>
                </div>

                <button type="submit" disabled={loading} style={{ width:'100%', padding:'14px', background:'#0ea5e9', color:'white', border:'none', borderRadius:'10px', fontSize:'16px', fontWeight:'bold', cursor: loading ? 'not-allowed' : 'pointer', display:'flex', justifyContent:'center', alignItems:'center', gap:'10px' }}>
                    {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                    {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
            </div>
        </form>
    </div>
  );
}