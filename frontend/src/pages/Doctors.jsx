import { useState } from 'react';
import Header from '../components/header';
import '../App.css'; 

export default function Doctors() {
  const [searchTerm, setSearchTerm] = useState("");
  
  // DATA KATEGORI (Sesuai gambar referensi kamu)
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

  // DATA DOKTER DUMMY (Akan muncul di bawah)
  const doctorsList = [
    { id: 1, name: "dr. Budi Santoso", sp: "Dokter Umum", price: "Rp 35.000", image: "👨‍⚕️", rating: "4.8" },
    { id: 2, name: "dr. Siti Aminah", sp: "Spesialis Anak", price: "Rp 50.000", image: "👩‍⚕️", rating: "4.9" },
    { id: 3, name: "dr. Tirta KW", sp: "Spesialis Kulit", price: "Rp 75.000", image: "👨‍⚕️", rating: "5.0" },
  ];

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <Header />

      <div className="container" style={{ padding: '40px 20px', display: 'flex', flexWrap: 'wrap', gap: '50px' }}>
        
        {/* BAGIAN KIRI: PROMOSI (Sesuai Gambar) */}
        <div style={{ flex: '1', minWidth: '300px' }}>
            <h2 style={{ color: '#be123c', fontSize: '24px', marginBottom: '10px' }}>Chat Dokter di HaloHealth</h2>
            <p style={{ color: '#666', lineHeight: '1.6' }}>
                Layanan telemedisin yang siap siaga untuk bantu kamu hidup lebih sehat.
            </p>
            
            {/* Ilustrasi Kartun (Placeholder) */}
            <div style={{ 
                margin: '30px 0', 
                height: '200px', 
                background: '#f0f9ff', 
                borderRadius: '20px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: '80px'
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

        {/* BAGIAN KANAN: MENU SPESIALIS (GRID) */}
        <div style={{ flex: '2', minWidth: '350px' }}>
            
            {/* Search Bar Panjang */}
            <div style={{ marginBottom: '30px' }}>
                <input 
                    type="text" 
                    placeholder="Cari dokter, spesialis atau gejala..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '15px 20px',
                        borderRadius: '8px',
                        border: '1px solid #ddd',
                        background: '#f8fafc',
                        fontSize: '16px',
                        outline: 'none'
                    }}
                />
            </div>

            <h3 style={{ color: '#333', marginBottom: '20px' }}>Cari Dokter atau Spesialisasi</h3>

            {/* Grid Icon Bulat-Bulat */}
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', 
                gap: '20px',
                textAlign: 'center'
            }}>
                {categories.map((cat, index) => (
                    <div key={index} className="category-item" style={{ cursor: 'pointer' }}>
                        <div style={{ 
                            width: '70px', 
                            height: '70px', 
                            background: 'white', 
                            borderRadius: '50%', 
                            border: '1px solid #e2e8f0',
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            fontSize: '30px',
                            margin: '0 auto 10px auto',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                            transition: 'all 0.3s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#0ea5e9';
                            e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = '#e2e8f0';
                            e.currentTarget.style.transform = 'scale(1)';
                        }}
                        >
                            {cat.icon}
                        </div>
                        <span style={{ fontSize: '13px', color: '#475569', fontWeight: '500' }}>{cat.name}</span>
                    </div>
                ))}
            </div>

            {/* List Dokter (Opsional: Muncul di bawah kategori) */}
            <div style={{ marginTop: '50px', borderTop: '1px solid #eee', paddingTop: '30px' }}>
                <h3 style={{ marginBottom: '20px' }}>Rekomendasi Dokter</h3>
                <div style={{ display: 'grid', gap: '15px' }}>
                    {doctorsList.map(doc => (
                        <div key={doc.id} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '15px',
                            padding: '15px',
                            border: '1px solid #f1f5f9',
                            borderRadius: '10px',
                            background: 'white'
                        }}>
                            <div style={{ fontSize: '30px', background: '#e0f2fe', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                {doc.image}
                            </div>
                            <div style={{ flex: 1 }}>
                                <h4 style={{ margin: 0, fontSize: '16px' }}>{doc.name}</h4>
                                <small style={{ color: '#0ea5e9' }}>{doc.sp}</small>
                            </div>
                            <button style={{
                                background: '#e11d48',
                                color: 'white',
                                border: 'none',
                                padding: '8px 20px',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}>Chat</button>
                        </div>
                    ))}
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}