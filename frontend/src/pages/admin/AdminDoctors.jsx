import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2, Search, Stethoscope, Loader2, Pencil } from 'lucide-react'; 

export default function AdminDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Ambil Data
  const fetchDoctors = async () => {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/doctors');
        const result = await response.json();
        const dataArray = (result.data ? result.data : result);
        setDoctors(Array.isArray(dataArray) ? dataArray : []);
    } catch (error) {
        console.error("Error:", error);
        setDoctors([]); 
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  // Hapus Data
  const handleDelete = async (id) => {
    if(!confirm("Yakin hapus dokter ini? Akun loginnya juga akan terhapus.")) return;
    
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/doctors/${id}`, { method: 'DELETE' });
        if(response.ok) {
            alert("Dokter berhasil dihapus");
            fetchDoctors();
        }
    } catch (error) {
        alert("Gagal menghapus");
    }
  };

  // Filter Data
  const filteredDoctors = doctors.filter(item => {
    const doctorName = item.user?.name || ""; 
    const doctorSpec = item.specialization || ""; 
    
    return doctorName.toLowerCase().includes(search.toLowerCase()) || 
           doctorSpec.toLowerCase().includes(search.toLowerCase());
  });

  // 🔥 FUNGSI SAKTI: PERBAIKI URL GAMBAR
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    // Kalau link sudah lengkap (ada http), pakai langsung
    if (imagePath.startsWith('http')) return imagePath; 
    // Kalau link buntung, tambahkan alamat server manual
    return `http://127.0.0.1:8000/storage/${imagePath.replace('public/', '')}`;
  };

  return (
    <div>
        {/* HEADER */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px' }}>
            <div>
                <h1 style={{ fontSize:'24px', fontWeight:'bold', color:'#1e293b' }}>Kelola Dokter</h1>
                <p style={{ color:'#64748b' }}>Data tim medis HaloHealth.</p>
            </div>
            <Link to="/admin/doctors/create" style={{ background:'#0ea5e9', color:'white', padding:'10px 16px', borderRadius:'8px', textDecoration:'none', display:'flex', alignItems:'center', gap:'8px', fontWeight:'600' }}>
                <Plus size={18} /> Tambah Dokter
            </Link>
        </div>

        {/* SEARCH */}
        <div style={{ background:'white', padding:'16px', borderRadius:'12px', boxShadow:'0 2px 5px rgba(0,0,0,0.05)', marginBottom:'20px', display:'flex', alignItems:'center', gap:'10px' }}>
            <Search size={20} color="#94a3b8" />
            <input 
                type="text" placeholder="Cari nama atau spesialis..." 
                value={search} onChange={(e) => setSearch(e.target.value)}
                style={{ border:'none', outline:'none', width:'100%', fontSize:'14px' }}
            />
        </div>

        {/* TABEL */}
        <div style={{ background:'white', borderRadius:'12px', overflow:'hidden', boxShadow:'0 4px 6px rgba(0,0,0,0.05)' }}>
            {loading ? (
                <div style={{ padding:'40px', textAlign:'center' }}><Loader2 className="animate-spin" style={{margin:'0 auto'}} color="#0ea5e9"/></div>
            ) : (
                <table style={{ width:'100%', borderCollapse:'collapse', textAlign:'left' }}>
                    <thead style={{ background:'#f8fafc', borderBottom:'1px solid #e2e8f0' }}>
                        <tr>
                            <th style={{ padding:'16px', color:'#64748b' }}>Dokter</th>
                            <th style={{ padding:'16px', color:'#64748b' }}>Spesialisasi</th>
                            <th style={{ padding:'16px', color:'#64748b' }}>Pengalaman</th>
                            <th style={{ padding:'16px', color:'#64748b' }}>Tarif</th>
                            <th style={{ padding:'16px', color:'#64748b', textAlign:'center' }}>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredDoctors.length > 0 ? filteredDoctors.map((item) => (
                            <tr key={item.id} style={{ borderBottom:'1px solid #f1f5f9' }}>
                                <td style={{ padding:'16px', display:'flex', alignItems:'center', gap:'12px' }}>
                                    
                                    {/* 👇 BAGIAN FOTO YANG SUDAH DIPERBAIKI LOGIKANYA */}
                                    <div style={{ width:'40px', height:'40px', borderRadius:'50%', background:'#e2e8f0', overflow:'hidden', display:'flex', justifyContent:'center', alignItems:'center', flexShrink:0 }}>
                                        {item.image ? (
                                            <img 
                                                src={getImageUrl(item.image)} 
                                                alt="doc" 
                                                style={{ width:'100%', height:'100%', objectFit:'cover' }} 
                                                // Kalau gambar masih error juga, ganti jadi icon (Fallback)
                                                onError={(e) => {
                                                    e.target.onerror = null; 
                                                    e.target.style.display = 'none'; // Sembunyikan img yang rusak
                                                    // Ganti parent-nya dengan SVG Stetoskop
                                                    e.target.parentNode.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/></svg>';
                                                }}
                                            />
                                        ) : (
                                            <Stethoscope size={20} color="#94a3b8" />
                                        )}
                                    </div>

                                    <div>
                                        <div style={{ fontWeight:'600', color:'#1e293b' }}>{item.user?.name || 'Tanpa Nama'}</div>
                                        <div style={{ fontSize:'12px', color:'#94a3b8' }}>{item.user?.email || '-'}</div>
                                    </div>
                                </td>
                                <td style={{ padding:'16px' }}>
                                    <span style={{ background:'#dcfce7', color:'#166534', padding:'4px 10px', borderRadius:'20px', fontSize:'12px', fontWeight:'600' }}>
                                        {item.specialization}
                                    </span>
                                </td>
                                <td style={{ padding:'16px', color:'#64748b' }}>{item.experience_years} Tahun</td>
                                <td style={{ padding:'16px', fontWeight:'bold', color:'#0ea5e9' }}>
                                    Rp {(item.consultation_fee || 0).toLocaleString()}
                                </td>
                                
                                <td style={{ padding:'16px', textAlign:'center' }}>
                                    <div style={{ display:'flex', justifyContent:'center', gap:'8px' }}>
                                        <Link to={`/admin/doctors/edit/${item.id}`} style={{ background:'#e0f2fe', border:'none', padding:'8px', borderRadius:'6px', cursor:'pointer', color:'#0284c7', display:'flex', alignItems:'center' }}>
                                            <Pencil size={16} />
                                        </Link>
                                        <button onClick={() => handleDelete(item.id)} style={{ background:'#fee2e2', border:'none', padding:'8px', borderRadius:'6px', cursor:'pointer', color:'#ef4444', display:'flex', alignItems:'center' }}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>

                            </tr>
                        )) : (
                             <tr>
                                <td colSpan="5" style={{ padding:'30px', textAlign:'center', color:'#94a3b8' }}>Belum ada data dokter.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    </div>
  );
}