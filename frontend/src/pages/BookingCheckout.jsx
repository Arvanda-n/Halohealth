import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, User, ShieldCheck, Loader2, Pill, Stethoscope, Receipt } from 'lucide-react';
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

  const isDoctorConsultation = state && state.doctor;
  const isMedicinePurchase = state && state.items && Array.isArray(state.items) && state.items.length > 0;

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('userInfo'); 
    
    if (!token || !userString) {
        alert("Sesi habis, silakan login kembali.");
        navigate('/login');
        return;
    }
    setUserData(JSON.parse(userString));

    if (!state || (!isDoctorConsultation && !isMedicinePurchase)) {
        console.log("State Error:", state); 
        alert("Keranjang kosong atau layanan tidak valid.");
        navigate('/');
    }
  }, [navigate, state]);

  if (!state || (!isDoctorConsultation && !isMedicinePurchase) || !userData) return null;

  // HITUNG HARGA
  let consultationFee = 0;
  let medicinesTotal = 0;
  let tax = 0;
  let serviceFee = 2500;

  if (isDoctorConsultation) {
      consultationFee = state.doctor.price || 50000;
  }

  if (isMedicinePurchase) {
      medicinesTotal = state.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      tax = medicinesTotal * 0.11;
  }

  const grandTotal = consultationFee + medicinesTotal + tax + serviceFee;

  // 🔥 FUNGSI HAPUS KERANJANG (DIPISAH BIAR BISA DIPANGGIL KAPAN AJA)
  const clearCart = async (token) => {
      if (isMedicinePurchase) {
          try {
              console.log("Membersihkan keranjang...");
              // Hapus semua item yang ada di list checkout
              await Promise.all(state.items.map(item => 
                  fetch(`http://127.0.0.1:8000/api/carts/${item.id}`, {
                      method: 'DELETE',
                      headers: { 'Authorization': `Bearer ${token}` }
                  })
              ));
          } catch (err) {
              console.error("Gagal hapus keranjang:", err);
          }
      }
  };

  const handlePayment = async () => {
    setLoading(true);
    const token = localStorage.getItem('token'); 

    const receiptData = {
        doctor: isDoctorConsultation ? state.doctor : null,
        items: isMedicinePurchase ? state.items : [],
        transactionId: 'TRX-' + Math.floor(Math.random() * 100000),
        total: grandTotal,
        date: new Date().toISOString(),
        shopInfo: isMedicinePurchase ? { name: "Apotek HaloHealth", image: "https://cdn-icons-png.flaticon.com/512/1048/1048953.png" } : null 
    };

    try {
        let payload = {
            amount: grandTotal,
            status: 'success',
            payment_method: paymentMethod,
            type: isDoctorConsultation ? 'consultation' : 'medicine',
            doctor_id: isDoctorConsultation ? state.doctor.id : null, 
            note: isMedicinePurchase ? `Pembelian ${state.items.length} item obat` : 'Konsultasi Dokter'
        };

        const response = await fetch('http://127.0.0.1:8000/api/transactions', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            const result = await response.json();
            receiptData.transactionId = result.data?.id || result.id || receiptData.transactionId;
        }

    } catch (error) {
        console.error("Network Error (Simulasi Jalan Terus):", error);
    } finally {
        // 🔥 FIX: HAPUS KERANJANG DISINI (DI FINALLY)
        // Jadi mau sukses atau error, keranjang tetap dihapus karena user sudah klik "Bayar"
        await clearCart(token);
        
        setLoading(false);
        navigate('/payment-receipt', { state: receiptData });
    }
  };

  const getImageUrl = (path) => {
      if (!path) return "https://placehold.co/150x150?text=No+Image";
      if (path.startsWith('http')) return path;
      return `http://127.0.0.1:8000${path}`;
  };

  return (
    <div style={{ background: bgLight, minHeight: '100vh', fontFamily: '"Inter", sans-serif', color: '#333' }}>
      <Header />

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '120px 20px 40px' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
            <button onClick={() => navigate(-1)} style={{ background: 'white', border: '1px solid #ddd', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <ChevronLeft size={24} />
            </button>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
                {isDoctorConsultation ? 'Konfirmasi Konsultasi' : 'Konfirmasi Pembelian Obat'}
            </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
            
            {/* KIRI */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ background: 'white', padding: '25px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '20px', display:'flex', alignItems:'center', gap:'10px' }}>
                        {isDoctorConsultation ? <Stethoscope size={20} color={mainBlue}/> : <Pill size={20} color={mainBlue}/>}
                        {isDoctorConsultation ? 'Layanan Medis' : 'Rincian Obat'}
                    </h3>

                    {isDoctorConsultation && (
                        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                            <img src={getImageUrl(state.doctor.image)} style={{ width: '70px', height: '70px', borderRadius: '12px', objectFit: 'cover' }} onError={(e) => e.target.src = "https://cdn-icons-png.flaticon.com/512/3774/3774299.png"}/>
                            <div>
                                <h4 style={{ margin: '0 0 5px', fontSize: '18px', fontWeight: 'bold' }}>{state.doctor.user?.name || state.doctor.name}</h4>
                                <span style={{ background: '#e0f2fe', color: mainBlue, padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}>{state.doctor.specialist || state.doctor.specialization}</span>
                            </div>
                        </div>
                    )}

                    {isMedicinePurchase && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {state.items.map((item, idx) => (
                                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: idx !== state.items.length - 1 ? '1px solid #f1f5f9' : 'none', paddingBottom: idx !== state.items.length - 1 ? '15px' : '0' }}>
                                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                        <div style={{ width: '60px', height: '60px', background: '#f1f5f9', borderRadius: '8px', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
                                            <img src={getImageUrl(item.image)} style={{width:'100%', height:'100%', objectFit:'contain'}} onError={(e) => e.target.src = "https://placehold.co/150x150?text=No+Image"}/>
                                        </div>
                                        <div>
                                            <p style={{ margin: '0 0 4px', fontWeight: 'bold', fontSize: '15px' }}>{item.name}</p>
                                            <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>{item.quantity} x Rp {item.price.toLocaleString('id-ID')}</p>
                                        </div>
                                    </div>
                                    <span style={{ fontWeight: 'bold' }}>Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div style={{ background: 'white', padding: '25px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '15px' }}>Profil Pemesan</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ width: '45px', height: '45px', background: '#e0f2fe', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: mainBlue }}><User size={24} /></div>
                        <div><p style={{ margin: '0 0 3px', fontWeight: 'bold' }}>{userData.name}</p><p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>{userData.email}</p></div>
                    </div>
                </div>

                <div style={{ background: 'white', padding: '25px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '15px' }}>Metode Pembayaran</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {['gopay', 'ovo', 'bca'].map((id) => (
                            <div key={id} onClick={() => setPaymentMethod(id)} style={{ padding: '15px', borderRadius: '10px', border: paymentMethod === id ? `2px solid ${mainBlue}` : '1px solid #e2e8f0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: paymentMethod === id ? '#f0f9ff' : 'white' }}>
                                <span style={{ fontWeight: '600', textTransform: 'uppercase' }}>{id}</span>
                                <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: paymentMethod === id ? `6px solid ${mainBlue}` : '2px solid #ccc' }}></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* KANAN */}
            <div style={{ background: 'white', padding: '25px', borderRadius: '16px', border: '1px solid #e2e8f0', height: 'fit-content', position: 'sticky', top: '100px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '20px' }}>Rincian Biaya</h3>
                
                {isDoctorConsultation && <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px' }}><span>Biaya Konsultasi</span><span>Rp {consultationFee.toLocaleString('id-ID')}</span></div>}
                
                {isMedicinePurchase && (
                    <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px' }}><span>Total Harga Obat</span><span>Rp {medicinesTotal.toLocaleString('id-ID')}</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px', color: '#64748b' }}><span style={{ display:'flex', alignItems:'center', gap:'5px' }}><Receipt size={14}/> PPN (11%)</span><span>Rp {tax.toLocaleString('id-ID')}</span></div>
                    </>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px' }}><span>Biaya Layanan</span><span>Rp {serviceFee.toLocaleString('id-ID')}</span></div>
                <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px dashed #ddd' }} />
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px' }}><span style={{ fontWeight: 'bold' }}>Total Bayar</span><span style={{ color: mainBlue, fontSize: '20px', fontWeight: 'bold' }}>Rp {grandTotal.toLocaleString('id-ID')}</span></div>

                <button onClick={handlePayment} disabled={loading} style={{ width: '100%', padding: '16px', background: loading ? '#cbd5e1' : mainBlue, color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', display:'flex', justifyContent:'center', gap:'10px' }}>{loading ? <Loader2 className="animate-spin" /> : 'Bayar Sekarang'}</button>
                <div style={{ marginTop: '20px', padding: '12px', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0', display: 'flex', gap: '10px' }}><ShieldCheck size={18} color="#166534" /><p style={{ margin: 0, fontSize: '11px', color: '#166534' }}>Pembayaran aman & terenkripsi</p></div>
            </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}