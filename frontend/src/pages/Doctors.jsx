import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/header';
import '../App.css'; 

export default function Doctors() {
  const [searchTerm, setSearchTerm] = useState("");
  const [doctorsList, setDoctorsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // 1. DATA KATEGORI (Icon Lucide)
  const categories = [
    { name: 'Dokter Umum', icon: 'stethoscope' },
    { name: 'Spesialis Anak', icon: 'baby' },
    { name: 'Spesialis Kulit', icon: 'sparkles' },
    { name: 'Penyakit Dalam', icon: 'activity' },
    { name: 'Kandungan', icon: 'heart-handshake' },
    { name: 'Spesialis THT', icon: 'ear' },
    { name: 'Kesehatan Jiwa', icon: 'brain' },
    { name: 'Dokter Gigi', icon: 'smile' },
    { name: 'Dokter Hewan', icon: 'paw-print' },
    { name: 'Spesialis Mata', icon: 'eye' },
  ];

  // 2. AMBIL DATA DARI BACKEND
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
        
        {/* BAGIAN KIRI: PROMOSI */}
        <div style={{ flex: '1', minWidth: '300px' }}>
            <h2 style={{ color: '#0ea5e9', fontSize: '24px', marginBottom: '10px' }}>Chat Dokter di HaloHealth</h2>
            <p style={{ color: '#64748b', lineHeight: '1.6' }}>
                Layanan telemedisin yang siap siaga untuk bantu kamu hidup lebih sehat.
            </p>
            
            {/* 👇 BAGIAN INI YANG DIUBAH JADI FOTO ASLI 👇 */}
            <div style={{ 
                margin: '30px 0', 
                height: '220px', // Tingginya aku tambah dikit biar lega
                borderRadius: '20px',
                // Pakai foto dokter telekonsultasi sebagai background
                backgroundImage: 'url(https://img.freepik.com/free-photo/female-doctor-using-tablet-computer-talking-with-patients-online_1098-18693.jpg)',
                backgroundSize: 'cover', // Biar fotonya nge-pas menuhin kotak
                backgroundPosition: 'center center',
                boxShadow: '0 10px 25px -5px rgba(14, 165, 233, 0.15)' // Kasih bayangan biru tipis biar timbul
            }}>
                {/* Icon img yang lama DIHAPUS */}
            </div>
            {/* 👆 SELESAI UBAH 👆 */}

            <div style={{ marginTop: '30px' }}>
                <h4 style={{ color: '#333' }}>Mengapa Chat Dokter di HaloHealth?</h4>
                <ul style={{ listStyle: 'none', padding: 0, marginTop: '15px' }}>
                    {['Satu aplikasi untuk berbagai kebutuhan kesehatan.', 'Dapatkan rujukan ke pemeriksaan offline di RS.', 'Terintegrasi dengan asuransi kesehatanmu.'].map((text, idx) => (
                        <li key={idx} style={{ marginBottom: '15px', display: 'flex', gap: '10px', alignItems: 'center', color: '#555' }}>
                            {/* Icon Check */}
                            <img src="https://unpkg.com/lucide-static@latest/icons/check-circle-2.svg" style={{ width: '20px', color: '#0ea5e9' }} alt="check" />
                            <span>{text}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>

        {/* BAGIAN KANAN: MENU & GRID DOKTER (TETAP SAMA) */}
        <div style={{ flex: '2', minWidth: '350px' }}>
            
            {/* Search Bar */}
            <div style={{ marginBottom: '30px', position: 'relative' }}>
                <input 
                    type="text" 
                    placeholder="Cari dokter, spesialis atau gejala..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        width: '100%', padding: '15px 20px 15px 45px', borderRadius: '8px',
                        border: '1px solid #ddd', background: '#f8fafc', fontSize: '16px', outline: 'none'
                    }}
                />
                <img 
                    src="https://unpkg.com/lucide-static@latest/icons/search.svg" 
                    style={{ position: 'absolute', left: '15px', top: '15px', width: '20px', opacity: 0.4 }} 
                    alt="search"
                />
            </div>

            <h3 style={{ color: '#333', marginBottom: '20px' }}>Cari Dokter atau Spesialisasi</h3>

            {/* Grid Kategori dengan Icon Lucide */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: '15px', textAlign: 'center' }}>
                {categories.map((cat, index) => (
                    <div key={index} className="category-item" style={{ cursor: 'pointer' }}>
                        <div style={{ 
                            width: '60px', height: '60px', background: 'white', borderRadius: '15px', 
                            border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 10px auto', boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                            transition: 'all 0.3s'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#0ea5e9'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.transform = 'translateY(0)'; }}
                        >
                            <img 
                                src={`https://unpkg.com/lucide-static@latest/icons/${cat.icon}.svg`} 
                                style={{ width: '24px', height: '24px', opacity: 0.7 }} 
                                alt={cat.name}
                            />
                        </div>
                        <span style={{ fontSize: '12px', color: '#475569', fontWeight: '500' }}>{cat.name}</span>
                    </div>
                ))}
            </div>

            {/* List Dokter */}
            <div style={{ marginTop: '50px', borderTop: '1px solid #eee', paddingTop: '30px' }}>
                <h3 style={{ marginBottom: '20px' }}>Rekomendasi Dokter</h3>
                
                {loading ? <p>Sedang memuat data...</p> : (
                    <div style={{ display: 'grid', gap: '15px' }}>
                        {filteredDoctors.length > 0 ? filteredDoctors.map(doc => (
                            <div key={doc.id} style={{
                                display: 'flex', alignItems: 'center', gap: '15px', padding: '15px',
                                border: '1px solid #f1f5f9', borderRadius: '12px', background: 'white',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.02)'
                            }}>
                                {/* Foto Dokter */}
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
                                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px', display:'flex', alignItems:'center', gap:'4px' }}>
                                        <img src="https://unpkg.com/lucide-static@latest/icons/banknote.svg" style={{width:'12px', opacity:0.5}}/>
                                        Rp {parseInt(doc.price || 0).toLocaleString('id-ID')}
                                    </div>
                                </div>
                                
                                <button 
                                    onClick={() => navigate(`/doctors/${doc.id}`)}
                                    style={{
                                        background: '#0ea5e9', color: 'white', border: 'none', padding: '10px 16px',
                                        borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px',
                                        display: 'flex', alignItems: 'center', gap: '6px'
                                    }}
                                >
                                    <img src="https://unpkg.com/lucide-static@latest/icons/message-circle.svg" style={{width:'16px', filter: 'brightness(0) invert(1)'}}/>
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