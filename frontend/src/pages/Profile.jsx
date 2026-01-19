import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/header';
import Footer from '../components/Footer';
import { User, LogOut, FileText, Loader2, Edit2, Save, Key, Phone, Mail, Ruler, Weight, Activity, Camera, Pill, ChevronRight } from 'lucide-react';

export default function Profile() {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [user, setUser] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // 🔥 FILTER STATE
    const [filterType, setFilterType] = useState('all'); 

    // EDIT STATE
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        name: '', email: '', phone: '', 
        height: '', weight: '',
        password: '', current_password: '' 
    });
    
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchProfileData();
    }, []);

    const fetchProfileData = async () => {
        const token = localStorage.getItem('token');
        if (!token) { navigate('/login'); return; }

        try {
            const resUser = await fetch('http://127.0.0.1:8000/api/user', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const userData = await resUser.json();
            setUser(userData);
            
            setEditData({
                name: userData.name, email: userData.email, phone: userData.phone,
                height: userData.height || '', weight: userData.weight || '',
                password: '', current_password: '' 
            });

            const resTrx = await fetch('http://127.0.0.1:8000/api/transactions/history', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const trxData = await resTrx.json();
            setTransactions(Array.isArray(trxData.data) ? trxData.data : []);

        } catch (error) {
            localStorage.clear();
            navigate('/login');
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    // --- LOGIC GAMBAR (SAMA DENGAN RECEIPT) ---
    const getProfileImage = (path) => {
        if (previewUrl) return previewUrl;
        if (!path) return "https://cdn-icons-png.flaticon.com/512/3774/3774299.png";
        
        if (path.startsWith('http')) return path;
        
        let cleanPath = path.replace(/^public\//, '').replace(/^\//, '');
        
        if (cleanPath.startsWith('uploads/')) {
             return `http://127.0.0.1:8000/${cleanPath}`;
        }
        
        return `http://127.0.0.1:8000/storage/${cleanPath}`;
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setSaving(true);
        const token = localStorage.getItem('token');

        if(editData.password.trim() !== '') {
            if(!editData.current_password) {
                alert("Harap isi Password Lama untuk keamanan jika ingin mengganti password!");
                setSaving(false); return;
            }
        }

        const formData = new FormData();
        formData.append('name', editData.name);
        formData.append('email', editData.email);
        formData.append('phone', editData.phone);
        formData.append('height', editData.height);
        formData.append('weight', editData.weight);
        
        if (editData.password.trim() !== '') {
            formData.append('password', editData.password);
            formData.append('current_password', editData.current_password);
        }

        if (selectedImage) formData.append('image', selectedImage);
        formData.append('_method', 'PUT'); 

        try {
            const res = await fetch('http://127.0.0.1:8000/api/profile', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });
            const result = await res.json();

            if (res.ok) {
                alert("Profil berhasil diperbarui!");
                setUser(result.user); 
                localStorage.setItem('userInfo', JSON.stringify(result.user)); 
                window.dispatchEvent(new Event("userInfoUpdated"));
                setIsEditing(false);
                setEditData(prev => ({ ...prev, password: '', current_password: '' })); 
                setSelectedImage(null);
            } else {
                alert(result.message || "Gagal update profil");
            }
        } catch (err) {
            alert("Terjadi kesalahan koneksi");
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = async () => {
        if(!confirm("Yakin ingin keluar?")) return;
        const token = localStorage.getItem('token');
        try { await fetch('http://127.0.0.1:8000/api/logout', { method: 'POST', headers: { 'Authorization': `Bearer ${token}` } }); } catch(e) {}
        localStorage.clear();
        window.dispatchEvent(new Event("userInfoUpdated"));
        navigate('/login');
    };

    // 🔥 LOGIC NAVIGASI PINTAR (CHAT KE USER_ID BUKAN TRX_ID)
    const handleTrxClick = (trx) => {
        const isMedicine = trx.type === 'medicine' || !trx.doctor_id;
        
        if (isMedicine) return; 

        // Mencari target user_id dokter (ID Akun Dokter)
        const targetDoctorUserId = 
            trx.doctor?.user_id || 
            trx.doctor?.user?.id || 
            trx.doctor?.id || 
            trx.doctor_id;

        const trxDate = new Date(trx.created_at);
        const now = new Date();
        const diffInHours = (now - trxDate) / (1000 * 60 * 60);

        if (diffInHours < 24) {
            if (!targetDoctorUserId) {
                alert("Data dokter tidak ditemukan");
                return;
            }

            navigate(`/chat/${targetDoctorUserId}`, { 
                state: { 
                    partner: {
                        id: targetDoctorUserId,
                        name: trx.doctor?.user?.name || trx.doctor?.name,
                        image: trx.doctor?.image || trx.doctor?.user?.image,
                        role: 'doctor'
                    },
                    transaction: trx
                } 
            });
        } else {
            // KADALUARSA -> KE PROFIL DOKTER
            navigate(`/doctors/${trx.doctor_id}`);
        }
    };

    const bmi = useMemo(() => {
        const h = parseFloat(user?.height) / 100;
        const w = parseFloat(user?.weight);
        if (!h || !w) return null;
        return (w / (h * h)).toFixed(1);
    }, [user]);

    const getBMIStatus = (val) => {
        if (!val) return '-';
        if (val < 18.5) return 'Kurus';
        if (val < 25) return 'Normal';
        if (val < 30) return 'Gemuk';
        return 'Obesitas';
    };

    const preventMinus = (e) => {
        if (e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '+') e.preventDefault();
    };

    // LOGIC FILTERING
    const filteredTransactions = transactions.filter((trx) => {
        const isMedicine = trx.type === 'medicine' || !trx.doctor_id;
        if (filterType === 'doctor') return !isMedicine;
        if (filterType === 'medicine') return isMedicine;
        return true; 
    });

    const s = {
        page: { background: '#f8fafc', minHeight: '100vh', paddingTop: '100px', fontFamily: '"Inter", sans-serif', display: 'flex', flexDirection: 'column' },
        container: { maxWidth: '1100px', width: '100%', margin: '0 auto', padding: '0 20px', display: 'grid', gridTemplateColumns: '350px 1fr', gap: '30px', alignItems: 'start', flex: '1', marginBottom: '80px' },
        cardProfile: { background: 'white', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', position: 'sticky', top: '100px' },
        profileHeader: { background: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)', height: '120px', position: 'relative' },
        avatarContainer: { width: '100px', height: '100px', background: 'white', borderRadius: '50%', padding: '4px', position: 'absolute', bottom: '-50px', left: '50%', transform: 'translateX(-50%)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' },
        avatar: { width: '100%', height: '100%', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '36px', fontWeight: 'bold', overflow: 'hidden', backgroundSize: 'cover', backgroundPosition: 'center' },
        profileBody: { padding: '60px 25px 30px', textAlign: 'center' },
        name: { fontSize: '22px', fontWeight: '800', color: '#1e293b', marginBottom: '4px' },
        email: { fontSize: '14px', color: '#64748b', marginBottom: '20px' },
        statsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginTop: '20px', marginBottom: '25px' },
        statBox: { background: '#f8fafc', padding: '10px 5px', borderRadius: '12px', border: '1px solid #f1f5f9' },
        statVal: { fontSize: '16px', fontWeight: 'bold', color: '#0ea5e9', display:'block' },
        statLabel: { fontSize: '10px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', marginTop: '4px' },
        formGroup: { textAlign: 'left', marginBottom: '15px' },
        label: { fontSize: '12px', color: '#64748b', fontWeight: 'bold', marginBottom: '6px', display: 'block' },
        inputWrapper: { display: 'flex', alignItems: 'center', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '0 12px', background: '#f8fafc', transition: '0.2s' },
        input: { width: '100%', padding: '12px 0', border: 'none', background: 'transparent', outline: 'none', fontSize: '14px', color: '#334155', fontWeight: '500' },
        icon: { color: '#94a3b8', marginRight: '10px' },
        btnPrimary: { width: '100%', padding: '12px', background: '#0ea5e9', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 6px -1px rgba(14, 165, 233, 0.3)' },
        btnSecondary: { width: '100%', padding: '12px', background: 'white', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '10px' },
        btnDanger: { width: '100%', padding: '12px', background: '#fef2f2', color: '#ef4444', border: '1px solid #fee2e2', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '15px' },
        sectionHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' },
        sectionTitle: { fontSize: '20px', fontWeight: '800', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '10px' },
        trxCard: (clickable) => ({ 
            background: 'white', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '15px', 
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: '0.2s',
            cursor: clickable ? 'pointer' : 'default', 
        }),
        trxIcon: (type) => ({ width: '45px', height: '45px', borderRadius: '12px', background: type === 'medicine' ? '#dcfce7' : '#e0f2fe', color: type === 'medicine' ? '#16a34a' : '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '15px' }),
        badge: (status) => ({ background: status === 'success' ? '#dcfce7' : (status === 'pending' ? '#fff7ed' : '#fee2e2'), color: status === 'success' ? '#166534' : (status === 'pending' ? '#c2410c' : '#991b1b'), padding: '4px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }),
        filterBtn: (active) => ({ padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', border: active ? 'none' : '1px solid #e2e8f0', background: active ? '#0ea5e9' : 'white', color: active ? 'white' : '#64748b', transition: '0.2s', boxShadow: active ? '0 4px 6px -1px rgba(14, 165, 233, 0.3)' : 'none' })
    };

    if (loading) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Loader2 className="animate-spin" size={40} color="#0ea5e9" /></div>;

    return (
        <div style={s.page}>
            <style>{`@keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } } .hover-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.05); border-color: #0ea5e9 !important; }`}</style>
            
            <Header />
            <div style={s.container}>
                <div style={s.cardProfile}>
                    <div style={s.profileHeader}>
                        <div style={s.avatarContainer}>
                            <div style={{ ...s.avatar, backgroundImage: getProfileImage(user?.image) ? `url(${getProfileImage(user?.image)})` : 'none' }}>
                                {!getProfileImage(user?.image) && user?.name?.charAt(0).toUpperCase()}
                            </div>
                            {isEditing && (
                                <>
                                    <input type="file" accept="image/*" ref={fileInputRef} style={{display:'none'}} onChange={handleImageChange}/>
                                    <div onClick={() => fileInputRef.current.click()} style={{position:'absolute', bottom:0, right:0, background:'white', borderRadius:'50%', padding:'6px', border:'1px solid #e2e8f0', cursor:'pointer', boxShadow:'0 2px 5px rgba(0,0,0,0.1)'}}>
                                        <Camera size={14} color="#64748b"/>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    <div style={s.profileBody}>
                        {!isEditing ? (
                            <>
                                <h2 style={s.name}>{user?.name}</h2>
                                <p style={s.email}>{user?.email}</p>
                                <div style={s.statsGrid}>
                                    <div style={s.statBox}><Ruler size={18} style={{margin:'0 auto 4px', color:'#94a3b8'}}/><span style={s.statVal}>{user?.height || '-'} <small style={{fontSize:'10px', color:'#94a3b8'}}>cm</small></span><span style={s.statLabel}>Tinggi</span></div>
                                    <div style={s.statBox}><Weight size={18} style={{margin:'0 auto 4px', color:'#94a3b8'}}/><span style={s.statVal}>{user?.weight || '-'} <small style={{fontSize:'10px', color:'#94a3b8'}}>kg</small></span><span style={s.statLabel}>Berat</span></div>
                                    <div style={s.statBox}><Activity size={18} style={{margin:'0 auto 4px', color:'#94a3b8'}}/><span style={s.statVal}>{bmi || '-'}</span><span style={s.statLabel}>{getBMIStatus(bmi)}</span></div>
                                </div>
                                <div style={{ textAlign:'left', padding:'0 10px' }}><div style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'15px', color:'#334155'}}><Phone size={18} color="#94a3b8"/> <span style={{fontWeight:'500'}}>{user?.phone}</span></div></div>
                                <button onClick={() => setIsEditing(true)} style={s.btnSecondary}><Edit2 size={16} /> Edit Profil</button>
                                <button onClick={handleLogout} style={s.btnDanger}><LogOut size={16} /> Keluar</button>
                            </>
                        ) : (
                            <form onSubmit={handleUpdate}>
                                <div style={s.formGroup}><label style={s.label}>Nama Lengkap</label><div style={s.inputWrapper}><User size={16} style={s.icon}/><input style={s.input} value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})} required /></div></div>
                                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'15px'}}>
                                    <div style={s.formGroup}><label style={s.label}>Tinggi (cm)</label><div style={s.inputWrapper}><Ruler size={16} style={s.icon}/><input type="number" min="0" style={s.input} value={editData.height} onKeyDown={preventMinus} onChange={e => {const val = e.target.value; if(val >= 0) setEditData({...editData, height: val});}} placeholder="0" /></div></div>
                                    <div style={s.formGroup}><label style={s.label}>Berat (kg)</label><div style={s.inputWrapper}><Weight size={16} style={s.icon}/><input type="number" min="0" style={s.input} value={editData.weight} onKeyDown={preventMinus} onChange={e => {const val = e.target.value; if(val >= 0) setEditData({...editData, weight: val});}} placeholder="0" /></div></div>
                                </div>
                                <div style={s.formGroup}><label style={s.label}>Email</label><div style={s.inputWrapper}><Mail size={16} style={s.icon}/><input type="email" style={s.input} value={editData.email} onChange={e => setEditData({...editData, email: e.target.value})} required /></div></div>
                                <div style={s.formGroup}><label style={s.label}>No Ponsel</label><div style={s.inputWrapper}><Phone size={16} style={s.icon}/><input style={s.input} value={editData.phone} onChange={e => setEditData({...editData, phone: e.target.value})} required /></div></div>
                                <div style={{ background:'#f1f5f9', padding:'15px', borderRadius:'12px', marginTop:'20px', marginBottom:'20px' }}>
                                    <p style={{ fontSize:'12px', fontWeight:'bold', color:'#334155', marginBottom:'10px', display:'flex', alignItems:'center', gap:'6px' }}><Key size={14}/> Ganti Password (Opsional)</p>
                                    <div style={{ marginBottom:'10px' }}><input type="password" placeholder="Password Lama" style={{ ...s.input, background:'white', padding:'10px', borderRadius:'8px', border:'1px solid #cbd5e1' }} value={editData.current_password} onChange={e => setEditData({...editData, current_password: e.target.value})} /></div>
                                    <div><input type="password" placeholder="Password Baru" style={{ ...s.input, background:'white', padding:'10px', borderRadius:'8px', border:'1px solid #cbd5e1' }} value={editData.password} onChange={e => setEditData({...editData, password: e.target.value})} /></div>
                                </div>
                                <button type="submit" style={s.btnPrimary} disabled={saving}>{saving ? <Loader2 className="animate-spin" size={16} /> : <><Save size={16} /> Simpan Perubahan</>}</button>
                                <button type="button" onClick={() => { setIsEditing(false); setPreviewUrl(null); }} style={{...s.btnSecondary, border:'none', color:'#ef4444'}}>Batal</button>
                            </form>
                        )}
                    </div>
                </div>

                <div>
                    <div style={s.sectionHeader}>
                        <h3 style={s.sectionTitle}><FileText size={24} color="#0ea5e9"/> Riwayat Transaksi</h3>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                        <button onClick={() => setFilterType('all')} style={s.filterBtn(filterType === 'all')}>Semua</button>
                        <button onClick={() => setFilterType('doctor')} style={s.filterBtn(filterType === 'doctor')}>Dokter</button>
                        <button onClick={() => setFilterType('medicine')} style={s.filterBtn(filterType === 'medicine')}>Obat</button>
                    </div>

                    {filteredTransactions.length > 0 ? (
                        filteredTransactions.map((trx) => {
                            const isMedicine = trx.type === 'medicine' || !trx.doctor_id;
                            const isClickable = !isMedicine; 

                            const title = isMedicine 
                                ? 'Pembelian Obat' 
                                : (trx.doctor?.user?.name || trx.doctor?.name || 'Konsultasi Dokter');

                            const subtitle = isMedicine
                                ? (new Date(trx.created_at).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour:'2-digit', minute:'2-digit' }))
                                : (trx.doctor?.specialization || 'Dokter Spesialis');

                            return (
                                <div key={trx.id} 
                                     style={s.trxCard(isClickable)} 
                                     onClick={() => isClickable && handleTrxClick(trx)} 
                                     className={isClickable ? 'hover-card' : ''}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <div style={s.trxIcon(isMedicine ? 'medicine' : 'doc')}>{isMedicine ? <Pill size={24} /> : <User size={24} />}</div>
                                        <div>
                                            <p style={{ margin: '0 0 4px', fontWeight: 'bold', fontSize: '15px', color:'#334155' }}>
                                                {title}
                                            </p>
                                            
                                            <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>
                                                {subtitle}
                                            </p>

                                            {!isMedicine && (
                                                <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#cbd5e1' }}>
                                                    {new Date(trx.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour:'2-digit', minute:'2-digit' })}
                                                </p>
                                            )}

                                            <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>{trx.note}</p>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        {(() => {
                                            if (isMedicine) return <span style={s.badge(trx.status)}>{trx.status}</span>;
                                            
                                            const diffInHours = (new Date() - new Date(trx.created_at)) / (1000 * 60 * 60);
                                            const isChatActive = diffInHours < 24;

                                            return (
                                                <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'5px' }}>
                                                    <span style={s.badge(trx.status)}>{trx.status}</span>
                                                    {isChatActive && (
                                                        <span style={{ 
                                                            fontSize:'10px', fontWeight:'bold', color:'white', 
                                                            background:'#10b981', padding:'2px 8px', borderRadius:'10px',
                                                            display:'flex', alignItems:'center', gap:'4px'
                                                        }}>
                                                            <div style={{width:'6px', height:'6px', background:'white', borderRadius:'50%', animation:'pulse 1s infinite'}}/>
                                                            Chat Aktif
                                                        </span>
                                                    )}
                                                </div>
                                            );
                                        })()}

                                        <p style={{ margin: '8px 0 0', fontWeight: '800', color: '#0ea5e9', fontSize:'15px' }}>
                                            Rp {parseInt(trx.amount).toLocaleString('id-ID')}
                                        </p>
                                        
                                        {isClickable && <div style={{ marginTop: '5px', display:'flex', justifyContent:'flex-end', color:'#cbd5e1' }}><ChevronRight size={16}/></div>}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '24px', border: '1px dashed #cbd5e1', color: '#94a3b8' }}>
                            <FileText size={40} style={{margin:'0 auto 10px', opacity:0.5}}/>
                            <p style={{fontWeight:'600'}}>
                                {filterType === 'all' ? 'Belum ada riwayat transaksi.' : 
                                 filterType === 'doctor' ? 'Belum ada konsultasi dokter.' : 
                                 'Belum ada pembelian obat.'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}