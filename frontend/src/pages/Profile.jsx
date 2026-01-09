import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/header';
import { User, LogOut, ChevronRight, Heart, Ruler, Weight, History, MapPin, Calendar, FileText } from 'lucide-react';

export default function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    const mainBlue = '#0ea5e9';

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        // 1. Ambil Data User
        fetch('http://127.0.0.1:8000/api/user', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => setUser(data))
        .catch(err => console.error(err));

        // 2. Ambil History Transaksi
        fetchTransactions(token);
    }, []);

    const fetchTransactions = async (token) => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/transactions/history', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setTransactions(Array.isArray(data) ? data : (data.data || []));
        } catch (err) {
            console.error("Gagal ambil history:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        navigate('/login');
    };

    // 🔥 FIX UTAMA: Mapping Data Biar Gak NaN di Struk
    const openReceipt = (trx) => {
        navigate('/payment-receipt', {
            state: {
                doctor: {
                    ...trx.doctor,
                    // Kita kurangi 2500 karena di halaman Receipt nanti ditambah 2500 lagi
                    price: parseInt(trx.amount) - 2500,
                    specialist: trx.doctor?.specialist || 'Dokter Umum'
                },
                transactionId: trx.id
            }
        });
    };

    const calculateBMI = (h, w) => {
        if (!h || !w) return '-';
        const heightInM = h / 100;
        return (w / (heightInM * heightInM)).toFixed(1);
    };
    const bmi = calculateBMI(user?.height, user?.weight);

    const getStatusConfig = (status) => {
        const s = status?.toLowerCase() || 'pending';
        if (s === 'success' || s === 'completed') {
            return { label: 'BERHASIL', bg: '#dcfce7', text: '#166534' };
        } else if (s === 'pending') {
            return { label: 'MENUNGGU', bg: '#ffedd5', text: '#9a3412' };
        } else {
            return { label: 'GAGAL', bg: '#fee2e2', text: '#991b1b' };
        }
    };

    // --- STYLING ---
    const styles = {
        container: { background: '#f8fafc', minHeight: '100vh', fontFamily: '"Inter", sans-serif', paddingBottom: '80px' },
        wrapper: { maxWidth: '1100px', margin: '0 auto', padding: '30px 20px', display: 'grid', gridTemplateColumns: '320px 1fr', gap: '25px' },
        
        // KIRI: KARTU PROFIL
        profileCard: { background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', height: 'fit-content' },
        headerProfile: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' },
        
        avatarSection: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' },
        avatar: { width: '60px', height: '60px', borderRadius: '50%', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: mainBlue, border: `2px solid ${mainBlue}` },
        
        medStats: { background: '#f0f9ff', borderRadius: '12px', padding: '15px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '5px', textAlign: 'center', marginBottom: '20px' },
        statLabel: { fontSize: '10px', color: '#64748b', marginBottom: '2px' },
        statValue: { fontSize: '13px', fontWeight: 'bold', color: '#1e293b' },

        infoRow: { display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px dashed #f1f5f9', fontSize: '13px', color: '#475569' },

        logoutBtn: { width: '100%', marginTop: '20px', padding: '10px', border: '1px solid #fee2e2', background: 'white', color: '#ef4444', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: '0.2s', fontSize: '13px' },

        // KANAN
        sectionTitle: { fontSize: '16px', fontWeight: 'bold', color: '#1e293b', marginBottom: '15px' },
        
        historyItem: { background: 'white', padding: '15px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', cursor: 'pointer', transition: '0.2s' },
        statusBadge: (conf) => ({ background: conf.bg, color: conf.text, padding: '4px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: 'bold', display: 'inline-block' })
    };

    return (
        <div style={styles.container}>
            <Header />

            <div style={styles.wrapper}>
                
                {/* 1. KOLOM KIRI */}
                <div style={styles.profileCard}>
                    <div style={styles.headerProfile}>
                        <span style={{ fontWeight: 'bold', color: '#334155', fontSize: '15px' }}>Profil Saya</span>
                        <button style={{ fontSize: '11px', color: mainBlue, fontWeight: 'bold', background: 'none', border: '1px solid #e0f2fe', padding: '4px 10px', borderRadius: '20px', cursor: 'pointer' }}>Ubah</button>
                    </div>

                    <div style={styles.avatarSection}>
                        <div style={styles.avatar}>
                            <User size={30} />
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                            <h2 style={{ margin: '0 0 2px', fontSize: '16px', fontWeight: 'bold', color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {user?.name || 'User'}
                            </h2>
                            <p style={{ margin: 0, fontSize: '12px', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</p>
                        </div>
                    </div>

                    <div style={styles.medStats}>
                        <div>
                            <div style={styles.statLabel}>Tinggi</div>
                            <div style={styles.statValue}>{user?.height ? `${user.height} cm` : '-'}</div>
                        </div>
                        <div style={{ borderLeft: '1px solid #cbd5e1', borderRight: '1px solid #cbd5e1' }}>
                            <div style={styles.statLabel}>Berat</div>
                            <div style={styles.statValue}>{user?.weight ? `${user.weight} kg` : '-'}</div>
                        </div>
                        <div>
                            <div style={styles.statLabel}>BMI</div>
                            <div style={styles.statValue}>{bmi}</div>
                        </div>
                    </div>

                    <div style={styles.infoRow}>
                        <span>Tanggal Lahir</span>
                        <span style={{ fontWeight: '600' }}>{user?.birth_date ? new Date(user.birth_date).toLocaleDateString('id-ID', {day:'numeric', month:'short', year:'numeric'}) : '-'}</span>
                    </div>
                    <div style={styles.infoRow}>
                        <span>Jenis Kelamin</span>
                        <span style={{ fontWeight: '600' }}>{user?.gender || '-'}</span>
                    </div>
                    <div style={styles.infoRow}>
                        <span>No. HP</span>
                        <span style={{ fontWeight: '600' }}>{user?.phone || '-'}</span>
                    </div>

                    <button onClick={handleLogout} style={styles.logoutBtn} onMouseOver={(e) => e.target.style.background = '#fef2f2'} onMouseOut={(e) => e.target.style.background = 'white'}>
                        <LogOut size={14} /> Keluar
                    </button>
                </div>

                {/* 2. KOLOM KANAN */}
                <div>
                    
                    {/* A. RIWAYAT TRANSAKSI (Utama) */}
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'15px' }}>
                        <h3 style={{...styles.sectionTitle, marginBottom:0}}>
                            <span style={{ display:'flex', alignItems:'center', gap:'8px' }}><History size={18} /> Riwayat Konsultasi</span>
                        </h3>
                    </div>

                    <div style={{ marginBottom: '40px' }}>
                        {loading ? (
                            <p style={{ color: '#94a3b8', fontSize:'13px' }}>Memuat riwayat...</p>
                        ) : transactions.length > 0 ? (
                            <div>
                                {transactions.map((trx) => {
                                    const statusConf = getStatusConfig(trx.status);
                                    
                                    return (
                                        <div 
                                            key={trx.id} 
                                            style={styles.historyItem}
                                            onClick={() => openReceipt(trx)}
                                            onMouseOver={(e) => e.currentTarget.style.borderColor = mainBlue}
                                            onMouseOut={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                                        >
                                            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                                <div style={{ width: '45px', height: '45px', borderRadius: '12px', overflow: 'hidden', background: '#f1f5f9', border:'1px solid #f1f5f9' }}>
                                                    <img 
                                                        src={trx.doctor?.image ? `http://127.0.0.1:8000${trx.doctor.image}` : "https://cdn-icons-png.flaticon.com/512/3774/3774299.png"} 
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                                        alt="doc"
                                                        onError={(e) => e.target.src = "https://cdn-icons-png.flaticon.com/512/3774/3774299.png"}
                                                    />
                                                </div>
                                                <div>
                                                    <p style={{ margin: '0 0 4px', fontWeight: 'bold', color: '#1e293b', fontSize:'14px' }}>
                                                        {trx.doctor?.name || 'Dokter'}
                                                    </p>
                                                    <div style={{ display: 'flex', gap: '10px', fontSize: '11px', color: '#64748b' }}>
                                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                            <Calendar size={11} /> 
                                                            {new Date(trx.created_at).toLocaleDateString('id-ID', {
                                                                day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute:'2-digit'
                                                            })}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div style={{ textAlign: 'right' }}>
                                                <div style={styles.statusBadge(statusConf)}>
                                                    {statusConf.label}
                                                </div>
                                                <p style={{ margin: '5px 0 0', fontWeight: 'bold', color: mainBlue, fontSize:'14px' }}>
                                                    Rp {parseInt(trx.amount).toLocaleString('id-ID')}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '30px', background: 'white', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
                                <FileText size={30} color="#cbd5e1" style={{ margin: '0 auto 10px' }} />
                                <p style={{ fontWeight: 'bold', color: '#64748b', fontSize:'13px' }}>Belum ada riwayat.</p>
                                <button onClick={() => navigate('/doctors')} style={{ marginTop: '5px', color: mainBlue, fontWeight: 'bold', background: 'none', border: 'none', cursor: 'pointer', fontSize:'13px' }}>
                                    Cari Dokter →
                                </button>
                            </div>
                        )}
                    </div>

                    {/* B. MENU KESEHATAN CEPAT */}
                    <h3 style={styles.sectionTitle}>Tingkatkan Kesehatanmu</h3>
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'15px' }}>
                        {[
                            { name: 'BMI Calc', icon: <Ruler size={18} color="white"/>, bg: '#3b82f6' },
                            { name: 'Jantung', icon: <Heart size={18} color="white"/>, bg: '#ef4444' },
                            { name: 'Kalori', icon: <Weight size={18} color="white"/>, bg: '#10b981' },
                        ].map((item, i) => (
                            <div key={i} style={{ background:'white', padding:'12px', borderRadius:'12px', border:'1px solid #e2e8f0', display:'flex', alignItems:'center', gap:'10px', cursor:'pointer' }}>
                                <div style={{ width:'32px', height:'32px', borderRadius:'50%', background: item.bg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink: 0 }}>
                                    {item.icon}
                                </div>
                                <span style={{ fontSize:'12px', fontWeight:'600', color:'#334155' }}>{item.name}</span>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
}