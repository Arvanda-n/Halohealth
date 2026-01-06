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
                    // 🔥 Sesuaikan dengan { success: true, data: {...} }
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
        const userInfo = localStorage.getItem('userInfo');
        if (!userInfo) {
            alert("Silakan login dulu ya!");
            navigate('/login');
            return;
        }

        navigate('/booking-checkout', {
            state: {
                doctor: {
                    id: doctor.id,
                    name: doctor.user?.name || doctor.name,
                    specialist: doctor.specialization,
                    image: doctor.image,
                    hospital: "HaloHealth Hospital",
                    price: doctor.consultation_fee
                }
            }
        });
    };

    if (loading) return <div style={{ textAlign: 'center', marginTop: '100px', color: '#0ea5e9' }}>Memuat data dokter...</div>;
    if (error) return <div style={{ textAlign: 'center', marginTop: '100px', color: 'red' }}>{error}</div>;

    const mainBlue = '#0ea5e9';

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: '"Inter", sans-serif' }}>
            <Header />
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 20px' }}>
                <button onClick={() => navigate(-1)} style={{ marginBottom: '30px', padding: '10px 20px', borderRadius: '8px', border: '1px solid #ddd', cursor: 'pointer' }}> Kembali </button>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
                    {/* INFO CARD */}
                    <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0', textAlign: 'center', paddingBottom: '30px' }}>
                        <div style={{ height: '80px', background: mainBlue }}></div>
                        <img src={doctor.image || "https://cdn-icons-png.flaticon.com/512/3774/3774299.png"} style={{ width: '120px', height: '120px', borderRadius: '50%', marginTop: '-60px', border: '4px solid white', objectFit: 'cover' }} alt="profile" />
                        <h2 style={{ margin: '15px 0 5px' }}>{doctor.user?.name || doctor.name}</h2>
                        <p style={{ color: mainBlue, fontWeight: 'bold' }}>{doctor.specialization}</p>
                        <hr style={{ margin: '20px', opacity: 0.1 }} />
                        <div style={{ padding: '0 20px', display: 'flex', justifyContent: 'space-between' }}>
                            <span>Biaya Konsultasi</span>
                            <span style={{ fontWeight: 'bold' }}>Rp {doctor.consultation_fee?.toLocaleString()}</span>
                        </div>
                        <button onClick={handleBook} style={{ margin: '20px 20px 0', width: 'calc(100% - 40px)', padding: '12px', background: mainBlue, color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>Chat Dokter</button>
                    </div>

                    {/* DETAIL INFO */}
                    <div style={{ background: 'white', padding: '30px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                        <h3 style={{ marginBottom: '15px' }}>Tentang Dokter</h3>
                        <p style={{ color: '#475569', lineHeight: '1.7' }}>
                            {doctor.user?.name || doctor.name} adalah ahli {doctor.specialization} dengan pengalaman {doctor.experience_years} tahun. Fokus pada pelayanan prima bagi pasien.
                        </p>
                        <div style={{ marginTop: '20px' }}>
                            <h4 style={{ marginBottom: '10px' }}>Info Praktik</h4>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <span style={{ padding: '8px 15px', background: '#f1f5f9', borderRadius: '6px', fontSize: '14px' }}>Senin - Jumat</span>
                                <span style={{ padding: '8px 15px', background: '#f1f5f9', borderRadius: '6px', fontSize: '14px' }}>08:00 - 17:00</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorDetail;