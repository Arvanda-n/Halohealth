import React, { useState, useEffect } from 'react';
import { SidebarAdmin } from '../../components/sidebar';
import { ShoppingBag, Search, CheckCircle, XCircle, Clock, Pill, User, Loader2, Package, Eye, X, Receipt } from 'lucide-react';

export default function AdminOrders() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    
    // State for Receipt Modal
    const [selectedTrx, setSelectedTrx] = useState(null);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('http://127.0.0.1:8000/api/transactions', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await res.json();
            const data = result.data ? result.data : result;
            
            // 🔥 FILTER: HANYA OBAT (MEDICINE)
            const medicineOnly = (Array.isArray(data) ? data : []).filter(item => 
                item.type === 'medicine' || (!item.doctor_id && item.type !== 'consultation')
            );

            setTransactions(medicineOnly.sort((a,b) => b.id - a.id));
        } catch (error) {
            console.error("Gagal ambil data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, newStatus) => {
        const token = localStorage.getItem('token');
        const confirmMsg = newStatus === 'success' ? "Terima pesanan ini? Stok akan berkurang." : "Tolak pesanan ini?";
        if(!confirm(confirmMsg)) return;

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/transactions/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                alert(`Status berhasil diubah jadi: ${newStatus.toUpperCase()}`);
                fetchTransactions(); 
                setSelectedTrx(null); // Close modal if open
            } else {
                alert("Gagal update status.");
            }
        } catch (err) {
            alert("Terjadi kesalahan koneksi.");
        }
    };

    const filteredTrx = transactions.filter(item => 
        (item.user?.name || '').toLowerCase().includes(search.toLowerCase()) ||
        (item.note || '').toLowerCase().includes(search.toLowerCase())
    );

    // --- STYLES ---
    const styles = {
        container: { display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: '"Inter", sans-serif', width: '100%' },
        contentArea: { flex: 1, padding: '30px', overflowX: 'hidden' }, 
        wrapper: { width: '100%' },

        header: { marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' },
        title: { fontSize: '26px', fontWeight: '800', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' },
        subtitle: { color: '#64748b', fontSize: '14px' },

        card: { background: 'white', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', overflow: 'hidden' },
        
        toolbar: { padding: '20px', borderBottom: '1px solid #f1f5f9', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
        searchBox: { display: 'flex', alignItems: 'center', gap: '10px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '10px 15px', width: '350px' },
        input: { border: 'none', background: 'transparent', outline: 'none', fontSize: '14px', color: '#334155', width: '100%' },

        tableContainer: { width: '100%', overflowX: 'auto' },
        table: { width: '100%', borderCollapse: 'collapse', whiteSpace: 'nowrap' }, 
        thead: { background: '#f8fafc', borderBottom: '2px solid #e2e8f0' },
        th: { padding: '16px 20px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' },
        tr: { borderBottom: '1px solid #f1f5f9' },
        td: { padding: '16px 20px', fontSize: '14px', color: '#334155', verticalAlign: 'middle' },

        idBadge: { fontFamily: 'monospace', fontWeight: 'bold', color: '#0ea5e9', background: '#e0f2fe', padding: '4px 8px', borderRadius: '6px', fontSize: '12px' },
        
        statusBadge: (status) => {
            let bg = '#f1f5f9', text = '#64748b', icon = <Clock size={14}/>;
            if(status === 'success') { bg = '#dcfce7'; text = '#166534'; icon = <CheckCircle size={14}/>; }
            else if(status === 'failed') { bg = '#fee2e2'; text = '#991b1b'; icon = <XCircle size={14}/>; }
            else if(status === 'pending') { bg = '#fff7ed'; text = '#c2410c'; }
            
            return {
                background: bg, color: text,
                padding: '6px 12px', borderRadius: '30px', fontSize: '12px', fontWeight: '700', 
                display: 'inline-flex', alignItems: 'center', gap: '6px', textTransform: 'uppercase'
            };
        },

        // Modal Styles
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
                <div style={styles.wrapper}>
                    
                    {/* Header */}
                    <div style={styles.header}>
                        <div>
                            <h1 style={styles.title}>
                                <ShoppingBag size={32} color="#0ea5e9" fill="#e0f2fe" /> 
                                Pesanan Obat
                            </h1>
                            <p style={styles.subtitle}>
                                Daftar transaksi pembelian obat masuk.
                            </p>
                        </div>
                    </div>

                    {/* Card Content */}
                    <div style={styles.card}>
                        
                        {/* Search Toolbar */}
                        <div style={styles.toolbar}>
                            <div style={styles.searchBox}>
                                <Search size={18} color="#94a3b8" />
                                <input 
                                    style={styles.input} 
                                    placeholder="Cari pesanan..." 
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <div style={{ fontSize:'13px', color:'#64748b' }}>
                                <b>{filteredTrx.length}</b> Pesanan
                            </div>
                        </div>

                        {/* Tabel Data */}
                        <div style={styles.tableContainer}>
                            <table style={styles.table}>
                                <thead style={styles.thead}>
                                    <tr>
                                        <th style={styles.th}>ID Order</th>
                                        <th style={styles.th}>Pasien</th>
                                        <th style={styles.th}>Item</th>
                                        <th style={styles.th}>Total</th>
                                        <th style={styles.th}>Status</th>
                                        <th style={styles.th}>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="6" style={{ padding: '80px', textAlign: 'center' }}><Loader2 className="animate-spin" style={{margin:'0 auto', color:'#0ea5e9'}}/></td></tr>
                                    ) : filteredTrx.length > 0 ? (
                                        filteredTrx.map((trx, i) => (
                                            <tr key={trx.id} style={{ ...styles.tr, background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                                                
                                                <td style={styles.td}>
                                                    <span style={styles.idBadge}>#{trx.id}</span>
                                                    <div style={{ fontSize: '11px', color: '#94a3b8', marginTop:'4px' }}>
                                                        {new Date(trx.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                                    </div>
                                                </td>

                                                <td style={styles.td}>
                                                    <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                                                        <div style={{ width:'32px', height:'32px', borderRadius:'50%', background:'#f1f5f9', display:'flex', alignItems:'center', justifyContent:'center', color:'#64748b' }}><User size={16}/></div>
                                                        <div>
                                                            <div style={{ fontWeight: '600', color:'#1e293b' }}>{trx.user?.name || 'Guest'}</div>
                                                            <div style={{ fontSize: '11px', color: '#64748b' }}>{trx.user?.email}</div>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td style={styles.td}>
                                                    <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                                                        <Package size={16} color="#0ea5e9"/>
                                                        <div style={{ fontSize: '13px', color: '#334155', fontWeight:'500', maxWidth:'200px', overflow:'hidden', textOverflow:'ellipsis' }}>
                                                            {trx.note || 'Obat'}
                                                        </div>
                                                    </div>
                                                </td>

                                                <td style={{ ...styles.td, fontWeight: 'bold', color: '#0f172a' }}>
                                                    Rp {parseInt(trx.amount).toLocaleString('id-ID')}
                                                </td>

                                                <td style={styles.td}>
                                                    <div style={styles.statusBadge(trx.status)}>
                                                        {styles.statusBadge(trx.status).icon} {trx.status === 'success' ? 'Lunas' : trx.status}
                                                    </div>
                                                </td>

                                                <td style={styles.td}>
                                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                        {/* Button Lihat Nota */}
                                                        <button onClick={() => setSelectedTrx(trx)} style={{ background: '#eff6ff', color: '#3b82f6', border: 'none', padding: '6px', borderRadius: '6px', cursor: 'pointer' }} title="Lihat Nota">
                                                            <Eye size={16} />
                                                        </button>

                                                        {/* 🔥 INI YANG DIUBAH: Kalau bukan pending, tombol aksi HILANG (Kosong) */}
                                                        {trx.status === 'pending' && (
                                                            <>
                                                                <button onClick={() => handleUpdateStatus(trx.id, 'success')} style={{ background: '#22c55e', color: 'white', border: 'none', padding: '6px', borderRadius: '6px', cursor: 'pointer' }} title="Terima">
                                                                    <CheckCircle size={16} />
                                                                </button>
                                                                <button onClick={() => handleUpdateStatus(trx.id, 'failed')} style={{ background: 'white', color: '#ef4444', border: '1px solid #ef4444', padding: '6px', borderRadius: '6px', cursor: 'pointer' }} title="Tolak">
                                                                    <XCircle size={16} />
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" style={{ padding: '80px', textAlign: 'center', color: '#94a3b8' }}>
                                                <div style={{ width:'80px', height:'80px', background:'#f1f5f9', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 15px' }}>
                                                    <ShoppingBag size={40} color="#cbd5e1"/>
                                                </div>
                                                <p style={{ fontWeight:'600', color:'#475569' }}>Belum ada pesanan masuk.</p>
                                                <small>Pesanan obat dari pasien akan muncul di sini.</small>
                                            </td>
                                        </tr>
                                    )}
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
                                    <h2 style={{fontSize:'18px', fontWeight:'800', color:'#1e293b'}}>Bukti Pesanan Obat</h2>
                                    <p style={{fontSize:'12px', color:'#64748b'}}>ID: #{selectedTrx.id} • {new Date(selectedTrx.created_at).toLocaleString()}</p>
                                </div>

                                <div style={{marginBottom:'20px'}}>
                                    <div style={styles.modalRow}>
                                        <span style={{color:'#64748b'}}>Pemesan</span>
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
                                    <h4 style={{fontSize:'12px', fontWeight:'bold', color:'#94a3b8', textTransform:'uppercase', marginBottom:'10px'}}>Rincian Barang</h4>
                                    <div style={{display:'flex', gap:'10px', alignItems:'start'}}>
                                        <div style={{minWidth:'40px', height:'40px', borderRadius:'8px', background:'white', border:'1px solid #e2e8f0', display:'flex', alignItems:'center', justifyContent:'center'}}>
                                            <Package size={20} color="#0ea5e9"/>
                                        </div>
                                        <div>
                                            <div style={{fontWeight:'bold', fontSize:'14px', lineHeight:'1.4'}}>{selectedTrx.note || 'Obat'}</div>
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
                                            <button onClick={() => handleUpdateStatus(selectedTrx.id, 'success')} style={{flex:1, padding:'12px', background:'#22c55e', color:'white', border:'none', borderRadius:'10px', fontWeight:'bold', cursor:'pointer'}}>Terima Pesanan</button>
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
        </div>
    );
}