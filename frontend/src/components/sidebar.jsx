import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Stethoscope, 
  Pill, 
  FileText, 
  Users, 
  ShoppingCart, 
  CalendarCheck, 
  LogOut,
  ChevronRight,
  Home as HomeIcon,
  MessageCircle,
  Clock,
  CreditCard // Icon baru buat Transaksi
} from 'lucide-react';

// === 1. SIDEBAR KHUSUS ADMIN ===
// (Harus pakai "export" biasa, bukan default)
export function SidebarAdmin() {
  const location = useLocation();
  const navigate = useNavigate();
  const activeColor = '#0ea5e9';
  const inactiveColor = '#64748b';

  const menuItems = [
    { group: "MAIN MENU", items: [
      { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin/dashboard' },
    ]},
    { group: "DATA MASTER", items: [
      { name: 'Kelola Dokter', icon: <Stethoscope size={20} />, path: '/admin/doctors' },
      { name: 'Kelola Obat', icon: <Pill size={20} />, path: '/admin/medicines' },
      { name: 'Kelola Artikel', icon: <FileText size={20} />, path: '/admin/articles' },
    ]},
    { group: "TRANSAKSI", items: [
      { name: 'Pesanan Obat', icon: <ShoppingCart size={20} />, path: '/admin/orders' },
      // 🔥 MENU PENTING BUAT VERIFIKASI PEMBAYARAN
      { name: 'Verifikasi Bayar', icon: <CreditCard size={20} />, path: '/admin/transactions' },
      { name: 'Booking Dokter', icon: <CalendarCheck size={20} />, path: '/admin/bookings' },
    ]},
    { group: "USER MANAGEMENT", items: [
      { name: 'Data User', icon: <Users size={20} />, path: '/admin/users' },
    ]}
  ];

  const handleLogout = () => {
    if(window.confirm("Yakin ingin logout admin?")) {
      localStorage.clear();
      navigate('/login');
    }
  };

  return (
    <div style={{ width: '260px', height: '100vh', background: 'white', borderRight: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', position: 'fixed', left: 0, top: 0, zIndex: 50 }}>
      {/* HEADER SIDEBAR */}
      <div style={{ padding: '30px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ background: activeColor, padding: '8px', borderRadius: '10px', color: 'white' }}>
            <Stethoscope size={24} />
        </div>
        <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#1e293b', margin: 0 }}>HaloHealth</h2>
      </div>

      {/* LIST MENU */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px' }}>
        {menuItems.map((group, idx) => (
          <div key={idx} style={{ marginBottom: '20px' }}>
            <p style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', paddingLeft: '12px', marginBottom: '8px' }}>{group.group}</p>
            {group.items.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link key={item.name} to={item.path} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', borderRadius: '10px', textDecoration: 'none', color: isActive ? activeColor : inactiveColor, background: isActive ? '#f0f9ff' : 'transparent', marginBottom: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {item.icon} 
                    <span style={{ fontSize: '14px', fontWeight: isActive ? '700' : '500' }}>{item.name}</span>
                  </div>
                  {isActive && <ChevronRight size={14} />}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* FOOTER LOGOUT */}
      <div style={{ padding: '20px 16px', borderTop: '1px solid #f1f5f9' }}>
        <button onClick={handleLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '10px', border: 'none', background: '#fff1f2', color: '#e11d48', cursor: 'pointer', fontWeight: '600' }}>
          <LogOut size={20} /> Logout
        </button>
      </div>
    </div>
  );
}

// === 2. SIDEBAR BIASA (USER) ===
// (Ini Default Export, dipakai di halaman User)
export default function Sidebar() {
  const location = useLocation();
  return (
    <aside className="sidebar">
      <h2 className="sidebar-logo">HaloHealth</h2>
      <nav className="sidebar-menu">
        <Link to="/" className={location.pathname === '/' ? 'active' : ''}><HomeIcon size={18}/> Beranda</Link>
        <Link to="/doctors"><MessageCircle size={18}/> Chat Dokter</Link>
        <Link to="/bookings"><Clock size={18}/> Janji Dokter</Link>
        <Link to="/medicines"><Pill size={18}/> Obat</Link>
        <Link to="/history"><FileText size={18}/> Riwayat</Link>
      </nav>
    </aside>
  );
}