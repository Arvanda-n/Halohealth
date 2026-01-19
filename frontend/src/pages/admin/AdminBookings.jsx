import React, { useState, useEffect } from 'react';
import { SidebarAdmin } from '../../components/sidebar';
import { CalendarCheck, Search, CheckCircle, XCircle, Loader2, Stethoscope, Eye, X, Receipt } from 'lucide-react';

export default function BookingDokter() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    
    // 🔥 STATE BARU BUAT MODAL NOTA
    const [selectedTrx, setSelectedTrx] = useState(null);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('http://127.0.0.1:8000/api/transactions', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await res.json();
            const data = result.data ? result.data : result;
            
            const doctorOnly = (Array.isArray(data) ? data : []).filter(item => 
                item.doctor_id || item.type === 'consultation'
            );

            setBookings(doctorOnly.sort((a,b) => b.id - a.id));
        } catch (error) {
            console.error("Gagal ambil data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, newStatus) => {
        const token = localStorage.getItem('token');
        if(!confirm(`Ubah status jadi ${newStatus}?`)) return;

        try {
            await fetch(`http://127.0.0.1:8000/api/transactions/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });
            fetchBookings();
            setSelectedTrx(null); // Tutup modal kalau update dari dalam modal
        } catch (err) { alert("Gagal update"); }
    };

    const filtered = bookings.filter(b => 
        (b.user?.name || '').toLowerCase().includes(search.toLowerCase()) ||
        (b.doctor?.name || '').toLowerCase().includes(search.toLowerCase())
    );

    // --- STYLES ---
    const styles = {
        container: { display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: '"Inter", sans-serif', width: '100%' },
        contentArea: { flex: 1, padding: '30px', overflowX: 'hidden', position: 'relative' }, 
        
        header: { marginBottom: '25px' },
        title: { fontSize: '26px', fontWeight: '800', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '12px' },
        
        card: { background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' },
        toolbar: { padding: '20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between' },
        searchBox: { background: '#f8fafc', padding: '10px 15px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px', width: '350px', border: '1px solid #e2e8f0' },

        table: { width: '100%', borderCollapse: 'collapse', whiteSpace: 'nowrap' },
        thead: { background: '#f8fafc', borderBottom: '2px solid #e2e8f0' },
        th: { padding: '16px 20px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' },
        td: { padding: '16px 20px', fontSize: '14px', color: '#334155', borderBottom: '1px solid #f1f5f9', verticalAlign: 'middle' },
        
        statusBadge: (status) => {
            let color = status === 'success' ? '#166534' : (status === 'pending' ? '#c2410c' : '#991b1b');
            let bg = status === 'success' ? '#dcfce7' : (status === 'pending' ? '#fff7ed' : '#fee2e2');
            return { background: bg, color: color, padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '5px', textTransform: 'uppercase' };
        },

        // 🔥 STYLE MODAL POPUP
        modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 },
        modalContent: { background: 'white', padding: '30px', borderRadius: '20px', width: '450px', maxWidth: '90%', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', position: 'relative' },
        modalHeader: { textAlign: 'center', borderBottom: '2px dashed #e2e8f0', paddingBottom: '20px', marginBottom: '20px' },
        modalRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px', color: '#334155' },
        modalTotal: { display: 'flex', justifyContent: 'space-between', marginTop: '20px', paddingTop: '15px', borderTop: '2px solid #f1f5f9', fontWeight: 'bold', fontSize: '16px' },
        closeBtn: { position: 'absolute', top: '15px', right: '15px', cursor: 'pointer', background: '#f1f5f9', borderRadius: '50%', padding: '5px' }
    };

    return (
        <div style={styles.container}>
            <SidebarAdmin />
            <div style={styles.contentArea}>
                <div style={styles.header}>
                    <h1 style={styles.title}><CalendarCheck size={32} color="#0ea5e9"/> Booking Dokter</h1>
                    <p style={{ color: '#64748b', marginTop: '5px' }}>Verifikasi pembayaran konsultasi.</p>
                </div>

                <div style={styles.card}>
                    <div style={styles.toolbar}>
                        <div style={styles.searchBox}>
                            <Search size={18} color="#94a3b8"/>
                            <input type="text" placeholder="Cari pasien/dokter..." value={search} onChange={e=>setSearch(e.target.value)} style={{border:'none', background:'transparent', outline:'none', width:'100%'}}/>
                        </div>
                        <div style={{ fontSize:'13px', color:'#64748b', display:'flex', alignItems:'center' }}>Total: <b>{filtered.length}</b> Booking</div>
                    </div>

                    <div style={{overflowX:'auto'}}>
                        <table style={styles.table}>
                            <thead style={styles.thead}>
                                <tr>
                                    <th style={styles.th}>ID</th>
                                    <th style={styles.th}>Pasien</th>
                                    <th style={styles.th}>Dokter</th>
                                    <th style={styles.th}>Biaya</th>
                                    <th style={styles.th}>Status</th>
                                    <th style={styles.th}>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? <tr><td colSpan="6" style={{padding:'50px', textAlign:'center'}}><Loader2 className="animate-spin" style={{margin:'0 auto'}}/></td></tr> : 
                                filtered.length > 0 ? filtered.map(b => (
                                    <tr key={b.id}>
                                        <td style={styles.td}>#{b.id}</td>
                                        <td style={styles.td}>
                                            <div style={{fontWeight:'bold'}}>{b.user?.name}</div>
                                            <div style={{fontSize:'12px', color:'#64748b'}}>{b.user?.email}</div>
                                        </td>
                                        <td style={styles.td}>
                                            <div style={{display:'flex', alignItems:'center', gap:'6px', fontWeight:'600', color:'#0ea5e9'}}>
                                                <Stethoscope size={14}/> Dr. {b.doctor?.name}
                                            </div>
                                        </td>
                                        <td style={styles.td}>Rp {parseInt(b.amount).toLocaleString('id-ID')}</td>
                                        <td style={styles.td}>
                                            <span style={styles.statusBadge(b.status)}>{b.status}</span>
                                        </td>
                                        <td style={styles.td}>
                                            <div style={{display:'flex', gap:'8px', alignItems:'center'}}>
                                                {/* 🔥 TOMBOL LIHAT NOTA */}
                                                <button onClick={() => setSelectedTrx(b)} style={{background:'#eff6ff', color:'#3b82f6', border:'none', padding:'6px', borderRadius:'6px', cursor:'pointer'}} title="Lihat Nota">
                                                    <Eye size={16}/>
                                                </button>

                                                {b.status === 'pending' && (
                                                    <>
                                                        <button onClick={()=>handleUpdateStatus(b.id, 'success')} style={{background:'#22c55e', color:'white', border:'none', padding:'6px', borderRadius:'6px', cursor:'pointer'}} title="Terima">
                                                            <CheckCircle size={16}/>
                                                        </button>
                                                        <button onClick={()=>handleUpdateStatus(b.id, 'failed')} style={{background:'white', color:'#ef4444', border:'1px solid #ef4444', padding:'6px', borderRadius:'6px', cursor:'pointer'}} title="Tolak">
                                                            <XCircle size={16}/>
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )) : <tr><td colSpan="6" style={{padding:'50px', textAlign:'center', color:'#94a3b8'}}>Tidak ada data booking.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 🔥 POPUP MODAL NOTA PEMBAYARAN */}
                {selectedTrx && (
                    <div style={styles.modalOverlay} onClick={() => setSelectedTrx(null)}>
                        <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                            <div style={styles.closeBtn} onClick={() => setSelectedTrx(null)}><X size={18} color="#64748b"/></div>
                            
                            <div style={styles.modalHeader}>
                                <div style={{width:'50px', height:'50px', background:'#f0f9ff', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 10px', color:'#0ea5e9'}}>
                                    <Receipt size={24}/>
                                </div>
                                <h2 style={{fontSize:'18px', fontWeight:'800', color:'#1e293b'}}>Bukti Transaksi</h2>
                                <p style={{fontSize:'12px', color:'#64748b'}}>ID: #{selectedTrx.id} • {new Date(selectedTrx.created_at).toLocaleString()}</p>
                            </div>

                            <div style={{marginBottom:'20px'}}>
                                <div style={styles.modalRow}>
                                    <span style={{color:'#64748b'}}>Pasien</span>
                                    <span style={{fontWeight:'bold'}}>{selectedTrx.user?.name}</span>
                                </div>
                                <div style={styles.modalRow}>
                                    <span style={{color:'#64748b'}}>Email</span>
                                    <span>{selectedTrx.user?.email}</span>
                                </div>
                                <div style={styles.modalRow}>
                                    <span style={{color:'#64748b'}}>Metode Bayar</span>
                                    <span style={{textTransform:'uppercase', fontWeight:'bold'}}>{selectedTrx.payment_method || 'GOPAY'}</span>
                                </div>
                            </div>

                            <div style={{background:'#f8fafc', padding:'15px', borderRadius:'10px'}}>
                                <h4 style={{fontSize:'12px', fontWeight:'bold', color:'#94a3b8', textTransform:'uppercase', marginBottom:'10px'}}>Detail Layanan</h4>
                                <div style={{display:'flex', gap:'10px', alignItems:'center'}}>
                                    <div style={{width:'40px', height:'40px', borderRadius:'8px', background:'white', border:'1px solid #e2e8f0', display:'flex', alignItems:'center', justifyContent:'center'}}>
                                        <Stethoscope size={20} color="#0ea5e9"/>
                                    </div>
                                    <div>
                                        <div style={{fontWeight:'bold', fontSize:'14px'}}>Dr. {selectedTrx.doctor?.name}</div>
                                        <div style={{fontSize:'12px', color:'#64748b'}}>Spesialis {selectedTrx.doctor?.specialist}</div>
                                    </div>
                                </div>
                            </div>

                            <div style={styles.modalTotal}>
                                <span>Total Bayar</span>
                                <span style={{color:'#0ea5e9'}}>Rp {parseInt(selectedTrx.amount).toLocaleString('id-ID')}</span>
                            </div>

                            <div style={{marginTop:'20px', display:'flex', gap:'10px'}}>
                                {selectedTrx.status === 'pending' ? (
                                    <>
                                        <button onClick={() => handleUpdateStatus(selectedTrx.id, 'success')} style={{flex:1, padding:'12px', background:'#22c55e', color:'white', border:'none', borderRadius:'10px', fontWeight:'bold', cursor:'pointer'}}>Terima Pembayaran</button>
                                        <button onClick={() => handleUpdateStatus(selectedTrx.id, 'failed')} style={{flex:1, padding:'12px', background:'#fee2e2', color:'#ef4444', border:'none', borderRadius:'10px', fontWeight:'bold', cursor:'pointer'}}>Tolak</button>
                                    </>
                                ) : (
                                    <button style={{width:'100%', padding:'12px', background:'#f1f5f9', color:'#64748b', border:'none', borderRadius:'10px', fontWeight:'bold', cursor:'not-allowed'}}>
                                        Status: {selectedTrx.status.toUpperCase()}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}