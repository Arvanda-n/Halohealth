import React, { useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/header';
import { CheckCircle, Download, Share2, X, MessageCircle, CreditCard, MessageSquare, AlertCircle, Home, Pill, ShoppingBag, Calendar } from 'lucide-react';

export default function PaymentReceipt() {
    const navigate = useNavigate();
    const location = useLocation();
    const receiptRef = useRef();
    
    // 🔥 AMBIL DATA DENGAN SANGAT AMAN
    const trx = location.state?.data || location.state?.transaction || {};
    
    const doctor = trx.doctor;
    const items = trx.items || [];
    const transactionId = trx.id;
    const status = trx.status;
    const total = trx.amount || trx.total || 0;
    
    // Cek Tipe
    const isMedicine = items.length > 0 || trx.type === 'medicine';
    const isConsultation = !!doctor || trx.doctor_id;

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
        script.async = true;
        document.body.appendChild(script);
        return () => { if (document.body.contains(script)) document.body.removeChild(script); };
    }, []);

    const getImageUrl = (path) => {
        if (!path) return "https://cdn-icons-png.flaticon.com/512/3774/3774299.png";
        if (path.startsWith('http')) return path;
        const cleanPath = path.replace(/^public\//, '').replace(/^\//, '');
        return cleanPath.startsWith('storage/') ? `http://127.0.0.1:8000/${cleanPath}` : `http://127.0.0.1:8000/storage/${cleanPath}`;
    };

    if (!transactionId) {
        return (
            <div style={{ minHeight: '100vh', background: '#f8fafc', paddingTop: '100px', textAlign: 'center', fontFamily: '"Inter", sans-serif' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', position:'fixed', top:0, left:0, right:0, zIndex:99 }}><Header /></div>
                <div style={{ background: 'white', padding: '40px', margin: '120px auto', maxWidth: '400px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', display:'flex', flexDirection:'column', alignItems:'center' }}>
                    <div style={{ width:'60px', height:'60px', background:'#fee2e2', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'20px' }}>
                        <X size={32} color="#ef4444" />
                    </div>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b', margin:'0 0 10px' }}>Data Tidak Ditemukan</h3>
                    <button onClick={() => navigate('/')} style={{ marginTop: '25px', padding: '12px 24px', background: '#0ea5e9', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', display:'flex', alignItems:'center', gap:'8px' }}><Home size={18} /> Kembali</button>
                </div>
            </div>
        );
    }

    const handleDownload = async () => {
        if (window.html2canvas) {
            window.html2canvas(receiptRef.current, { useCORS: true, scale: 2 }).then(canvas => {
                const link = document.createElement('a');
                link.href = canvas.toDataURL('image/png');
                link.download = `Struk-HaloHealth-${transactionId}.png`;
                link.click();
            });
        }
    };

    const s = {
        pageContainer: { background: '#f1f5f9', minHeight: '100vh', fontFamily: '"Inter", sans-serif', paddingBottom: '50px' },
        fixedHeader: { position: 'fixed', top: 0, left: 0, right: 0, height: '80px', zIndex: 999, background: 'white', borderBottom: '1px solid #e2e8f0' },
        mainContent: { paddingTop: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingLeft: '20px', paddingRight: '20px' },
        card: { background: 'white', width: '100%', maxWidth: '420px', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 40px -5px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' },
        headerBlue: { background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)', padding: '30px', textAlign: 'center', color: 'white' },
        iconCircle: { background: 'rgba(255,255,255,0.2)', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px' },
        bodyContent: { padding: '30px' },
        label: { fontSize: '10px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', display: 'block' },
        totalBox: { marginTop: '20px', paddingTop: '20px', borderTop: '2px dashed #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
        btnGroup: { marginTop: '25px', width: '100%', maxWidth: '420px', display: 'flex', flexDirection: 'column', gap: '12px' },
        btnSecondary: { flex: 1, background: 'white', border: '1px solid #cbd5e1', padding: '12px', borderRadius: '12px', fontWeight: 'bold', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' },
        btnPrimary: { width: '100%', background: '#0ea5e9', color: 'white', padding: '16px', borderRadius: '14px', border: 'none', fontWeight: '800', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer', boxShadow: '0 10px 20px rgba(14, 165, 233, 0.2)' }
    };

    return (
        <div style={s.pageContainer}>
            <div style={s.fixedHeader}><div style={{ maxWidth: '1200px', margin: '0 auto' }}><Header /></div></div>
            <div style={s.mainContent}>
                <div style={s.card}>
                    <div ref={receiptRef} style={{ background: 'white' }}>
                        <div style={s.headerBlue}>
                            <div style={s.iconCircle}><CheckCircle size={28} color="white" /></div>
                            <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 'bold' }}>Pembayaran Berhasil</h2>
                            <p style={{ margin: '5px 0 0', fontSize: '13px', opacity: 0.9 }}>ID: #HH-{transactionId}</p>
                        </div>
                        <div style={s.bodyContent}>
                            <span style={s.label}>Metode Pembayaran</span>
                            <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'25px' }}><CreditCard size={18} color="#0ea5e9" /><span style={{ fontWeight:'600', color:'#1e293b' }}>Transfer / E-Wallet</span></div>

                            {isConsultation && (
                                <><span style={s.label}>Dokter</span><div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #f1f5f9', marginBottom: '25px' }}><img src={getImageUrl(doctor?.image || doctor?.user?.image)} style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', background: 'white' }} alt="doc" onError={(e) => { e.target.src = "https://cdn-icons-png.flaticon.com/512/3774/3774299.png" }}/><div style={{flex:1}}><p style={{ margin: 0, fontWeight: 'bold', color: '#1e293b' }}>{doctor?.user?.name || doctor?.name}</p><span style={{ fontSize: '12px', color: '#64748b' }}>{doctor?.specialization}</span></div><MessageSquare size={20} color="#cbd5e1" /></div></>
                            )}

                            {isMedicine && (
                                <><span style={s.label}>Rincian Obat</span><div style={{ background: '#f8fafc', borderRadius: '16px', border: '1px solid #f1f5f9', padding: '15px', marginBottom: '25px', display:'flex', flexDirection:'column', gap:'10px' }}>{items.length > 0 ? items.map((item, idx) => (<div key={idx} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:'14px' }}><div style={{display:'flex', gap:'8px', alignItems:'center'}}><Pill size={14} color="#0ea5e9"/><span style={{color:'#334155'}}>{item.name}</span><span style={{fontSize:'12px', color:'#94a3b8'}}>x{item.quantity}</span></div><span style={{fontWeight:'bold'}}>Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span></div>)) : <div style={{fontSize:'14px', color:'#334155'}}>{trx.note || "Paket Obat"}</div>}</div></>
                            )}

                            <div style={s.totalBox}><div><span style={{ ...s.label, marginBottom: 0 }}>Total Bayar</span><span style={{ fontSize: '12px', color: '#64748b' }}>Termasuk pajak</span></div><span style={{ fontSize: '22px', fontWeight: '800', color: '#0ea5e9' }}>Rp {(total).toLocaleString('id-ID')}</span></div>
                        </div>
                    </div>
                </div>
                <div style={s.btnGroup}>
                    <div style={{ display: 'flex', gap: '10px' }}><button onClick={handleDownload} style={s.btnSecondary}><Download size={18} /> Simpan</button><button style={s.btnSecondary}><Share2 size={18} /> Bagikan</button></div>
                    {isConsultation ? <button onClick={() => navigate(`/chat/${doctor?.user_id || doctor?.id}`, { state: { doctor: doctor } })} style={s.btnPrimary}><MessageCircle size={22} /> MULAI CHAT</button> : <button onClick={() => navigate('/medicines')} style={s.btnPrimary}><ShoppingBag size={22} /> BELANJA LAGI</button>}
                    <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: '#94a3b8', fontWeight: '600', cursor: 'pointer', padding: '10px' }}>Tutup & Kembali</button>
                </div>
            </div>
        </div>
    );
}