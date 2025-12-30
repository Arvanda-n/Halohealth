import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut } from 'lucide-react';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Cek apakah user sudah login (ambil data dari LocalStorage)
  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  // Style untuk Link biar rapi
  const linkStyle = (path) => ({
    textDecoration: 'none',
    color: location.pathname === path ? '#0ea5e9' : '#64748b', // Biru kalau aktif, abu kalau enggak
    fontWeight: location.pathname === path ? 'bold' : '500',
    fontSize: '15px',
    transition: '0.3s'
  });

  return (
    <nav style={{ 
        background: 'white', borderBottom: '1px solid #f1f5f9', 
        position: 'sticky', top: 0, zIndex: 100, 
        padding: '15px 0', boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
    }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        {/* LOGO (Klik balik ke Home) */}
        <Link to="/">
            {/* Pakai logo.png (Logo + Text) biar jelas */}
            <img src="/images/logo.png" alt="HaloHealth Logo" style={{ height: '40px', objectFit: 'contain' }} />
        </Link>

        {/* MENU DESKTOP */}
        <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }} className="hidden-mobile">
            <Link to="/" style={linkStyle('/')}>Beranda</Link>
            <Link to="/doctors" style={linkStyle('/doctors')}>Cari Dokter</Link>
            <Link to="/medicines" style={linkStyle('/medicines')}>Toko Obat</Link>
            <Link to="/articles" style={linkStyle('/articles')}>Artikel</Link>
            
            {/* PEMBATAS */}
            <div style={{ width: '1px', height: '24px', background: '#e2e8f0' }}></div>

            {/* BUTTON LOGIN / PROFILE */}
            {user ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '32px', height: '32px', background: '#e0f2fe', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0ea5e9' }}>
                            <User size={18} />
                        </div>
                        <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#334155' }}>
                            Hai, {user.name.split(' ')[0]} {/* Ambil nama depan aja */}
                        </span>
                    </div>
                    <button 
                        onClick={handleLogout}
                        title="Keluar"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            ) : (
                <Link to="/login">
                    <button style={{ 
                        background: '#0ea5e9', color: 'white', border: 'none', 
                        padding: '10px 24px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer',
                        boxShadow: '0 4px 10px rgba(14, 165, 233, 0.2)'
                    }}>
                        Masuk
                    </button>
                </Link>
            )}
        </div>

        {/* MENU MOBILE (Tampil kalau layar kecil) */}
        {/* Note: Nanti bisa diatur display none/block via CSS media query, ini simpelnya */}
      </div>
    </nav>
  );
}