import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Biar bisa diklik ke detail
import Header from '../components/header';
import '../App.css'; 

export default function Doctors() {
  const [searchTerm, setSearchTerm] = useState("");
  const [doctorsList, setDoctorsList] = useState([]); // Ubah jadi State kosong
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // 1. DATA KATEGORI (TETAP SAMA)
  const categories = [
    { name: 'Dokter Umum', icon: '👨‍⚕️' },
    { name: 'Spesialis Anak', icon: '👶' },
    { name: 'Spesialis Kulit', icon: '✨' },
    { name: 'Penyakit Dalam', icon: '🫁' },
    { name: 'Spesialis Kandungan', icon: '🤰' },
    { name: 'Spesialis THT', icon: '👂' },
    { name: 'Kesehatan Jiwa', icon: '🧠' },
    { name: 'Dokter Gigi', icon: '🦷' },
    { name: 'Dokter Hewan', icon: '🐱' },
    { name: 'Spesialis Mata', icon: '👁️' },
  ];

  // 2. AMBIL DATA DARI BACKEND TEMANMU
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/doctors');
        const data = await response.json();
        
        if (Array.isArray(data)) {
            setDoctorsList(data);
        } else if (data.data) {
            setDoctorsList(data.data);
        }
      } catch (error) {
        console.error("Gagal ambil data dokter:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  // 3. FILTER PENCARIAN
  const filteredDoctors = doctorsList.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (doc.specialist && doc.specialist.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <Header />

      <div className="container" style={{ padding: '40px 20px', display: 'flex', flexWrap: 'wrap', gap: '50px' }}>
        
        {/* BAGIAN KIRI: PROMOSI (TETAP SAMA) */}
        <div style={{ flex: '1', minWidth: '300px' }}>
            <h2 style={{ color: '#0ea5e9', fontSize: '24px', marginBottom: '10px' }}>Chat Dokter di HaloHealth</h2>
            <p style={{ color: '#64748b', lineHeight: '1.6' }}>
                Layanan telemedisin yang siap siaga untuk bantu kamu hidup lebih sehat.
            </p>
            
            <div style={{ 
                margin: '30px 0', height: '200px', background: '#f0f9ff', borderRadius: '20px', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '80px'
            }}>
                👨‍⚕️👩‍⚕️🩺
            </div>

            <div style={{ marginTop: '30px' }}>
                <h4 style={{ color: '#333' }}>Mengapa Chat Dokter di HaloHealth?</h4>
                <ul style={{ listStyle: 'none', padding: 0, marginTop: '15px' }}>
                    <li style={{ marginBottom: '15px', display: 'flex', gap: '10px', alignItems: 'start', color: '#555' }}>
                        ✅ <span>Satu aplikasi untuk berbagai kebutuhan kesehatan.</span>
                    </li>
                    <li style={{ marginBottom: '15px', display: 'flex', gap: '10px', alignItems: 'start', color: '#555' }}>
                        ✅ <span>Dapatkan rujukan ke pemeriksaan offline di RS.</span>
                    </li>
                    <li style={{ marginBottom: '15px', display: 'flex', gap: '10px', alignItems: 'start', color: '#555' }}>
                        ✅ <span>Terintegrasi dengan asuransi kesehatanmu.</span>
                    </li>
                </ul>
            </div>
        </div>

        {/* BAGIAN KANAN: MENU & GRID DOKTER (DARI DATABASE) */}
        <div style={{ flex: '2', minWidth: '350px' }}>
            
            {/* Search Bar */}
            <div style={{ marginBottom: '30px' }}>
                <input 
                    type="text" 
                    placeholder="Cari dokter, spesialis atau gejala..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        width: '100%', padding: '15px 20px', borderRadius: '8px',
                        border: '1px solid #ddd', background: '#f8fafc', fontSize: '16px', outline: 'none'
                    }}
                />
            </div>

            <h3 style={{ color: '#333', marginBottom: '20px' }}>Cari Dokter atau Spesialisasi</h3>

            {/* Grid Kategori */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '20px', textAlign: 'center' }}>
                {categories.map((cat, index) => (
                    <div key={index} className="category-item" style={{ cursor: 'pointer' }}>
                        <div style={{ 
                            width: '70px', height: '70px', background: 'white', borderRadius: '50%', 
                            border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '30px', margin: '0 auto 10px auto', boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                            transition: 'all 0.3s'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#0ea5e9'; e.currentTarget.style.transform = 'scale(1.05)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.transform = 'scale(1)'; }}
                        >
                            {cat.icon}
                        </div>
                        <span style={{ fontSize: '13px', color: '#475569', fontWeight: '500' }}>{cat.name}</span>
                    </div>
                ))}
            </div>

            {/* List Dokter (DATA ASLI DATABASE) */}
            <div style={{ marginTop: '50px', borderTop: '1px solid #eee', paddingTop: '30px' }}>
                <h3 style={{ marginBottom: '20px' }}>Rekomendasi Dokter</h3>
                
                {loading ? <p>Sedang memuat data...</p> : (
                    <div style={{ display: 'grid', gap: '15px' }}>
                        {filteredDoctors.length > 0 ? filteredDoctors.map(doc => (
                            <div key={doc.id} style={{
                                display: 'flex', alignItems: 'center', gap: '15px', padding: '15px',
                                border: '1px solid #f1f5f9', borderRadius: '10px', background: 'white',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.02)'
                            }}>
                                {/* Foto Dokter (Handle kalau null) */}
                                <div style={{ width: '60px', height: '60px', borderRadius: '50%', overflow: 'hidden', background: '#e0f2fe' }}>
                                     <img 
                                        src={doc.image || "https://cdn-icons-png.flaticon.com/512/3774/3774299.png"} 
                                        alt={doc.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        onError={(e) => {e.target.src = "https://cdn-icons-png.flaticon.com/512/3774/3774299.png"}}
                                     />
                                </div>
                                
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ margin: 0, fontSize: '16px', color: '#0f172a' }}>{doc.name}</h4>
                                    <small style={{ color: '#0ea5e9', fontWeight: 'bold' }}>{doc.specialist || 'Umum'}</small>
                                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                                        Rp {parseInt(doc.price || 0).toLocaleString('id-ID')}
                                    </div>
                                </div>
                                
                                <button 
                                    onClick={() => navigate(`/doctor/${doc.id}`)} // Nanti buat halaman detail
                                    style={{
                                        background: '#0ea5e9', color: 'white', border: 'none', padding: '10px 20px',
                                        borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'
                                    }}
                                >
                                    Chat
                                </button>
                            </div>
                        )) : <p>Tidak ada dokter ditemukan.</p>}
                    </div>
                )}
            </div>

        </div>
      </div>
    </div>
  );
}