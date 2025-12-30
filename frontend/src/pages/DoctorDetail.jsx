import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/header'; 

const DoctorDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // FETCH DATA MURNI DARI DATABASE
    useEffect(() => {
        const fetchDoctor = async () => {
            try {
                // GANTI URL INI SESUAI BACKEND KAMU (Biasanya port 8000 atau 5000)
                // Aku set ke 8000 sesuai kodingan lamamu
                const response = await fetch(`http://127.0.0.1:8000/api/doctors/${id}`);
                
                if (!response.ok) {
                    throw new Error('Data tidak ditemukan');
                }

                const data = await response.json();
                setDoctor(data); // Masukkan data asli
            } catch (err) {
                console.error("Gagal ambil data dokter:", err);
                setError("Gagal mengambil data dokter. Pastikan backend nyala.");
            } finally {
                setLoading(false);
            }
        };
        fetchDoctor();
    }, [id]);

    // FUNGSI KE HALAMAN CHECKOUT
    const handleBook = () => {
        const userInfo = localStorage.getItem('userInfo');
        if (!userInfo) {
            alert("Silakan login dulu ya!");
            navigate('/login');
            return;
        }

        navigate('/booking-checkout', {
            state: {
                doctor: {
                    _id: doctor._id || doctor.id, // Handle beda _id atau id
                    name: doctor.name,
                    specialist: doctor.specialization || doctor.specialist, // Handle beda nama field
                    image: doctor.photo || doctor.image,
                    hospital: doctor.hospital || "HaloHealth Hospital",
                    price: doctor.price || doctor.consultation_fee || 50000
                }
            }
        });
    };

    // TAMPILAN LOADING / ERROR
    if (loading) return <div style={{ display:'flex', justifyContent:'center', marginTop:'100px', fontWeight:'bold', color:'#0ea5e9' }}>Sedang memuat data Dr. Indah...</div>;
    if (error) return <div style={{ display:'flex', justifyContent:'center', marginTop:'100px', color:'red' }}>{error}</div>;
    if (!doctor) return <div style={{ display:'flex', justifyContent:'center', marginTop:'100px' }}>Dokter tidak ditemukan.</div>;

    // STYLE VARIABLES
    const mainBlue = '#0ea5e9';
    const bgGray = '#f8fafc';

    // ICON URLS
    const icons = {
        arrowLeft: "https://unpkg.com/lucide-static@latest/icons/arrow-left.svg",
        star: "https://cdn-icons-png.flaticon.com/128/1828/1828884.png",
        chat: "https://unpkg.com/lucide-static@latest/icons/message-circle.svg",
        hospital: "https://unpkg.com/lucide-static@latest/icons/building-2.svg",
        users: "https://unpkg.com/lucide-static@latest/icons/users.svg",
        briefcase: "https://unpkg.com/lucide-static@latest/icons/briefcase.svg",
        stethoscope: "https://unpkg.com/lucide-static@latest/icons/stethoscope.svg",
        graduation: "https://unpkg.com/lucide-static@latest/icons/graduation-cap.svg"
    };

    // DATA DARI DATABASE (Dengan Fallback Aman)
    const docName = doctor.name || "Nama Dokter";
    const docSpec = doctor.specialization || doctor.specialist || "Spesialis";
    const docExp = doctor.experience_years || doctor.experience || 5;
    const docPrice = doctor.price || doctor.consultation_fee || 50000;
    const docHosp = doctor.hospital || "HaloHealth Hospital";
    // Gunakan gambar dari DB, kalau kosong pakai default cewek/cowok sesuai nama (opsional) atau placeholder
    const docPhoto = doctor.photo || doctor.image || "https://cdn-icons-png.flaticon.com/512/3774/3774299.png";

    return (
        <div style={{ background: bgGray, minHeight: '100vh', fontFamily: '"Inter", sans-serif', color: '#333' }}>
            
            {/* HEADER */}
            <div style={{ background: 'white', borderBottom: '1px solid #eee', position: 'sticky', top: 0, zIndex: 50 }}>
                <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
                    <Header />
                </div>
            </div>

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 20px' }}>
                
                {/* TOMBOL KEMBALI */}
                <button 
                    onClick={() => navigate(-1)} 
                    style={{ 
                        display: 'flex', alignItems: 'center', gap: '10px', 
                        background: 'white', border: '1px solid #e2e8f0', padding: '10px 20px', 
                        borderRadius: '8px', cursor: 'pointer', marginBottom: '30px', fontWeight: '500', color: '#64748b'
                    }}
                >
                    <img src={icons.arrowLeft} style={{ width: '18px', opacity: 0.6 }} alt="back" />
                    <span>Kembali ke List</span>
                </button>

                {/* LAYOUT GRID */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px', alignItems: 'start' }}>
                    
                    {/* --- KOLOM KIRI: FOTO (STICKY) --- */}
                    <div style={{ position: 'sticky', top: '100px' }}>
                        <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
                            
                            <div style={{ height: '100px', background: 'linear-gradient(90deg, #0ea5e9 0%, #38bdf8 100%)' }}></div>
                            
                            <div style={{ padding: '0 24px 24px', textAlign: 'center', marginTop: '-50px' }}>
                                <div style={{ position: 'relative', display: 'inline-block' }}>
                                    <img 
                                        src={docPhoto} 
                                        alt={docName} 
                                        style={{ width: '120px', height: '120px', borderRadius: '50%', border: '4px solid white', objectFit: 'cover', background: '#eee' }}
                                        onError={(e) => {e.target.src = "https://cdn-icons-png.flaticon.com/512/3774/3774299.png"}}
                                    />
                                    <div style={{ position: 'absolute', bottom: '5px', right: '5px', width: '16px', height: '16px', background: '#22c55e', borderRadius: '50%', border: '2px solid white' }} title="Online"></div>
                                </div>

                                <h1 style={{ fontSize: '20px', fontWeight: 'bold', margin: '10px 0 5px' }}>{docName}</h1>
                                <p style={{ color: mainBlue, fontWeight: '600', fontSize: '14px', margin: 0 }}>{docSpec}</p>

                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4px', marginTop: '10px' }}>
                                    {[1,2,3,4,5].map((i) => (
                                        <img key={i} src={icons.star} style={{ width: '16px' }} alt="star" />
                                    ))}
                                    <span style={{ color: '#94a3b8', fontSize: '12px', marginLeft: '5px' }}>(5.0)</span>
                                </div>

                                <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '20px 0' }} />

                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '14px' }}>
                                    <span style={{ color: '#64748b' }}>Biaya Konsultasi</span>
                                    <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Rp {docPrice.toLocaleString('id-ID')}</span>
                                </div>

                                <button 
                                    onClick={handleBook}
                                    style={{ 
                                        width: '100%', padding: '12px', background: mainBlue, color: 'white', 
                                        border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '10px',
                                        boxShadow: '0 4px 10px rgba(14, 165, 233, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
                                    }}
                                >
                                    <img src={icons.chat} style={{ width: '20px', filter: 'invert(1)' }} alt="chat" />
                                    Chat Dokter
                                </button>
                                
                                <button style={{ width: '100%', padding: '12px', background: 'white', color: '#333', border: '1px solid #ddd', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                    <img src={icons.hospital} style={{ width: '18px', opacity: 0.6 }} alt="rs" />
                                    Buat Janji RS
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* --- KOLOM KANAN: DETAIL INFO --- */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                        
                        {/* STATISTIK */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
                            <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                                <div style={{ width: '40px', height: '40px', background: '#e0f2fe', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                                    <img src={icons.users} style={{ width: '20px' }} alt="users" /> 
                                </div>
                                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b' }}>100+</div>
                                <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', marginTop: '4px' }}>Pasien</div>
                            </div>
                            
                            <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                                <div style={{ width: '40px', height: '40px', background: '#f3e8ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                                    <img src={icons.briefcase} style={{ width: '20px', opacity: 0.6 }} alt="exp" />
                                </div>
                                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b' }}>{docExp} Thn</div>
                                <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', marginTop: '4px' }}>Pengalaman</div>
                            </div>

                            <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                                <div style={{ width: '40px', height: '40px', background: '#f0fdf4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                                    <img src={icons.star} style={{ width: '20px' }} alt="rate" />
                                </div>
                                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b' }}>5.0</div>
                                <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', marginTop: '4px' }}>Rating</div>
                            </div>
                        </div>

                        {/* DESKRIPSI */}
                        <div style={{ background: 'white', padding: '30px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                                <img src={icons.stethoscope} style={{ width: '24px', opacity: 0.8 }} alt="about" />
                                <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>Tentang Dokter</h3>
                            </div>
                            <p style={{ color: '#475569', lineHeight: '1.6', fontSize: '15px' }}>
                                {docName} adalah seorang tenaga medis profesional di bidang {docSpec}. 
                                Beliau berpraktik di {docHosp} dan memiliki pengalaman {docExp} tahun. 
                                Beliau siap membantu konsultasi kesehatan Anda dengan pendekatan yang ramah dan solutif.
                            </p>

                            <div style={{ marginTop: '25px' }}>
                                <h4 style={{ fontWeight: 'bold', fontSize: '15px', marginBottom: '15px', color: '#333' }}>Jadwal Praktik</h4>
                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                    {['Senin 09:00 - 15:00', 'Rabu 13:00 - 18:00', 'Jumat 08:00 - 11:00'].map((schedule, idx) => (
                                        <span key={idx} style={{ padding: '8px 16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', color: '#555', fontWeight: '500' }}>
                                            {schedule}
                                        </span>
                                    ))}
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