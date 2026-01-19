import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/header';
import Footer from '../components/Footer'; // Jangan lupa Footer biar rapi
import { Loader2, ArrowLeft } from 'lucide-react';

const DoctorDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- 1. FETCH DATA DETAIL ---
    useEffect(() => {
        const fetchDoctor = async () => {
            try {
                // Fetch ulang detail biar datanya fresh dari DB
                const response = await fetch(`http://127.0.0.1:8000/api/doctors/${id}`);
                const result = await response.json();
                
                if (response.ok) {
                    // Handle format data (wrapper .data atau langsung)
                    setDoctor(result.data ? result.data : result);
                } else {
                    throw new Error('Data tidak ditemukan');
                }
            } catch (err) {
                setError("Gagal mengambil data dokter.");
            } finally {
                setLoading(false);
            }
        };
        fetchDoctor();
    }, [id]);

    // --- 2. HANDLE BOOKING (MASUK KE CHECKOUT) ---
    const handleBook = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert("Silakan login dulu ya untuk konsultasi!");
            navigate('/login');
            return;
        }

        navigate('/booking-checkout', {
            state: {
                doctor: {
                    id: doctor.id, 
                    user_id: doctor.user_id || doctor.user?.id,
                    name: doctor.user?.name || doctor.name,
                    specialist: doctor.specialization || doctor.specialist,
                    image: doctor.image,
                    hospital: doctor.hospital || "HaloHealth Hospital",
                    price: doctor.consultation_fee || doctor.price || 50000,
                    experience_years: doctor.experience_years
                }
            }
        });
    };

    // --- 3. HELPER GAMBAR (SOLUSI FOTO GA SINKRON) ---
    const getImageUrl = (path) => {
        // 1. Kalau path kosong/null, pakai placeholder netral (logo medis)
        if (!path) return "https://cdn-icons-png.flaticon.com/512/3774/3774299.png";
        
        // 2. Kalau path sudah lengkap (https://...), pakai langsung
        if (path.startsWith('http')) return path;
        
        // 3. Kalau path lokal, sambungin ke backend (dan bersihkan slash depan biar gak double)
        return `http://127.0.0.1:8000/${path.replace(/^\//, '')}`;
    };

    const mainBlue = '#0ea5e9';

    // --- RENDER ---
    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: '10px' }}>
            <Loader2 className="animate-spin" color={mainBlue} size={40} />
            <p style={{ color: '#64748b' }}>Memuat profil dokter...</p>
        </div>
    );

    if (error || !doctor) return (
        <div style={{ textAlign: 'center', marginTop: '100px', padding: '20px' }}>
            <h3 style={{ color: '#ef4444' }}>{error || "Dokter tidak ditemukan"}</h3>
            <button onClick={() => navigate(-1)} style={{ marginTop: '10px', padding: '10px 20px', border: '1px solid #ddd', background: 'white', borderRadius: '8px', cursor: 'pointer' }}>Kembali</button>
        </div>
    );

    return (
        <div className="page-fade" style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: '"Inter", sans-serif', display: 'flex', flexDirection: 'column' }}>
            <Header />
            
            <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '120px 20px 60px', flex: 1, width: '100%' }}>
                
                {/* TOMBOL KEMBALI */}
                <button 
                    onClick={() => navigate(-1)} 
                    style={{ marginBottom: '20px', padding: '10px 20px', borderRadius: '10px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontWeight:'600', color:'#64748b', display:'flex', alignItems:'center', gap:'8px', transition: '0.2s' }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#f1f5f9'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'white'}
                > 
                    <ArrowLeft size={18} /> Kembali 
                </button>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '30px', alignItems: 'start' }}>
                    
                    {/* === KARTU PROFIL KIRI === */}
                    <div style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', border: '1px solid #e2e8f0', textAlign: 'center', paddingBottom: '30px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)' }}>
                        {/* Header Gradient */}
                        <div style={{ height: '120px', background: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)' }}></div>
                        
                        {/* Foto Profil */}
                        <div style={{ position: 'relative', width: '140px', height: '140px', margin: '-70px auto 15px' }}>
                            <img 
                                src={getImageUrl(doctor.image)} 
                                style={{ width: '100%', height: '100%', borderRadius: '50%', border: '5px solid white', objectFit: 'cover', background: 'white', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} 
                                alt="profile" 
                                onError={(e) => { e.target.src = "https://cdn-icons-png.flaticon.com/512/3774/3774299.png" }}
                            />
                        </div>
                        
                        <h2 style={{ margin: '0 0 5px', fontSize: '24px', fontWeight: 'bold', color: '#1e293b' }}>
                            {doctor.user?.name || doctor.name}
                        </h2>
                        <span style={{ color: mainBlue, fontWeight: 'bold', fontSize: '13px', background: '#e0f2fe', padding: '6px 15px', borderRadius: '20px', display:'inline-block', marginTop:'5px' }}>
                            {doctor.specialization || doctor.specialist}
                        </span>
                        
                        {/* Info Singkat */}
                        <div style={{ padding: '0 25px', marginTop: '30px' }}>
                            <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '20px', border: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                                    <span style={{ color: '#64748b' }}>Pengalaman</span>
                                    <span style={{ fontWeight: 'bold', color: '#334155' }}>{doctor.experience_years || '5'} Tahun</span>
                                </div>
                                <div style={{ width: '100%', height: '1px', background: '#e2e8f0' }}></div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', alignItems: 'center' }}>
                                    <span style={{ color: '#64748b' }}>Biaya</span>
                                    <span style={{ fontWeight: 'bold', color: '#0ea5e9', fontSize: '18px' }}>
                                        Rp {(doctor.consultation_fee || doctor.price || 50000).toLocaleString('id-ID')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={handleBook} 
                            style={{ margin: '25px 25px 0', width: 'calc(100% - 50px)', padding: '16px', background: mainBlue, color: 'white', border: 'none', borderRadius: '14px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', boxShadow: '0 10px 20px rgba(14, 165, 233, 0.25)', transition: '0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                        >
                            Chat Dokter Sekarang
                        </button>
                    </div>

                    {/* === DETAIL INFO KANAN === */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                        
                        {/* Box Tentang */}
                        <div style={{ background: 'white', padding: '30px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                            <h3 style={{ marginBottom: '15px', color: '#1e293b', fontSize: '18px', borderBottom: '2px solid #f1f5f9', paddingBottom: '15px' }}>Tentang Dokter</h3>
                            <p style={{ color: '#475569', lineHeight: '1.8', fontSize: '15px', margin: 0 }}>
                                {doctor.user?.name || doctor.name} adalah seorang dokter spesialis <strong>{doctor.specialization || doctor.specialist}</strong> yang berdedikasi tinggi. 
                                Beliau telah berpengalaman selama lebih dari {doctor.experience_years || 'beberapa'} tahun dalam menangani berbagai keluhan pasien dengan pendekatan yang ramah dan solutif.
                            </p>
                        </div>

                        {/* Box Jadwal */}
                        <div style={{ background: 'white', padding: '30px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                            <h4 style={{ marginBottom: '20px', color: '#1e293b', fontSize: '18px', borderBottom: '2px solid #f1f5f9', paddingBottom: '15px' }}>Jadwal & Tempat Praktik</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
                                <div style={{ padding: '15px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                                    <p style={{ color: '#94a3b8', margin: '0 0 5px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' }}>Hari Praktik</p>
                                    <p style={{ fontWeight: 'bold', margin: 0, color: '#334155' }}>Senin - Jumat</p>
                                </div>
                                <div style={{ padding: '15px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                                    <p style={{ color: '#94a3b8', margin: '0 0 5px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' }}>Jam Kerja</p>
                                    <p style={{ fontWeight: 'bold', margin: 0, color: '#334155' }}>08:00 - 17:00 WIB</p>
                                </div>
                                <div style={{ padding: '15px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                                    <p style={{ color: '#94a3b8', margin: '0 0 5px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' }}>Lokasi</p>
                                    <p style={{ fontWeight: 'bold', margin: 0, color: '#334155' }}>{doctor.hospital || "HaloHealth Hospital"}</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default DoctorDetail;