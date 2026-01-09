import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, LogOut } from 'lucide-react'; // Menu & X dihapus kalau gak dipake

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

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

  const linkStyle = (path) => ({
    textDecoration: 'none',
    color: location.pathname === path ? '#0ea5e9' : '#64748b',
    fontWeight: location.pathname === path ? 'bold' : '500',
    fontSize: '15px',
    transition: '0.3s',
    cursor: 'pointer'
  });

  return (
    <>
      {/* 1. NAVBAR UTAMA (FIXED) */}
      <nav style={{ 
          background: 'white', 
          borderBottom: '1px solid #f1f5f9', 
          // 🔥 FORCE FIXED: Pasti nempel di layar manapun
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          zIndex: 999, 
          padding: '12px 0', 
          boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
          height: '80px', // Kita kunci tingginya biar konsisten
          display: 'flex',
          alignItems: 'center'
      }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          
          {/* LOGO */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
              <img 
                  src="/images/logo.png" 
                  alt="HaloHealth Logo" 
                  style={{ height: '55px', objectFit: 'contain' }} 
                  onError={(e) => {e.target.style.display='none'; e.target.nextSibling.style.display='block'}} 
              />
              <h2 style={{ display: 'none', margin: 0, color: '#0ea5e9', fontSize: '28px', fontWeight: 'bold', marginLeft: '10px' }}>HaloHealth</h2>
          </Link>

          {/* MENU DESKTOP */}
          <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }} className="hidden-mobile">
              <Link to="/" style={linkStyle('/')}>Beranda</Link>
              <Link to="/doctors" style={linkStyle('/doctors')}>Cari Dokter</Link>
              <Link to="/medicines" style={linkStyle('/medicines')}>Toko Obat</Link>
              <Link to="/articles" style={linkStyle('/articles')}>Artikel</Link>
              
              <div style={{ width: '1px', height: '24px', background: '#e2e8f0' }}></div>

              {/* BUTTON LOGIN / PROFILE */}
              {user ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <Link to="/profile" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                          <div style={{ width: '38px', height: '38px', background: '#e0f2fe', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0ea5e9', border: '2px solid white', boxShadow: '0 2px 5px rgba(14, 165, 233, 0.2)' }}>
                              <User size={20} />
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#334155' }}>
                                  Hai, {user.name?.split(' ')[0]} 
                              </span>
                              <span style={{ fontSize: '10px', color: '#94a3b8', marginTop: '-2px' }}>Lihat Profil</span>
                          </div>
                      </Link>

                      <button 
                          onClick={handleLogout}
                          title="Keluar"
                          style={{ background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '8px', padding: '8px', cursor: 'pointer', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.2s' }}
                          onMouseOver={(e) => e.currentTarget.style.background = '#fee2e2'}
                          onMouseOut={(e) => e.currentTarget.style.background = '#fef2f2'}
                      >
                          <LogOut size={18} />
                      </button>
                  </div>
              ) : (
                  <Link to="/login">
                      <button style={{ 
                          background: '#0ea5e9', color: 'white', border: 'none', 
                          padding: '10px 24px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer',
                          boxShadow: '0 4px 10px rgba(14, 165, 233, 0.2)', transition: '0.2s'
                      }}
                      onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                      onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                      >
                          Masuk
                      </button>
                  </Link>
              )}
          </div>
        </div>
      </nav>

      {/* 2. SPACER (GANJALAN) */}
      {/* Ini triknya! Div kosong setinggi 80px biar konten halaman gak ketutupan navbar */}
      <div style={{ height: '80px', width: '100%' }}></div>
    </>
  );
}