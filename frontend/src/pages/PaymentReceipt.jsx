import React, { useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/header';
import { CheckCircle, Download, Share2, X, MessageCircle, CreditCard, MessageSquare, AlertCircle, Home, Pill, ShoppingBag } from 'lucide-react';

export default function PaymentReceipt() {
    const navigate = useNavigate();
    const location = useLocation();
    const receiptRef = useRef();
    
    // --- 1. AMBIL DATA ---
    const trx = location.state?.transaction || location.state?.payment || location.state?.data || {};
    const doctor = trx.doctor || location.state?.doctor;
    const items = trx.items || location.state?.items;
    const transactionId = trx.id || location.state?.transactionId;
    const status = trx.status || location.state?.status;
    const total = trx.amount || trx.total || location.state?.total;
    
    const isMedicine = (items && items.length > 0) || trx.type === 'medicine';
    const isConsultation = !!doctor || trx.doctor_id;

    // --- 2. LOAD SCRIPT DARI LINK (CDN) ---
    useEffect(() => {
        if (!window.html2canvas) {
            const script = document.createElement("script");
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
            script.async = true;
            document.body.appendChild(script);
        }
    }, []);

    // --- 3. LOGIC GAMBAR (SUPER AMAN) ---
    const getImageUrl = (path) => {
        if (!path) return "https://cdn-icons-png.flaticon.com/512/3774/3774299.png";
        
        // 1. Kalau path-nya url lengkap (http...), pakai langsung
        if (path.startsWith('http')) return path;
        
        // 2. Bersihin path dari karakter aneh
        let cleanPath = path.replace(/^public\//, '').replace(/^\//, '');
        
        // 3. Cek apakah di database kesimpennya udah pake folder 'uploads' atau 'storage'
        // Sesuaikan dengan URL yang error di console tadi: http://127.0.0.1:8000/uploads/...
        if (cleanPath.startsWith('uploads/')) {
             return `http://127.0.0.1:8000/${cleanPath}`;
        }
        
        // Default ke storage
        return `http://127.0.0.1:8000/storage/${cleanPath}`;
    };

    // --- FUNGSI DOWNLOAD ---
    const handleDownload = async () => {
        if (window.html2canvas && receiptRef.current) {
            try {
                const canvas = await window.html2canvas(receiptRef.current, { 
                    useCORS: true, // Tetap true biar html2canvas usaha load gambar
                    scale: 2,
                    allowTaint: true // Bolehin gambar "kotor" (tanpa CORS header)
                });
                const link = document.createElement('a');
                link.href = canvas.toDataURL('image/png');
                link.download = `Struk-HaloHealth-${transactionId || 'IMG'}.png`;
                link.click();
            } catch (error) {
                console.error("Gagal download:", error);
                alert("Gagal menyimpan gambar. Coba screenshot manual saja.");
            }
        } else {
            alert("Fitur sedang memuat...");
        }
    };

    // --- FUNGSI SHARE ---
    const handleShare = async () => {
        const titleText = isConsultation ? `DOKTER: ${doctor?.name || 'Spesialis'}` : `ITEM: Obat-obatan`;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Struk HaloHealth',
                    text: `BUKTI PEMBAYARAN HALOHEALTH\nSTATUS: ${status === 'success' || !status ? 'LUNAS' : 'PENDING'}\n${titleText}\nTOTAL: Rp ${(total || 0).toLocaleString('id-ID')}\nREF ID: #HH-${transactionId || 'NEW'}`
                });
            } catch (err) { console.log('Batal share'); }
        } else { alert("Browser tidak support share."); }
    };

    if (!trx || (!isConsultation && !isMedicine)) return null;

    // --- STYLING ---
    const styles = {
        pageContainer: { background: '#f1f5f9', minHeight: '100vh', fontFamily: '"Inter", sans-serif', paddingBottom: '50px' },
        fixedHeader: { position: 'fixed', top: 0, left: 0, right: 0, height: '80px', zIndex: 999, background: 'white', borderBottom: '1px solid #e2e8f0' },
        mainContent: { paddingTop: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingLeft: '20px', paddingRight: '20px' },
        card: { background: 'white', width: '100%', maxWidth: '420px', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 40px -5px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' },
        headerBlue: { background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)', padding: '30px', textAlign: 'center', color: 'white' },
        iconCircle: { background: 'rgba(255,255,255,0.2)', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px' },
        bodyContent: { padding: '30px' },
        label: { fontSize: '10px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', display: 'block' },
        doctorRow: { display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #f1f5f9', marginBottom: '25px' },
        totalBox: { marginTop: '20px', paddingTop: '20px', borderTop: '2px dashed #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
        btnGroup: { marginTop: '25px', width: '100%', maxWidth: '420px', display: 'flex', flexDirection: 'column', gap: '12px' },
        btnSecondary: { flex: 1, background: 'white', border: '1px solid #cbd5e1', padding: '12px', borderRadius: '12px', fontWeight: 'bold', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', transition: '0.2s' },
        btnPrimary: { width: '100%', background: '#0ea5e9', color: 'white', padding: '16px', borderRadius: '14px', border: 'none', fontWeight: '800', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer', boxShadow: '0 10px 20px rgba(14, 165, 233, 0.2)', transition: '0.2s' },
        btnDisabled: { width: '100%', background: '#cbd5e1', color: 'white', padding: '16px', borderRadius: '14px', border: 'none', fontWeight: '800', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'not-allowed' }
    };

    return (
        <div style={styles.pageContainer}>
            <div style={styles.fixedHeader}><div style={{ maxWidth: '1200px', margin: '0 auto' }}><Header /></div></div>
            <div style={styles.mainContent}>
                <div style={styles.card}>
                    <div ref={receiptRef} style={{ background: 'white' }}>
                        <div style={styles.headerBlue}>
                            <div style={styles.iconCircle}><CheckCircle size={28} color="white" /></div>
                            <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 'bold' }}>Pembayaran Berhasil</h2>
                            <p style={{ margin: '5px 0 0', fontSize: '13px', opacity: 0.9 }}>ID: #HH-{transactionId || 'NEW'}</p>
                        </div>
                        <div style={styles.bodyContent}>
                            <span style={styles.label}>Metode Pembayaran</span>
                            <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'25px' }}><CreditCard size={18} color="#0ea5e9" /><span style={{ fontWeight:'600', color:'#1e293b' }}>Transfer / E-Wallet</span></div>

                            {/* DOKTER SECTION */}
                            {isConsultation && (
                                <>
                                    <span style={styles.label}>Dokter</span>
                                    <div style={styles.doctorRow}>
                                        {/* 🔥 SAYA HAPUS crossOrigin="anonymous" BIAR FOTONYA MUNCUL */}
                                        <img 
                                            src={getImageUrl(doctor?.image || doctor?.user?.image)} 
                                            style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', background: 'white', border: '2px solid white', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }} 
                                            alt="doc"
                                            onError={(e) => { e.target.src = "https://cdn-icons-png.flaticon.com/512/3774/3774299.png" }}
                                        />
                                        <div>
                                            <p style={{ margin: 0, fontWeight: 'bold', color: '#1e293b' }}>{doctor?.user?.name || doctor?.name || 'Dokter Spesialis'}</p>
                                            <span style={{ fontSize: '12px', color: '#64748b' }}>{doctor?.specialization || 'Spesialis'}</span>
                                        </div>
                                        <div style={{ marginLeft: 'auto' }}><MessageSquare size={20} color="#cbd5e1" /></div>
                                    </div>
                                </>
                            )}

                            {/* OBAT SECTION */}
                            {isMedicine && (
                                <>
                                    <span style={styles.label}>Rincian Obat</span>
                                    <div style={{ background: '#f8fafc', borderRadius: '16px', border: '1px solid #f1f5f9', padding: '15px', marginBottom: '25px', display:'flex', flexDirection:'column', gap:'10px' }}>
                                        {items && items.length > 0 ? items.map((item, idx) => (
                                            <div key={idx} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:'14px' }}>
                                                <div style={{display:'flex', gap:'8px', alignItems:'center'}}><Pill size={14} color="#0ea5e9"/><span style={{color:'#334155'}}>{item.name}</span><span style={{fontSize:'12px', color:'#94a3b8'}}>x{item.quantity}</span></div>
                                                <span style={{fontWeight:'bold'}}>Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                                            </div>
                                        )) : (<div style={{ fontSize:'14px', color:'#334155' }}>{trx.note || "Paket Obat-obatan"}</div>)}
                                    </div>
                                </>
                            )}

                            <div style={styles.totalBox}>
                                <div><span style={{ ...styles.label, marginBottom: 0 }}>Total Bayar</span><span style={{ fontSize: '12px', color: '#64748b' }}>Termasuk pajak</span></div>
                                <span style={{ fontSize: '22px', fontWeight: '800', color: '#0ea5e9' }}>Rp {(total || 0).toLocaleString('id-ID')}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={styles.btnGroup}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={handleDownload} style={styles.btnSecondary}><Download size={18} /> Simpan</button>
                        <button onClick={handleShare} style={styles.btnSecondary}><Share2 size={18} /> Bagikan</button>
                    </div>
                    
                    {/* BUTTON CHAT */}
                    {isConsultation ? (
                        (status === 'success' || !status) ? (
                            <button 
                                onClick={() => {
                                    const targetDoctorId = doctor?.user_id || doctor?.user?.id || doctor?.id;
                                    console.log("Chat ke ID Dokter:", targetDoctorId);
                                    navigate(`/chat/${targetDoctorId}`, { state: { doctor: doctor } });
                                }} 
                                style={styles.btnPrimary}
                            >
                                <MessageCircle size={22} /> MULAI CHAT SEKARANG
                            </button>
                        ) : (<button disabled style={styles.btnDisabled}><AlertCircle size={22} /> MENUNGGU VERIFIKASI</button>)
                    ) : (
                        <button onClick={() => navigate('/medicines')} style={styles.btnPrimary}><ShoppingBag size={22} /> BELANJA LAGI</button>
                    )}
                    <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: '#94a3b8', fontWeight: '600', cursor: 'pointer', padding: '10px' }}>Tutup & Kembali</button>
                </div>
            </div>
        </div>
    );
}