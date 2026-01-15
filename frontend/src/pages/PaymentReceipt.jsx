import React, { useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/header';
// Import Icon Lucide (Pengganti Emoji)
import { CheckCircle, Download, Share2, X, MessageCircle, CreditCard, MessageSquare, AlertCircle, Home } from 'lucide-react';

export default function PaymentReceipt() {
    const navigate = useNavigate();
    const location = useLocation();
    const receiptRef = useRef();
    
    // Ambil data dari state transaksi + Status
    const { doctor, transactionId, status } = location.state || {};

    // 1. Load library screenshot otomatis
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
        script.async = true;
        document.body.appendChild(script);
        return () => { if (document.body.contains(script)) document.body.removeChild(script); };
    }, []);

    // 2. Proteksi jika halaman dibuka tanpa data
    if (!doctor) {
        return (
            <div style={{ minHeight: '100vh', background: '#f8fafc', paddingTop: '100px', textAlign: 'center', fontFamily: '"Inter", sans-serif' }}>
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, background: 'white', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        <Header />
                    </div>
                </div>
                <div style={{ background: 'white', padding: '40px', margin: '0 auto', maxWidth: '400px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', display:'flex', flexDirection:'column', alignItems:'center' }}>
                    <div style={{ width:'60px', height:'60px', background:'#fee2e2', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'20px' }}>
                        <X size={32} color="#ef4444" />
                    </div>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b', margin:'0 0 10px' }}>Data Tidak Ditemukan</h3>
                    <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>Silakan lakukan pemesanan ulang.</p>
                    <button onClick={() => navigate('/')} style={{ marginTop: '25px', padding: '12px 24px', background: '#0ea5e9', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', display:'flex', alignItems:'center', gap:'8px' }}>
                        <Home size={18} /> Kembali ke Beranda
                    </button>
                </div>
            </div>
        );
    }

    // 3. Fungsi Download Struk
    const handleDownload = async () => {
        if (window.html2canvas) {
            window.html2canvas(receiptRef.current, { useCORS: true, scale: 2 }).then(canvas => {
                const link = document.createElement('a');
                link.href = canvas.toDataURL('image/png');
                link.download = `Struk-HaloHealth-${transactionId || 'IMG'}.png`;
                link.click();
            });
        } else {
            alert("Fitur download sedang memuat...");
        }
    };

    // 4. Fungsi Share ke WA (Text Only karena WA API hanya support text)
    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Struk HaloHealth',
                    text: `BUKTI PEMBAYARAN HALOHEALTH\n\n` +
                          `STATUS: ${status === 'success' ? 'LUNAS' : 'PENDING'}\n` +
                          `DOKTER: ${doctor?.name}\n` +
                          `TOTAL: Rp ${(doctor?.price + 2500).toLocaleString('id-ID')}\n` +
                          `REF ID: #HH-${transactionId || 'NEW'}`
                });
            } catch (err) { console.log('Batal share'); }
        } else {
            alert("Browser tidak support share.");
        }
    };

    // --- LOGIC GAMBAR ---
    const imageUrl = doctor.image 
        ? `http://127.0.0.1:8000${doctor.image}` 
        : "https://cdn-icons-png.flaticon.com/512/3774/3774299.png";

    // --- STYLING ---
    const styles = {
        pageContainer: { background: '#f1f5f9', minHeight: '100vh', fontFamily: '"Inter", sans-serif', paddingBottom: '50px' },
        fixedHeader: { position: 'fixed', top: 0, left: 0, right: 0, height: '80px', zIndex: 999, background: 'white', borderBottom: '1px solid #e2e8f0' },
        mainContent: { paddingTop: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingLeft: '20px', paddingRight: '20px' },
        
        card: { background: 'white', width: '100%', maxWidth: '420px', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 40px -5px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' },
        
        // Header Biru
        headerBlue: { background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)', padding: '30px', textAlign: 'center', color: 'white' },
        iconCircle: { background: 'rgba(255,255,255,0.2)', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px' },
        
        bodyContent: { padding: '30px' },
        label: { fontSize: '10px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', display: 'block' },
        
        // Row Dokter
        doctorRow: { display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #f1f5f9', marginBottom: '25px' },
        
        // Total
        totalBox: { marginTop: '20px', paddingTop: '20px', borderTop: '2px dashed #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
        
        // Buttons
        btnGroup: { marginTop: '25px', width: '100%', maxWidth: '420px', display: 'flex', flexDirection: 'column', gap: '12px' },
        btnSecondary: { flex: 1, background: 'white', border: '1px solid #cbd5e1', padding: '12px', borderRadius: '12px', fontWeight: 'bold', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', transition: '0.2s' },
        btnPrimary: { width: '100%', background: '#0ea5e9', color: 'white', padding: '16px', borderRadius: '14px', border: 'none', fontWeight: '800', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer', boxShadow: '0 10px 20px rgba(14, 165, 233, 0.2)', transition: '0.2s' },
        btnDisabled: { width: '100%', background: '#cbd5e1', color: 'white', padding: '16px', borderRadius: '14px', border: 'none', fontWeight: '800', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'not-allowed' }
    };

    return (
        <div style={styles.pageContainer}>
            {/* NAVBAR */}
            <div style={styles.fixedHeader}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <Header />
                </div>
            </div>

            {/* KONTEN */}
            <div style={styles.mainContent}>
                
                {/* STRUK VISUAL */}
                <div style={styles.card}>
                    <div ref={receiptRef} style={{ background: 'white' }}>
                        <div style={styles.headerBlue}>
                            <div style={styles.iconCircle}>
                                <CheckCircle size={28} color="white" />
                            </div>
                            <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 'bold' }}>Pembayaran Berhasil</h2>
                            <p style={{ margin: '5px 0 0', fontSize: '13px', opacity: 0.9 }}>ID: #HH-{transactionId || 'NEW'}</p>
                        </div>

                        <div style={styles.bodyContent}>
                            <span style={styles.label}>Metode Pembayaran</span>
                            <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'25px' }}>
                                <CreditCard size={18} color="#0ea5e9" />
                                <span style={{ fontWeight:'600', color:'#1e293b' }}>Transfer / E-Wallet</span>
                            </div>

                            <span style={styles.label}>Dokter</span>
                            <div style={styles.doctorRow}>
                                <img 
                                    src={imageUrl} 
                                    style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', background: 'white', border: '2px solid white', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }} 
                                    alt="doc"
                                    crossOrigin="anonymous"
                                    onError={(e) => { e.target.src = "https://cdn-icons-png.flaticon.com/512/3774/3774299.png" }}
                                />
                                <div>
                                    <p style={{ margin: 0, fontWeight: 'bold', color: '#1e293b' }}>{doctor?.name}</p>
                                    <span style={{ fontSize: '12px', color: '#64748b' }}>{doctor?.specialist}</span>
                                </div>
                                <div style={{ marginLeft: 'auto' }}>
                                    <MessageSquare size={20} color="#cbd5e1" />
                                </div>
                            </div>

                            <div style={styles.totalBox}>
                                <div>
                                    <span style={{ ...styles.label, marginBottom: 0 }}>Total Bayar</span>
                                    <span style={{ fontSize: '12px', color: '#64748b' }}>Termasuk pajak</span>
                                </div>
                                <span style={{ fontSize: '22px', fontWeight: '800', color: '#0ea5e9' }}>
                                    Rp {(doctor?.price + 2500).toLocaleString('id-ID')}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* TOMBOL AKSI */}
                <div style={styles.btnGroup}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={handleDownload} style={styles.btnSecondary}>
                            <Download size={18} /> Simpan
                        </button>
                        <button onClick={handleShare} style={styles.btnSecondary}>
                            <Share2 size={18} /> Bagikan
                        </button>
                    </div>

                    {/* 🔥 LOGIKA KUNCI TOMBOL CHAT (Gunakan Icon AlertCircle kalau dikunci) */}
                    {status === 'success' ? (
                        <button 
                            onClick={() => navigate(`/chat/${doctor?.user_id || doctor?.id}`, {
                                state: { doctor: doctor } 
                            })} 
                            style={styles.btnPrimary}
                        >
                            <MessageCircle size={22} /> MULAI CHAT SEKARANG
                        </button>
                    ) : (
                        <button disabled style={styles.btnDisabled}>
                            <AlertCircle size={22} /> MENUNGGU PEMBAYARAN
                        </button>
                    )}

                    <button 
                        onClick={() => navigate('/')} 
                        style={{ background: 'none', border: 'none', color: '#94a3b8', fontWeight: '600', cursor: 'pointer', padding: '10px' }}
                    >
                        Tutup & Kembali
                    </button>
                </div>

            </div>
        </div>
    );
}