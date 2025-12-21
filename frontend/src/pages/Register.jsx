import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Stethoscope, User, Smartphone, Lock, ChevronRight, CheckCircle } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // FILTER INPUT ANGKA SAJA (Sama kayak Login)
  const handlePhoneChange = (e) => {
    const value = e.target.value;
    if (/^[0-9]*$/.test(value)) setPhone(value);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Validasi Password Cocok Gak?
    if (password !== confirmPassword) {
        setMessage('❌ Password dan Konfirmasi tidak sama!');
        return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://127.0.0.1:8000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: name,
            phone: phone,
            password: password,
            password_confirmation: confirmPassword,
            role: 'patient' // Default daftar sebagai Pasien
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('✅ Pendaftaran Berhasil! Silakan Login.');
        // Jeda 1.5 detik terus lempar ke halaman Login
        setTimeout(() => navigate('/login'), 1500);
      } else {
        // Tampilkan error dari Backend (misal: No HP sudah dipakai)
        setMessage('❌ ' + (data.message || 'Gagal Mendaftar'));
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
        minHeight: '100vh', background: '#f8fafc', fontFamily: 'sans-serif', padding: '20px'
    }}>
      
      <div style={{ 
          background: 'white', padding: '40px', borderRadius: '20px', 
          boxShadow: '0 10px 40px rgba(0,0,0,0.08)', width: '100%', maxWidth: '400px',
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

        <h2 style={{ color: '#0f172a', margin: '0 0 5px 0', fontSize: '24px', fontWeight: 'bold' }}>Buat Akun Baru</h2>
        <p style={{ color: '#64748b', margin: '0 0 25px 0', fontSize: '14px' }}>Gabung HaloHealth untuk hidup lebih sehat</p>

        {/* NOTIFIKASI */}
        {message && <div style={{ 
            padding: '12px', marginBottom: '20px', borderRadius: '10px', fontSize: '13px', fontWeight: '600',
            background: message.includes('✅') ? '#ecfdf5' : '#fef2f2',
            color: message.includes('✅') ? '#15803d' : '#b91c1c'
        }}>{message}</div>}

        <form onSubmit={handleRegister} style={{ textAlign: 'left' }}>
          
          {/* 1. NAMA LENGKAP */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '8px' }}>Nama Lengkap</label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '12px', overflow: 'hidden', background: 'white' }}>
                <div style={{ padding: '12px 0 12px 15px', color: '#94a3b8' }}><User size={18} /></div>
                <input type="text" placeholder="Nama Kamu" value={name} onChange={(e) => setName(e.target.value)} required style={{ border: 'none', outline: 'none', padding: '12px', width: '100%', fontSize: '15px', color: '#1e293b' }} />
            </div>
          </div>

          {/* 2. NOMOR PONSEL */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '8px' }}>Nomor Ponsel</label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '12px', overflow: 'hidden', background: 'white' }}>
                <div style={{ background: '#f1f5f9', padding: '12px 15px', color: '#475569', fontWeight: 'bold', fontSize: '14px', borderRight: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', gap: '5px' }}>
                   <Smartphone size={16} /><span>+62</span>
                </div>
                <input type="text" inputMode="numeric" placeholder="812xxxxx" value={phone} onChange={handlePhoneChange} required style={{ border: 'none', outline: 'none', padding: '12px', width: '100%', fontSize: '15px', color: '#1e293b' }} />
            </div>
          </div>

          {/* 3. PASSWORD */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '8px' }}>Kata Sandi</label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '12px', overflow: 'hidden', background: 'white' }}>
                <div style={{ padding: '12px 0 12px 15px', color: '#94a3b8' }}><Lock size={18} /></div>
                <input type="password" placeholder="Minimal 8 karakter" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ border: 'none', outline: 'none', padding: '12px', width: '100%', fontSize: '15px', color: '#1e293b' }} />
            </div>
          </div>

          {/* 4. KONFIRMASI PASSWORD */}
          <div style={{ marginBottom: '25px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '8px' }}>Ulangi Kata Sandi</label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '12px', overflow: 'hidden', background: 'white' }}>
                <div style={{ padding: '12px 0 12px 15px', color: '#94a3b8' }}><CheckCircle size={18} /></div>
                <input type="password" placeholder="Ketik ulang sandi" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required style={{ border: 'none', outline: 'none', padding: '12px', width: '100%', fontSize: '15px', color: '#1e293b' }} />
            </div>
          </div>

          {/* TOMBOL DAFTAR */}
          <button type="submit" disabled={loading} style={{ 
                width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
                background: '#0ea5e9', color: 'white', fontWeight: 'bold', fontSize: '16px',
                cursor: loading ? 'not-allowed' : 'pointer', transition: '0.3s',
                display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px',
                boxShadow: '0 4px 12px rgba(14, 165, 233, 0.25)'
            }}>
            {loading ? 'Mendaftarkan...' : (<>Daftar Sekarang  </>)}
          </button>
        </form>

        <p style={{ marginTop: '25px', fontSize: '14px', color: '#64748b' }}>
           Sudah punya akun? <Link to="/login" style={{ color: '#0ea5e9', fontWeight: 'bold', textDecoration: 'none' }}>Masuk di sini</Link>
        </p>

      </div>
    </div>
  );
}