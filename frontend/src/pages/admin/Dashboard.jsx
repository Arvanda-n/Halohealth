import { useState, useEffect } from 'react';
import { Users, Stethoscope, Pill, FileText, Loader2 } from 'lucide-react';

export default function Dashboard() {
  // State untuk menyimpan angka dari database
  const [statsData, setStatsData] = useState({
    doctors: 0,
    medicines: 0,
    articles: 0,
    users: 0
  });
  
  const [loading, setLoading] = useState(true);

  // FETCH DATA DARI API BACKEND
  useEffect(() => {
    const fetchStats = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/admin/dashboard');
            if(response.ok) {
                const result = await response.json();
                setStatsData(result.data); // Simpan data ke state
            }
        } catch (error) {
            console.error("Gagal ambil data dashboard:", error);
        } finally {
            setLoading(false);
        }
    };
    fetchStats();
  }, []);

  // Format Tampilan Kartu
  const cards = [
    { 
        title: 'Total Dokter', 
        value: statsData.doctors, 
        icon: <Stethoscope size={32} color="white" />, 
        bg: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' 
    },
    { 
        title: 'Total Obat', 
        value: statsData.medicines, 
        icon: <Pill size={32} color="white" />, 
        bg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
    },
    { 
        title: 'Artikel', 
        value: statsData.articles, 
        icon: <FileText size={32} color="white" />, 
        bg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' 
    },
    { 
        title: 'Total User', 
        value: statsData.users, 
        icon: <Users size={32} color="white" />, 
        bg: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' 
    },
  ];

  if (loading) {
      return (
        <div style={{ display:'flex', justifyContent:'center', marginTop:'50px' }}>
            <Loader2 className="animate-spin" size={40} color="#0ea5e9" />
        </div>
      );
  }

  return (
    <div>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1e293b', marginBottom: '10px' }}>Dashboard Overview</h1>
        <p style={{ color: '#64748b', marginBottom: '30px' }}>Realtime data dari Database HaloHealth.</p>

        {/* GRID STATISTIK */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            {cards.map((stat, index) => (
                <div key={index} style={{ 
                    background: 'white', padding: '24px', borderRadius: '16px', 
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                }}>
                    <div>
                        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '5px' }}>{stat.title}</p>
                        <h3 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1e293b' }}>
                            {stat.value}
                        </h3>
                    </div>
                    <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
                        {stat.icon}
                    </div>
                </div>
            ))}
        </div>

        {/* AREA GRAFIK (Placeholder) */}
        <div style={{ marginTop: '40px', background: 'white', padding: '30px', borderRadius: '16px', minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed #e2e8f0', color: '#94a3b8' }}>
            Grafik Statistik Pengunjung (Coming Soon)
        </div>
    </div>
  );
}