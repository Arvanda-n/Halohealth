import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/header';
import { User, LogOut, History, Ruler, Heart, Weight, FileText, Pill, Stethoscope, Calendar } from 'lucide-react';

export default function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');

    const mainBlue = '#0ea5e9';

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) { navigate('/login'); return; }

        const userData = localStorage.getItem('userInfo');
        if (userData) setUser(JSON.parse(userData));

        fetchTransactions(token);
    }, []);

    const fetchTransactions = async (token) => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/transactions/history', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            const list = Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []);
            setTransactions(list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
        } catch (err) { console.error("Gagal ambil history:", err); } 
        finally { setLoading(false); }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        navigate('/login');
    };

    const filteredTransactions = transactions.filter(trx => {
        const isMedicine = trx.type === 'medicine' || !trx.doctor_id;
        if (activeTab === 'medicine') return isMedicine;
        if (activeTab === 'consultation') return !isMedicine;
        return true;
    });

    const openReceipt = (trx) => {
        const isMedicine = trx.type === 'medicine' || !trx.doctor_id;
        
        // 🔥 LOGIC GABUNGAN DATA DOKTER
        // Kita gabung data User (trx.doctor) dan Profile Lengkap (trx.doctor_data)
        const completeDoctorData = !isMedicine ? {
            id: trx.doctor_id,
            name: trx.doctor?.name || 'Dokter',
            // Ambil foto & spesialis dari doctor_data (hasil join backend baru)
            image: trx.doctor_data?.image || null, 
            specialist: trx.doctor_data?.specialization || trx.doctor_data?.specialist || 'Dokter Umum',
            price: parseFloat(trx.amount) - 2500
        } : null;

        const itemName = trx.note && trx.note !== 'Konsultasi Dokter' ? trx.note : 'Paket Obat HaloHealth';

        navigate('/payment-receipt', {
            state: {
                doctor: completeDoctorData,
                items: isMedicine ? [{ name: itemName, price: parseFloat(trx.amount) - 2500, quantity: 1, image: '' }] : [],
                transactionId: trx.id,
                total: parseFloat(trx.amount),
                date: trx.created_at,
                shopInfo: isMedicine ? { name: "Apotek HaloHealth", image: "https://cdn-icons-png.flaticon.com/512/1048/1048953.png" } : null
            }
        });
    };

    // Helper Styles & Logic
    const calculateBMI = (h, w) => (!h || !w) ? '-' : (w / ((h / 100) * (h / 100))).toFixed(1);
    const bmi = calculateBMI(user?.height, user?.weight);

    const getStatusConfig = (status) => {
        const s = (status || 'pending').toLowerCase();
        if (['success', 'completed', 'paid'].includes(s)) return { label: 'BERHASIL', bg: '#dcfce7', text: '#166534' };
        if (s === 'pending') return { label: 'MENUNGGU', bg: '#ffedd5', text: '#9a3412' };
        return { label: 'GAGAL', bg: '#fee2e2', text: '#991b1b' };
    };

    const styles = {
        container: { background: '#f8fafc', minHeight: '100vh', fontFamily: '"Inter", sans-serif', paddingBottom: '80px' },
        wrapper: { maxWidth: '1100px', margin: '0 auto', padding: '30px 20px', display: 'grid', gridTemplateColumns: '320px 1fr', gap: '25px', paddingTop:'120px' },
        profileCard: { background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '25px', height: 'fit-content' },
        tabButton: (isActive) => ({
            padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', border: '1px solid',
            borderColor: isActive ? mainBlue : '#e2e8f0', background: isActive ? '#e0f2fe' : 'white', color: isActive ? mainBlue : '#64748b', transition: '0.2s'
        }),
        historyItem: { background: 'white', padding: '18px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', cursor: 'pointer', transition: '0.2s' },
    };

    return (
        <div style={styles.container}>
            <Header />
            <div style={styles.wrapper}>
                
                {/* 1. KARTU PROFIL */}
                <div style={styles.profileCard}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '25px' }}>
                        <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: mainBlue, fontSize: '24px', fontWeight: 'bold' }}>{user?.name?.charAt(0) || 'U'}</div>
                        <h2 style={{ margin: '15px 0 5px', fontSize: '18px', fontWeight: 'bold', color: '#1e293b' }}>{user?.name || 'User'}</h2>
                        <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>{user?.email}</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', background: '#f8fafc', padding: '15px', borderRadius: '12px', marginBottom: '25px' }}>
                        <div style={{ textAlign: 'center' }}><span style={{ fontSize: '11px', color: '#64748b' }}>Tinggi</span><div style={{ fontWeight: 'bold', fontSize: '14px' }}>{user?.height || '-'} cm</div></div>
                        <div style={{ textAlign: 'center', borderLeft: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0' }}><span style={{ fontSize: '11px', color: '#64748b' }}>Berat</span><div style={{ fontWeight: 'bold', fontSize: '14px' }}>{user?.weight || '-'} kg</div></div>
                        <div style={{ textAlign: 'center' }}><span style={{ fontSize: '11px', color: '#64748b' }}>BMI</span><div style={{ fontWeight: 'bold', fontSize: '14px', color: mainBlue }}>{bmi}</div></div>
                    </div>
                    <button onClick={handleLogout} style={{ width: '100%', padding: '12px', border: '1px solid #fee2e2', background: 'white', color: '#ef4444', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <LogOut size={16} /> Keluar
                    </button>
                </div>

                {/* 2. HISTORY */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '10px' }}><History size={20} /> Riwayat Transaksi</h3>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={() => setActiveTab('all')} style={styles.tabButton(activeTab === 'all')}>Semua</button>
                            <button onClick={() => setActiveTab('consultation')} style={styles.tabButton(activeTab === 'consultation')}>Konsultasi</button>
                            <button onClick={() => setActiveTab('medicine')} style={styles.tabButton(activeTab === 'medicine')}>Obat</button>
                        </div>
                    </div>

                    {loading ? <p style={{ color: '#94a3b8', textAlign:'center', marginTop:'50px' }}>Memuat data...</p> : filteredTransactions.length > 0 ? (
                        <div>
                            {filteredTransactions.map((trx) => {
                                const isMedicine = trx.type === 'medicine' || !trx.doctor_id;
                                const statusConf = getStatusConfig(trx.status);
                                // Judul Item
                                const title = isMedicine ? (trx.note || 'Pembelian Obat') : (trx.doctor?.name || 'Konsultasi Dokter');
                                
                                return (
                                    <div key={trx.id} style={styles.historyItem} onClick={() => openReceipt(trx)} className="hover-card">
                                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                            <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: isMedicine ? '#dcfce7' : '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isMedicine ? '#166534' : mainBlue }}>
                                                {isMedicine ? <Pill size={24} /> : <Stethoscope size={24} />}
                                            </div>
                                            <div>
                                                <p style={{ margin: '0 0 4px', fontWeight: 'bold', color: '#1e293b', fontSize: '15px', maxWidth:'300px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                                                    {title}
                                                </p>
                                                <div style={{ display: 'flex', gap: '15px', fontSize: '12px', color: '#64748b' }}>
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        <Calendar size={12} /> {new Date(trx.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute:'2-digit' })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <span style={{ background: statusConf.bg, color: statusConf.text, padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold' }}>{statusConf.label}</span>
                                            <p style={{ margin: '8px 0 0', fontWeight: 'bold', color: '#1e293b', fontSize: '15px' }}>Rp {parseFloat(trx.amount).toLocaleString('id-ID')}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '50px', background: 'white', borderRadius: '16px', border: '1px dashed #cbd5e1' }}><FileText size={40} color="#cbd5e1" style={{ margin: '0 auto 15px' }} /><p style={{ color: '#64748b' }}>Belum ada riwayat transaksi.</p></div>
                    )}
                </div>
            </div>
        </div>
    );
}