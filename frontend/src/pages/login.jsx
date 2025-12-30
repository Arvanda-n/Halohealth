import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Stethoscope, Smartphone, Lock } from 'lucide-react';

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

    console.log("Mengirim data:", { phone, password }); // Cek di Console browser (F12)

    try {
      // Pastikan port 8000 (Laravel)
      const response = await fetch('http://127.0.0.1:8000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            phone: phone, // 👈 KIRIM APA ADANYA (JANGAN DITAMBAH 62)
            password: password 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('userInfo', JSON.stringify(data.user));
        
        setMessage('✅ Login Berhasil!');
        setTimeout(() => navigate('/'), 1000); 
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

  return (
    <div style={{ 
        display: 'flex', justifyContent: 'center', alignItems: 'center', 
        minHeight: '100vh', background: '#f8fafc', fontFamily: '"Inter", sans-serif'
    }}>
      
      <div style={{ 
          background: 'white', padding: '40px', borderRadius: '24px', 
          boxShadow: '0 10px 40px rgba(0,0,0,0.05)', width: '100%', maxWidth: '400px',
          textAlign: 'center', border: '1px solid #f1f5f9'
      }}>
        
        <div style={{ 
            width: '70px', height: '70px', background: '#e0f2fe', borderRadius: '50%', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto',
            color: '#0ea5e9'
        }}>
            <Stethoscope size={36} />
        </div>

        <h2 style={{ color: '#0f172a', margin: '0 0 5px 0', fontSize: '26px', fontWeight: '800' }}>HaloHealth</h2>
        <p style={{ color: '#64748b', margin: '0 0 30px 0', fontSize: '14px' }}>Masuk untuk konsultasi dokter</p>

        {message && <div style={{ 
            padding: '12px', marginBottom: '20px', borderRadius: '10px', fontSize: '13px', fontWeight: '600',
            background: message.includes('✅') ? '#ecfdf5' : '#fef2f2',
            color: message.includes('✅') ? '#15803d' : '#ef4444',
            textAlign: 'center'
        }}>{message}</div>}

        <form onSubmit={handleLogin} style={{ textAlign: 'left' }}>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '8px' }}>Nomor Ponsel</label>
            <div style={{ 
                display: 'flex', alignItems: 'center', 
                border: '1px solid #cbd5e1', borderRadius: '12px', overflow: 'hidden',
                background: 'white', transition: '0.2s'
            }}>
                {/* HAPUS BOX +62 BIAR GAK BINGUNG */}
                <div style={{ padding: '14px 0 14px 16px', color: '#94a3b8' }}>
                   <Smartphone size={20} />
                </div>
                
                <input 
                  type="text" 
                  inputMode="numeric" 
                  // Placeholder disesuaikan biar user tau formatnya
                  placeholder="Contoh: 8123456789" 
                  value={phone}
                  onChange={handlePhoneChange} 
                  style={{ 
                      border: 'none', outline: 'none', padding: '14px', 
                      width: '100%', fontSize: '15px', color: '#1e293b', fontWeight: '500'
                  }}
                  required
                />
            </div>
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '8px' }}>Kata Sandi</label>
            <div style={{ 
                display: 'flex', alignItems: 'center', 
                border: '1px solid #cbd5e1', borderRadius: '12px', overflow: 'hidden',
                background: 'white'
            }}>
                <div style={{ padding: '14px 0 14px 16px', color: '#94a3b8' }}>
                    <Lock size={20} />
                </div>
                <input 
                    type="password" 
                    placeholder="Masukkan kata sandi"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ 
                        border: 'none', outline: 'none', padding: '14px', 
                        width: '100%', fontSize: '15px', color: '#1e293b', fontWeight: '500'
                    }}
                    required
                />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
                width: '100%', padding: '16px', borderRadius: '12px', border: 'none',
                background: '#0ea5e9', color: 'white', fontWeight: 'bold', fontSize: '16px',
                cursor: loading ? 'not-allowed' : 'pointer', transition: '0.3s',
                display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px',
                boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)'
            }}
          >
            {loading ? 'Memproses...' : 'Masuk Sekarang'}
          </button>
        </form>

        <p style={{ marginTop: '25px', fontSize: '14px', color: '#64748b' }}>
           Belum punya akun? <Link to="/register" style={{ color: '#0ea5e9', fontWeight: 'bold', textDecoration: 'none' }}>Daftar</Link>
        </p>

      </div>
    </div>
  );
}