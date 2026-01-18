import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Stethoscope, Pill, FileText, Loader2, TrendingUp, Calendar, Clock } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

export default function Dashboard() {
  const navigate = useNavigate();

  const [statsData, setStatsData] = useState({
    doctors: 0,
    medicines: 0,
    articles: 0,
    users: 0
  });

  const [activities, setActivities] = useState([]); // 🔥 STATE BARU BUAT TRANSAKSI REAL
  const [loading, setLoading] = useState(true);

  // DATA DUMMY GRAFIK (Tetap dummy dulu karena butuh query complex di backend)
  const chartData = [
    { name: 'Jan', konsultasi: 40, obat: 24 },
    { name: 'Feb', konsultasi: 30, obat: 13 },
    { name: 'Mar', konsultasi: 20, obat: 58 },
    { name: 'Apr', konsultasi: 27, obat: 39 },
    { name: 'Mei', konsultasi: 18, obat: 48 },
    { name: 'Jun', konsultasi: 23, obat: 38 },
    { name: 'Jul', konsultasi: 34, obat: 43 },
    { name: 'Agu', konsultasi: 45, obat: 60 }, 
  ];

  useEffect(() => {
    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token'); 
            const headers = {
                'Authorization': `Bearer ${token}`, 
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            };

            // 1. FETCH STATISTIK KARTU
            const resStats = await fetch('http://127.0.0.1:8000/api/admin/dashboard', { headers });
            if(resStats.ok) {
                const result = await resStats.json();
                setStatsData(result.data); 
            }

            // 2. FETCH AKTIVITAS TERBARU (TRANSAKSI)
            const resActs = await fetch('http://127.0.0.1:8000/api/transactions', { headers });
            if (resActs.ok) {
                const result = await resActs.json();
                const data = result.data ? result.data : (Array.isArray(result) ? result : []);
                
                // Ambil 5 transaksi terakhir & Sortir dari yang paling baru
                const recent = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5);
                setActivities(recent);
            }

        } catch (error) {
            console.error("Error koneksi:", error);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, []);

  // FORMAT WAKTU "X MENIT YANG LALU"
  const timeAgo = (dateString) => {
      const now = new Date();
      const past = new Date(dateString);
      const diffInSeconds = Math.floor((now - past) / 1000);

      if (diffInSeconds < 60) return 'Baru saja';
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} menit yang lalu`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam yang lalu`;
      return `${Math.floor(diffInSeconds / 86400)} hari yang lalu`;
  };

  const cards = [
    { title: 'Total Dokter', value: statsData.doctors, icon: <Stethoscope size={32} color="white" />, bg: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', link: '/admin/doctors' },
    { title: 'Total Obat', value: statsData.medicines, icon: <Pill size={32} color="white" />, bg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', link: '/admin/medicines' },
    { title: 'Artikel', value: statsData.articles, icon: <FileText size={32} color="white" />, bg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', link: '/admin/articles' },
    { title: 'Total User', value: statsData.users, icon: <Users size={32} color="white" />, bg: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', link: '#' },
  ];

  if (loading) {
      return (
        <div style={{ display:'flex', justifyContent:'center', marginTop:'100px' }}>
            <Loader2 className="animate-spin" size={40} color="#0ea5e9" />
        </div>
      );
  }

  return (
    <div style={{ paddingBottom: '40px' }}>
        {/* HEADER */}
        <div style={{ marginBottom: '30px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1e293b', marginBottom: '5px' }}>Dashboard Overview</h1>
            <p style={{ color: '#64748b' }}>Pantau kinerja HaloHealth secara realtime.</p>
        </div>

        {/* GRID KARTU */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '25px', marginBottom: '40px' }}>
            {cards.map((stat, index) => (
                <div 
                    key={index} 
                    onClick={() => stat.link !== '#' && navigate(stat.link)}
                    className="hover-card"
                    style={{ background: 'white', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: stat.link !== '#' ? 'pointer' : 'default', transition: 'transform 0.2s, box-shadow 0.2s' }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                    <div>
                        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '5px', fontWeight:'500' }}>{stat.title}</p>
                        <h3 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>{stat.value.toLocaleString('id-ID')}</h3>
                    </div>
                    <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 20px -5px rgba(0, 0, 0, 0.2)' }}>
                        {stat.icon}
                    </div>
                </div>
            ))}
        </div>

        {/* === SECTION GRAFIK & AKTIVITAS === */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '25px' }}>
            
            {/* 1. GRAFIK */}
            <div style={{ background: 'white', padding: '25px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                    <div>
                        <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b', display:'flex', alignItems:'center', gap:'10px' }}>
                            <TrendingUp size={20} color="#0ea5e9"/> Statistik Transaksi
                        </h3>
                        <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Perbandingan penjualan Obat vs Konsultasi</p>
                    </div>
                    <select style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', fontSize:'13px', cursor:'pointer', outline:'none' }}>
                        <option>Tahun 2024</option>
                    </select>
                </div>
                <div style={{ height: '300px', width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 5, right: 30, left: -20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                            <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}/>
                            <Bar dataKey="obat" name="Penjualan Obat" fill="#0ea5e9" radius={[4, 4, 0, 0]} barSize={30} />
                            <Bar dataKey="konsultasi" name="Konsultasi Dokter" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={30} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* 2. AKTIVITAS TERBARU (REAL-TIME) */}
            <div style={{ background: 'white', padding: '25px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b', marginBottom: '20px', display:'flex', alignItems:'center', gap:'10px' }}>
                    <Calendar size={20} color="#f59e0b"/> Aktivitas Terbaru
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {activities.length > 0 ? (
                        activities.map((item, i) => {
                            // Logic Tampilan per Tipe Transaksi
                            const isMedicine = item.type === 'medicine' || item.type === 'obat';
                            const title = isMedicine ? 'Pesanan Obat Masuk' : 'Jadwal Konsultasi Baru';
                            const desc = isMedicine 
                                ? `User membeli obat seharga Rp ${item.amount?.toLocaleString('id-ID')}` 
                                : `Booking dokter ${item.doctor?.name || 'Spesialis'}`;
                            
                            return (
                                <div key={i} style={{ display: 'flex', gap: '15px', alignItems: 'start' }}>
                                    <div style={{ minWidth: '40px', height: '40px', borderRadius: '50%', background: isMedicine ? '#dcfce7' : '#e0f2fe', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px' }}>
                                        {isMedicine ? '💊' : '👨‍⚕️'}
                                    </div>
                                    <div>
                                        <p style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: '600', color: '#334155' }}>
                                            {title}
                                        </p>
                                        <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
                                            {desc}
                                        </p>
                                        <span style={{ fontSize: '11px', color: '#94a3b8', marginTop:'4px', display:'flex', alignItems:'center', gap:'4px' }}>
                                            <Clock size={10}/> {timeAgo(item.created_at)}
                                        </span>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div style={{ textAlign: 'center', color: '#94a3b8', padding: '20px' }}>Belum ada aktivitas.</div>
                    )}
                </div>
                
                <button 
                    onClick={() => navigate('/admin/transactions')} // Pastikan rutenya ada kalau mau diklik
                    style={{ width: '100%', marginTop: '25px', padding: '12px', border: '1px solid #e2e8f0', background: 'white', borderRadius: '10px', color: '#64748b', fontWeight: 'bold', cursor: 'pointer', fontSize:'13px', transition:'0.2s' }}
                    onMouseOver={(e) => e.target.style.background = '#f8fafc'}
                    onMouseOut={(e) => e.target.style.background = 'white'}
                >
                    Lihat Semua Transaksi
                </button>
            </div>

        </div>
    </div>
  );
}