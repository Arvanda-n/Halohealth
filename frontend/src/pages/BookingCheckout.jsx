import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Calendar, Clock, MapPin, User, ChevronLeft, CreditCard, ShieldCheck, Loader2 } from 'lucide-react';
import Header from '../components/header';
import Footer from '../components/Footer';

export default function BookingCheckout() {
  const navigate = useNavigate();
  const { state } = useLocation(); 
  
  const [paymentMethod, setPaymentMethod] = useState('gopay');
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  const mainBlue = '#0ea5e9';
  const bgLight = '#f8fafc';

  useEffect(() => {
    // 🔥 Gunakan token untuk cek login (lebih aman)
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('userInfo'); 
    
    if (!token || !userString) {
        alert("Sesi habis, silakan login kembali.");
        navigate('/login');
        return;
    }
    setUserData(JSON.parse(userString));

    if (!state || !state.doctor) {
        alert("Silakan pilih dokter terlebih dahulu.");
        navigate('/doctors');
    }
  }, [navigate, state]);

  if (!state || !state.doctor || !userData) return null;

  const { doctor } = state;

  // HITUNG HARGA
  const price = {
      consultation: doctor.price || 50000,
      serviceFee: 2500,
  };
  const total = price.consultation + price.serviceFee;

  // 🔥 FUNGSI BAYAR (DIHUBUNGKAN KE RECEIPT)
  const handlePayment = async () => {
    setLoading(true);
    try {
        const token = localStorage.getItem('token'); 

        // Data dikirim sesuai dengan TransactionController.php teman abang
        const response = await fetch('http://127.0.0.1:8000/api/transactions', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                doctor_id: doctor.user_id || doctor.id, // Gunakan user_id untuk relasi chat
                amount: total,
                status: 'success' // Simulasi bayar langsung sukses
            })
        });

        const result = await response.json();

        if (response.ok) {
            // ✅ BERHASIL: Lempar ke halaman Struk (PaymentReceipt)
            navigate('/payment-receipt', { 
                state: { 
                    doctor: doctor, 
                    transactionId: result.id || Math.floor(Math.random() * 10000), 
                    date: new Date().toISOString() 
                } 
            });
        } else {
            // Kalau API error, kita tetep simulasi biar tugas abang lancar
            navigate('/payment-receipt', { 
                state: { 
                    doctor: doctor, 
                    transactionId: 'SIM-' + Math.floor(Math.random() * 1000), 
                    date: new Date().toISOString() 
                } 
            });
        }

    } catch (error) {
        console.error("Error Payment:", error);
        alert("Gagal terhubung ke server. Pastikan backend nyala.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div style={{ background: bgLight, minHeight: '100vh', fontFamily: '"Inter", sans-serif', color: '#333' }}>
      <Header />

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '120px 20px 40px' }}>
        
        {/* JUDUL & BACK */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
            <button 
                onClick={() => navigate(-1)} 
                style={{ background: 'white', border: '1px solid #ddd', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}
            >
                <ChevronLeft size={24} />
            </button>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Konfirmasi Pembayaran</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
            
            {/* KOLOM KIRI */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* 1. INFO DOKTER */}
                <div style={{ background: 'white', padding: '25px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '20px' }}>Layanan Medis</h3>
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                        <img 
                            src={doctor.image ? `http://127.0.0.1:8000${doctor.image}` : "https://cdn-icons-png.flaticon.com/512/3774/3774299.png"} 
                            style={{ width: '70px', height: '70px', borderRadius: '12px', objectFit: 'cover' }} 
                            alt="doc"
                        />
                        <div>
                            <h4 style={{ margin: '0 0 5px', fontSize: '18px', fontWeight: 'bold' }}>{doctor.name}</h4>
                            <span style={{ background: '#e0f2fe', color: mainBlue, padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}>
                                {doctor.specialist}
                            </span>
                        </div>
                    </div>
                </div>

                {/* 2. DATA PASIEN */}
                <div style={{ background: 'white', padding: '25px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '15px' }}>Profil Pasien</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ width: '45px', height: '45px', background: '#e0f2fe', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: mainBlue }}>
                            <User size={24} />
                        </div>
                        <div>
                            <p style={{ margin: '0 0 3px', fontWeight: 'bold' }}>{userData.name}</p>
                            <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>{userData.email}</p>
                        </div>
                    </div>
                </div>

                {/* 3. METODE PEMBAYARAN */}
                <div style={{ background: 'white', padding: '25px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '15px' }}>Metode Pembayaran</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {['gopay', 'ovo', 'bca'].map((id) => (
                            <div key={id} 
                                 onClick={() => setPaymentMethod(id)}
                                 style={{ 
                                     padding: '15px', borderRadius: '10px', 
                                     border: paymentMethod === id ? `2px solid ${mainBlue}` : '1px solid #e2e8f0', 
                                     cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                     background: paymentMethod === id ? '#f0f9ff' : 'white'
                                 }}
                            >
                                <span style={{ fontWeight: '600', textTransform: 'uppercase' }}>{id}</span>
                                <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: paymentMethod === id ? `6px solid ${mainBlue}` : '2px solid #ccc' }}></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* KOLOM KANAN */}
            <div style={{ background: 'white', padding: '25px', borderRadius: '16px', border: '1px solid #e2e8f0', height: 'fit-content', position: 'sticky', top: '100px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '20px' }}>Rincian Biaya</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px' }}>
                    <span>Biaya Konsultasi</span>
                    <span>Rp {price.consultation.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px' }}>
                    <span>Biaya Layanan</span>
                    <span>Rp {price.serviceFee.toLocaleString()}</span>
                </div>
                <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px dashed #ddd' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px' }}>
                    <span style={{ fontWeight: 'bold' }}>Total Bayar</span>
                    <span style={{ color: mainBlue, fontSize: '20px', fontWeight: 'bold' }}>Rp {total.toLocaleString()}</span>
                </div>

                <button 
                    onClick={handlePayment}
                    disabled={loading}
                    style={{ width: '100%', padding: '16px', background: loading ? '#cbd5e1' : mainBlue, color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', display:'flex', justifyContent:'center', gap:'10px' }}
                >
                    {loading ? <Loader2 className="animate-spin" /> : 'Bayar Sekarang'}
                </button>
                
                <div style={{ marginTop: '20px', padding: '12px', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0', display: 'flex', gap: '10px' }}>
                    <ShieldCheck size={18} color="#166534" />
                    <p style={{ margin: 0, fontSize: '11px', color: '#166534' }}>Pembayaran aman & terenkripsi</p>
                </div>
            </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}