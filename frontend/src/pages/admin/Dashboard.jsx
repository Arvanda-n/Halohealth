import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Stethoscope, Pill, FileText, Loader2, TrendingUp, Clock } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

export default function Dashboard() {
  const navigate = useNavigate();

  const [statsData, setStatsData] = useState({ doctors: 0, medicines: 0, articles: 0, users: 0 });
  const [chartData, setChartData] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- LOGIC GRAFIK ---
  const processChartData = (transactions) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    let grouped = months.map(m => ({ name: m, konsultasi: 0, obat: 0 }));

    transactions.forEach(trx => {
        const date = new Date(trx.created_at);
        const monthIndex = date.getMonth();
        const isMedicine = trx.type === 'medicine' || !trx.doctor_id;
        if (isMedicine) grouped[monthIndex].obat += 1;
        else grouped[monthIndex].konsultasi += 1;
    });
    return grouped;
  };

  useEffect(() => {
    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token'); 
            const headers = { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' };

            // 1. STATISTIK
            const resStats = await fetch('http://127.0.0.1:8000/api/admin/dashboard', { headers });
            if(resStats.ok) {
                const result = await resStats.json();
                setStatsData(result.data || { doctors: 0, medicines: 0, articles: 0, users: 0 }); 
            }

            // 2. TRANSAKSI (GRAFIK & AKTIVITAS)
            const resTrx = await fetch('http://127.0.0.1:8000/api/transactions', { headers });
            if (resTrx.ok) {
                const result = await resTrx.json();
                const allTrx = Array.isArray(result.data) ? result.data : [];

                setChartData(processChartData(allTrx));
                
                // Ambil 5 transaksi terbaru
                const recent = allTrx.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5);
                setActivities(recent);
            }
        } catch (error) { console.error("Error dashboard:", error); } 
        finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const timeAgo = (dateString) => {
      const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
      if (seconds < 60) return 'Baru saja';
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return `${minutes}m lalu`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours}j lalu`;
      return `${Math.floor(hours / 24)}h lalu`;
  };

  // 🔥 UPDATED LINK FOR USERS CARD
  const cards = [
    { title: 'Total Dokter', value: statsData.doctors, icon: <Stethoscope size={32} color="white" />, bg: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', link: '/admin/doctors' },
    { title: 'Total Obat', value: statsData.medicines, icon: <Pill size={32} color="white" />, bg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', link: '/admin/medicines' },
    { title: 'Artikel', value: statsData.articles, icon: <FileText size={32} color="white" />, bg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', link: '/admin/articles' },
    // 🔥 Changed link from '#' to '/admin/users'
    { title: 'Total User', value: statsData.users, icon: <Users size={32} color="white" />, bg: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', link: '/admin/users' },
  ];

  if (loading) return <div style={{ display:'flex', justifyContent:'center', marginTop:'100px' }}><Loader2 className="animate-spin" size={40} color="#0ea5e9" /></div>;

  return (
    <div style={{ paddingBottom: '40px' }}>
        <div style={{ marginBottom: '30px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1e293b', marginBottom: '5px' }}>Dashboard Overview</h1>
            <p style={{ color: '#64748b' }}>Pantau kinerja HaloHealth secara realtime.</p>
        </div>

        {/* CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '25px', marginBottom: '40px' }}>
            {cards.map((stat, index) => (
                <div key={index} onClick={() => stat.link !== '#' && navigate(stat.link)} className="hover-card" style={{ background: 'white', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: stat.link !== '#' ? 'pointer' : 'default', transition: '0.2s' }}>
                    <div>
                        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '5px', fontWeight:'600' }}>{stat.title}</p>
                        <h3 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>{stat.value?.toLocaleString('id-ID')}</h3>
                    </div>
                    <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 20px -5px rgba(0, 0, 0, 0.15)' }}>{stat.icon}</div>
                </div>
            ))}
        </div>

        {/* CHART & LOG */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '25px' }}>
            
            {/* 1. GRAFIK */}
            <div style={{ background: 'white', padding: '25px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                    <div>
                        <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b', display:'flex', alignItems:'center', gap:'10px' }}><TrendingUp size={20} color="#0ea5e9"/> Grafik Transaksi</h3>
                        <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Performa penjualan bulan ini</p>
                    </div>
                </div>
                <div style={{ height: '320px', width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                            <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 20px -5px rgba(0,0,0,0.1)' }} />
                            <Bar dataKey="obat" name="Obat" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                            <Bar dataKey="konsultasi" name="Konsultasi" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* 2. AKTIVITAS TERBARU (SUDAH ADA NAMA USER) */}
            <div style={{ background: 'white', padding: '25px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b', marginBottom: '20px', display:'flex', alignItems:'center', gap:'10px' }}>
                    <Clock size={20} color="#f59e0b"/> Aktivitas Terbaru
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {activities.length > 0 ? (
                        activities.map((item, i) => {
                            const isMedicine = item.type === 'medicine' || !item.doctor_id;
                            
                            // 🔥 DATA USER (PEMBELI)
                            const userName = item.user?.name || 'User Tanpa Nama'; 
                            
                            // Data Detail
                            const actionDetail = isMedicine ? (item.note || 'Beli Obat') : `Booking ${item.doctor?.name || 'Dokter'}`;
                            const statusColor = item.status === 'success' ? '#16a34a' : (item.status === 'paid' ? '#16a34a' : '#ea580c');
                            
                            return (
                                <div key={i} style={{ display: 'flex', gap: '15px', alignItems: 'start', paddingBottom: '15px', borderBottom: i !== activities.length - 1 ? '1px dashed #f1f5f9' : 'none' }}>
                                    <div style={{ minWidth: '40px', height: '40px', borderRadius: '12px', background: isMedicine ? '#dcfce7' : '#e0f2fe', display:'flex', alignItems:'center', justifyContent:'center' }}>
                                        {isMedicine ? <Pill size={20} color="#16a34a"/> : <Stethoscope size={20} color="#0284c7"/>}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                            {/* NAMA USER DI SINI */}
                                            <p style={{ margin: '0 0 2px', fontSize: '14px', fontWeight: '700', color: '#334155' }}>{userName}</p>
                                            <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b' }}>Rp {parseInt(item.amount).toLocaleString('id-ID')}</span>
                                        </div>
                                        
                                        {/* DETAIL AKTIVITAS */}
                                        <p style={{ margin: '0 0 5px', fontSize: '12px', color: '#64748b', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', maxWidth:'160px' }}>
                                            {actionDetail}
                                        </p>
                                        
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '11px', color: '#94a3b8' }}>{timeAgo(item.created_at)}</span>
                                            <span style={{ fontSize: '10px', fontWeight: 'bold', color: 'white', background: statusColor, padding: '2px 8px', borderRadius: '10px', textTransform: 'uppercase' }}>{item.status || 'Pending'}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div style={{ textAlign: 'center', color: '#94a3b8', padding: '30px 0' }}>Belum ada aktivitas.</div>
                    )}
                </div>
                
                <button onClick={() => navigate('/admin/orders')} style={{ width: '100%', marginTop: '15px', padding: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', borderRadius: '10px', color: '#64748b', fontWeight: 'bold', cursor: 'pointer', fontSize:'13px', transition:'0.2s' }} onMouseOver={(e) => e.target.style.background = '#f1f5f9'} onMouseOut={(e) => e.target.style.background = '#f8fafc'}>
                    Lihat Semua Transaksi
                </button>
            </div>
        </div>
    </div>
  );
}