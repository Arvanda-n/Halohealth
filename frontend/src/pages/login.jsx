import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Smartphone, Lock, AlertCircle, ArrowLeft, LogIn } from 'lucide-react';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // FUNGSI INPUT HANYA ANGKA
  const handlePhoneChange = (e) => {
    const value = e.target.value;
    if (/^[0-9]*$/.test(value)) {
      setPhone(value);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://127.0.0.1:8000/api/login', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ 
            phone: phone, 
            password: password 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('userInfo', JSON.stringify(data.user));
        
        // Cek Role: Admin -> Dashboard, User -> Home
        if(data.user.role === 'admin') {
            navigate('/admin/dashboard');
        } else {
            navigate('/');
        }
      } else {
        setMessage('❌ ' + (data.message || 'No HP atau Password Salah'));
      }
    } catch (error) {
      console.error(error);
      setMessage('⚠️ Gagal koneksi ke server');
    } finally {
      setLoading(false);
    }
  };

  // --- STYLES COMPACT (NO SCROLL) ---
  const s = {
    container: { 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        background: '#f8fafc', 
        fontFamily: '"Inter", sans-serif',
        overflow: 'hidden'
    },
    card: { 
        width: '100%', 
        maxWidth: '380px', 
        background: 'white', 
        borderRadius: '20px', 
        padding: '35px', 
        boxShadow: '0 10px 30px -5px rgba(0,0,0,0.05)', 
        border: '1px solid #f1f5f9' 
    },
    
    logoArea: { display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '25px' },
    // 🔥 UPDATE: Logo Gambar (80px)
    logo: { width: '80px', marginBottom: '15px', objectFit: 'contain' },
    
    title: { fontSize: '22px', fontWeight: '800', color: '#1e293b' },
    subtitle: { color: '#64748b', fontSize: '13px', marginTop: '2px' },

    inputGroup: { marginBottom: '15px' },
    label: { display: 'block', fontSize: '11px', fontWeight: '700', color: '#475569', marginBottom: '6px', textTransform: 'uppercase' },
    inputWrapper: { display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '0 12px', background: '#fff', height: '42px' },
    input: { width: '100%', border: 'none', outline: 'none', fontSize: '14px', color: '#334155', background: 'transparent' },

    btn: { width: '100%', height: '44px', background: '#0ea5e9', color: 'white', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '20px', boxShadow: '0 4px 12px rgba(14, 165, 233, 0.2)' },
    
    btnBack: { position: 'absolute', top: '20px', left: '20px', display: 'flex', alignItems: 'center', gap: '5px', textDecoration: 'none', color: '#64748b', fontWeight: '600', fontSize: '13px' },
    msgBox: { padding: '10px', marginBottom: '20px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', textAlign: 'center' }
  };

  return (
    <div style={s.container}>
      <Link to="/" style={s.btnBack}><ArrowLeft size={16} /> Home</Link>
      
      <div style={s.card}>
        
        {/* LOGO AREA */}
        <div style={s.logoArea}>
            <img src="/images/logo.png" alt="HaloHealth" style={s.logo} />
            <h2 style={s.title}>Selamat Datang</h2>
            <p style={s.subtitle}>Masuk untuk mulai konsultasi</p>
        </div>

        {/* PESAN ERROR/SUKSES */}
        {message && <div style={{ 
            ...s.msgBox,
            background: message.includes('❌') || message.includes('⚠️') ? '#fef2f2' : '#ecfdf5',
            color: message.includes('❌') || message.includes('⚠️') ? '#ef4444' : '#15803d'
        }}>{message}</div>}

        <form onSubmit={handleLogin}>
          
          {/* INPUT HP */}
          <div style={s.inputGroup}>
            <label style={s.label}>Nomor Ponsel</label>
            <div style={s.inputWrapper}>
                <div style={{ paddingRight: '8px', borderRight: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', gap: '4px', marginRight:'8px', fontSize:'13px', fontWeight:'bold', color:'#64748b' }}>
                    <Smartphone size={16} /><span>+62</span>
                </div>
                <input 
                  type="text" 
                  inputMode="numeric" 
                  placeholder="812xxxxx" 
                  value={phone} 
                  onChange={handlePhoneChange} 
                  style={s.input} 
                  required
                />
            </div>
          </div>

          {/* INPUT PASSWORD */}
          <div style={s.inputGroup}>
            <label style={s.label}>Kata Sandi</label>
            <div style={s.inputWrapper}>
                <Lock size={16} color="#94a3b8" style={{ marginRight: '10px' }} />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  style={s.input} 
                  required
                />
            </div>
          </div>

          <button type="submit" style={s.btn} disabled={loading}>
            {loading ? 'Memproses...' : <>Masuk Sekarang <LogIn size={18} /></>}
          </button>
        </form>

        <p style={{ marginTop: '20px', fontSize: '13px', color: '#64748b', textAlign: 'center' }}>
           Belum punya akun? <Link to="/register" style={{ color: '#0ea5e9', fontWeight: 'bold', textDecoration: 'none' }}>Daftar</Link>
        </p>

      </div>
    </div>
  );
}