import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Smartphone, Lock, CheckCircle, ArrowRight, AlertCircle, ArrowLeft, Mail } from 'lucide-react';

export default function Register() {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '', 
        password: '',
        password_confirmation: '',
        role: 'patient'
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value;
        if (/^[0-9]*$/.test(value)) {
            setFormData({ ...formData, phone: value });
        }
    };

    // 🔥 FUNGSI CEK FORMAT EMAIL (REGEX)
    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // 1. CEK PASSWORD MATCH
        if(formData.password !== formData.password_confirmation) {
            setError("Password konfirmasi tidak cocok!");
            setLoading(false);
            return;
        }

        // 2. 🔥 CEK FORMAT EMAIL SECARA MANUAL
        if (!isValidEmail(formData.email)) {
            setError("Format email tidak valid! (Harus pakai @ dan nama domain)");
            setLoading(false);
            return;
        }

        // 3. CEK PANJANG NO HP
        if (formData.phone.length < 10) {
            setError("Nomor HP terlalu pendek!");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/api/register', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json' 
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                alert("Registrasi Berhasil! Silakan Login.");
                navigate('/login');
            } else {
                setError(data.message || 'Gagal mendaftar. Email/HP mungkin sudah dipakai.');
            }
        } catch (err) {
            setError('Gagal koneksi. Pastikan Backend menyala!');
        } finally {
            setLoading(false);
        }
    };

    // --- STYLES COMPACT ---
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
            padding: '30px', 
            boxShadow: '0 10px 30px -5px rgba(0,0,0,0.05)', 
            border: '1px solid #f1f5f9' 
        },
        logoArea: { display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' },
        logo: { width: '80px', marginBottom: '10px', objectFit: 'contain' },
        title: { fontSize: '20px', fontWeight: '800', color: '#1e293b' },
        subtitle: { color: '#64748b', fontSize: '13px', marginTop: '2px' },
        inputGroup: { marginBottom: '12px' },
        label: { display: 'block', fontSize: '10px', fontWeight: '700', color: '#475569', marginBottom: '4px', textTransform: 'uppercase' },
        inputWrapper: { display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '0 10px', background: '#fff', height: '40px' },
        input: { width: '100%', border: 'none', outline: 'none', fontSize: '13px', color: '#334155', background: 'transparent' },
        btn: { width: '100%', height: '42px', background: '#0ea5e9', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '15px' },
        btnBack: { position: 'absolute', top: '20px', left: '20px', display: 'flex', alignItems: 'center', gap: '5px', textDecoration: 'none', color: '#64748b', fontWeight: '600', fontSize: '13px' },
        errorBox: { background: '#fee2e2', color: '#991b1b', padding: '10px', borderRadius: '8px', fontSize: '12px', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }
    };

    return (
        <div style={s.container}>
            <Link to="/" style={s.btnBack}><ArrowLeft size={16} /> Home</Link>

            <div style={s.card}>
                <div style={s.logoArea}>
                    <img src="/images/logo.png" alt="HaloHealth" style={s.logo} onError={(e)=>e.target.style.display='none'}/>
                    <h1 style={s.title}>Buat Akun Baru</h1>
                    <p style={s.subtitle}>Gabung HaloHealth sekarang</p>
                </div>

                {error && <div style={s.errorBox}><AlertCircle size={14}/> {error}</div>}

                <form onSubmit={handleRegister}>
                    {/* NAMA */}
                    <div style={s.inputGroup}>
                        <label style={s.label}>Nama Lengkap</label>
                        <div style={s.inputWrapper}>
                            <User size={16} color="#94a3b8" style={{ marginRight: '8px' }} />
                            <input name="name" type="text" placeholder="Nama Kamu" style={s.input} onChange={handleChange} required />
                        </div>
                    </div>

                    {/* EMAIL */}
                    <div style={s.inputGroup}>
                        <label style={s.label}>Alamat Email</label>
                        <div style={s.inputWrapper}>
                            <Mail size={16} color="#94a3b8" style={{ marginRight: '8px' }} />
                            {/* type="email" juga membantu validasi browser */}
                            <input name="email" type="email" placeholder="contoh@email.com" style={s.input} onChange={handleChange} required />
                        </div>
                    </div>

                    {/* NO HP */}
                    <div style={s.inputGroup}>
                        <label style={s.label}>Nomor Ponsel</label>
                        <div style={s.inputWrapper}>
                            <div style={{ paddingRight: '8px', borderRight: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', gap: '4px', marginRight:'8px', fontSize:'13px', fontWeight:'bold', color:'#64748b' }}>
                               <span>+62</span>
                            </div>
                            <input name="phone" type="text" inputMode="numeric" placeholder="812xxxxx" value={formData.phone} onChange={handlePhoneChange} required style={s.input} />
                        </div>
                    </div>

                    {/* PASSWORD */}
                    <div style={s.inputGroup}>
                        <label style={s.label}>Kata Sandi</label>
                        <div style={s.inputWrapper}>
                            <Lock size={16} color="#94a3b8" style={{ marginRight: '8px' }} />
                            <input name="password" type="password" placeholder="••••••••" style={s.input} onChange={handleChange} required />
                        </div>
                    </div>

                    {/* CONFIRM PASSWORD */}
                    <div style={s.inputGroup}>
                        <label style={s.label}>Ulangi Kata Sandi</label>
                        <div style={s.inputWrapper}>
                            <CheckCircle size={16} color="#94a3b8" style={{ marginRight: '8px' }} />
                            <input name="password_confirmation" type="password" placeholder="••••••••" style={s.input} onChange={handleChange} required />
                        </div>
                    </div>

                    <button type="submit" style={s.btn} disabled={loading}>
                        {loading ? 'Mendaftar...' : <>Daftar <ArrowRight size={16} /></>}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '15px', fontSize: '12px', color: '#64748b' }}>
                    Sudah punya akun? <Link to="/login" style={{ color: '#0ea5e9', fontWeight: 'bold', textDecoration: 'none' }}>Masuk</Link>
                </p>
            </div>
        </div>
    );
}