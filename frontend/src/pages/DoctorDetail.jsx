import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/header'; 

const DoctorDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDoctor = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/doctors/${id}`);
                const result = await response.json();
                
                if (response.ok) {
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

    const handleBook = () => {
        // Cek Login
        const token = localStorage.getItem('token');
        if (!token) {
            alert("Silakan login dulu ya untuk konsultasi!");
            navigate('/login');
            return;
        }

        // 🔥 PENTING: Kirim data lengkap ke Booking Checkout
        // Kita pastikan user_id terbawa karena ini kunci buat masuk Room Chat nanti
        navigate('/booking-checkout', {
            state: {
                doctor: {
                    id: doctor.id, 
                    user_id: doctor.user_id || doctor.user?.id, // ID User Dokter (Penting buat Chat)
                    name: doctor.user?.name || doctor.name,
                    specialist: doctor.specialization,
                    image: doctor.image,
                    hospital: "HaloHealth Hospital",
                    price: doctor.consultation_fee,
                    experience_years: doctor.experience_years
                }
            }
        });
    };

    if (loading) return <div style={{ textAlign: 'center', marginTop: '100px', color: '#0ea5e9' }}>Memuat profil dokter...</div>;
    if (error) return <div style={{ textAlign: 'center', marginTop: '100px', color: 'red' }}>{error}</div>;

    const mainBlue = '#0ea5e9';

    // Logic Gambar
    const imageUrl = doctor.image 
        ? `http://127.0.0.1:8000${doctor.image}` 
        : "https://cdn-icons-png.flaticon.com/512/3774/3774299.png";

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: '"Inter", sans-serif' }}>
            <Header />
            
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '100px 20px 40px' }}>
                <button 
                    onClick={() => navigate(-1)} 
                    style={{ marginBottom: '20px', padding: '10px 20px', borderRadius: '8px', border: '1px solid #ddd', background: 'white', cursor: 'pointer', fontWeight:'600', color:'#64748b' }}
                > 
                    ← Kembali 
                </button>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '30px', alignItems: 'start' }}>
                    
                    {/* KARTU PROFIL KIRI */}
                    <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0', textAlign: 'center', paddingBottom: '30px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                        <div style={{ height: '100px', background: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)' }}></div>
                        
                        <img 
                            src={imageUrl} 
                            style={{ width: '130px', height: '130px', borderRadius: '50%', marginTop: '-65px', border: '5px solid white', objectFit: 'cover', background: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} 
                            alt="profile" 
                            onError={(e) => { e.target.src = "https://cdn-icons-png.flaticon.com/512/3774/3774299.png" }}
                        />
                        
                        <h2 style={{ margin: '15px 0 5px', fontSize: '22px', fontWeight: 'bold', color: '#1e293b' }}>
                            {doctor.user?.name || doctor.name}
                        </h2>
                        <p style={{ color: mainBlue, fontWeight: 'bold', fontSize: '15px', background: '#e0f2fe', display: 'inline-block', padding: '5px 15px', borderRadius: '20px' }}>
                            {doctor.specialization}
                        </p>
                        
                        <div style={{ padding: '0 25px', marginTop: '25px' }}>
                            <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '20px', border: '1px solid #f1f5f9' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '12px' }}>
                                    <span style={{ color: '#64748b' }}>Pengalaman</span>
                                    <span style={{ fontWeight: 'bold', color: '#334155' }}>{doctor.experience_years} Tahun</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', alignItems: 'center' }}>
                                    <span style={{ color: '#64748b' }}>Biaya Konsultasi</span>
                                    <span style={{ fontWeight: 'bold', color: '#0ea5e9', fontSize: '18px' }}>
                                        Rp {doctor.consultation_fee?.toLocaleString('id-ID')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={handleBook} 
                            style={{ margin: '25px 25px 0', width: 'calc(100% - 50px)', padding: '16px', background: mainBlue, color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)', transition: '0.2s' }}
                            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                        >
                            Chat Dokter Sekarang
                        </button>
                    </div>

                    {/* DETAIL INFO KANAN */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                        
                        {/* Box Tentang */}
                        <div style={{ background: 'white', padding: '30px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                            <h3 style={{ marginBottom: '15px', color: '#1e293b', fontSize: '18px', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px' }}>Tentang Dokter</h3>
                            <p style={{ color: '#475569', lineHeight: '1.8', fontSize: '15px' }}>
                                {doctor.user?.name || doctor.name} adalah seorang dokter spesialis <strong>{doctor.specialization}</strong> yang berdedikasi tinggi. 
                                Beliau telah berpengalaman selama lebih dari {doctor.experience_years} tahun dalam menangani berbagai keluhan pasien dengan pendekatan yang ramah dan solutif.
                            </p>
                        </div>

                        {/* Box Jadwal */}
                        <div style={{ background: 'white', padding: '30px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                            <h4 style={{ marginBottom: '20px', color: '#1e293b', fontSize: '18px', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px' }}>Jadwal & Tempat Praktik</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
                                <div style={{ padding: '15px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                                    <p style={{ color: '#94a3b8', margin: '0 0 5px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>Hari Praktik</p>
                                    <p style={{ fontWeight: 'bold', margin: 0, color: '#334155' }}>Senin - Jumat</p>
                                </div>
                                <div style={{ padding: '15px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                                    <p style={{ color: '#94a3b8', margin: '0 0 5px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>Jam Kerja</p>
                                    <p style={{ fontWeight: 'bold', margin: 0, color: '#334155' }}>08:00 - 17:00 WIB</p>
                                </div>
                                <div style={{ padding: '15px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                                    <p style={{ color: '#94a3b8', margin: '0 0 5px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>Lokasi</p>
                                    <p style={{ fontWeight: 'bold', margin: 0, color: '#334155' }}>HaloHealth Hospital</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorDetail;