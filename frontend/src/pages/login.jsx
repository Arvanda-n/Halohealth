import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // 👈 1. IMPORT Link DITAMBAHKAN
import { Stethoscope, Smartphone, Lock, ChevronRight } from 'lucide-react';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // FUNGSI KHUSUS BIAR CUMA BISA KETIK ANGKA
  const handlePhoneChange = (e) => {
    const value = e.target.value;
    // Cek kalau isinya cuma angka (0-9), baru boleh masuk
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setMessage('✅ Login Berhasil!');
        setTimeout(() => navigate('/'), 1000);
      } else {
        setMessage('❌ ' + (data.message || 'Cek Nomor HP & Password'));
      }
    } catch (error) {
      setMessage('⚠️ Gagal koneksi ke server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
        display: 'flex', justifyContent: 'center', alignItems: 'center', 
        minHeight: '100vh', background: '#f8fafc', fontFamily: 'sans-serif'
    }}>
      
      <div style={{ 
          background: 'white', padding: '40px', borderRadius: '20px', 
          boxShadow: '0 10px 40px rgba(0,0,0,0.08)', width: '100%', maxWidth: '380px',
          textAlign: 'center'
      }}>
        
        {/* LOGO */}
        <div style={{ 
            width: '60px', height: '60px', background: '#e0f2fe', borderRadius: '50%', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px auto',
            color: '#0ea5e9'
        }}>
            <Stethoscope size={32} />
        </div>

        <h2 style={{ color: '#0f172a', margin: '0 0 5px 0', fontSize: '24px', fontWeight: 'bold' }}>HaloHealth</h2>
        <p style={{ color: '#64748b', margin: '0 0 30px 0', fontSize: '14px' }}>Masuk untuk konsultasi dokter</p>

        {message && <div style={{ 
            padding: '12px', marginBottom: '20px', borderRadius: '10px', fontSize: '13px', fontWeight: '600',
            background: message.includes('✅') ? '#ecfdf5' : '#fef2f2',
            color: message.includes('✅') ? '#15803d' : '#b91c1c'
        }}>{message}</div>}

        <form onSubmit={handleLogin} style={{ textAlign: 'left' }}>
          
          {/* INPUT NOMOR HP */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '8px' }}>Nomor Ponsel</label>
            <div style={{ 
                display: 'flex', alignItems: 'center', 
                border: '1px solid #cbd5e1', borderRadius: '12px', overflow: 'hidden',
                background: 'white', transition: '0.2s'
            }}>
                <div style={{ 
                    background: '#f1f5f9', padding: '12px 15px', 
                    color: '#475569', fontWeight: 'bold', fontSize: '14px',
                    borderRight: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', gap: '5px'
                }}>
                   <Smartphone size={16} />
                   <span>+62</span>
                </div>
                
                <input 
                  type="text" 
                  inputMode="numeric" 
                  placeholder="812xxxxx"
                  value={phone}
                  onChange={handlePhoneChange} 
                  style={{ 
                      border: 'none', outline: 'none', padding: '12px', 
                      width: '100%', fontSize: '15px', color: '#1e293b'
                  }}
                  required
                />
            </div>
          </div>

          {/* INPUT PASSWORD */}
          <div style={{ marginBottom: '30px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '8px' }}>Kata Sandi</label>
            <div style={{ 
                display: 'flex', alignItems: 'center', 
                border: '1px solid #cbd5e1', borderRadius: '12px', overflow: 'hidden',
                background: 'white'
            }}>
                <div style={{ padding: '12px 0 12px 15px', color: '#94a3b8' }}>
                    <Lock size={18} />
                </div>
                <input 
                    type="password" 
                    placeholder="Masukkan kata sandi"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ 
                        border: 'none', outline: 'none', padding: '12px', 
                        width: '100%', fontSize: '15px', color: '#1e293b'
                    }}
                    required
                />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
                width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
                background: '#0ea5e9', color: 'white', fontWeight: 'bold', fontSize: '16px',
                cursor: loading ? 'not-allowed' : 'pointer', transition: '0.3s',
                display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px',
                boxShadow: '0 4px 12px rgba(14, 165, 233, 0.25)'
            }}
          >
            {loading ? 'Memproses...' : (
                <>
                    Masuk 
                </>
            )}
          </button>
        </form>

        {/* 👇 2. BAGIAN INI SUDAH DIGANTI PAKAI LINK */}
        <p style={{ marginTop: '25px', fontSize: '14px', color: '#64748b' }}>
           Belum punya akun? <Link to="/register" style={{ color: '#0ea5e9', fontWeight: 'bold', textDecoration: 'none' }}>Daftar</Link>
        </p>

      </div>
    </div>
  );
}