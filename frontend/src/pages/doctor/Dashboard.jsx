import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Camera, Edit2, LogOut, Loader2, Save } from 'lucide-react';

export default function DoctorDashboard() {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    // STATE
    const [doctor, setDoctor] = useState(null);
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);

    // STATE EDIT
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ name: '', specialization: '' }); 
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) { navigate('/login'); return; }
        fetchProfile(token);
        fetchChatHistory(token);
        
        const interval = setInterval(() => fetchChatHistory(token), 3000);
        return () => clearInterval(interval);
    }, []);

    const fetchProfile = async (token) => {
        try {
            const res = await fetch('http://127.0.0.1:8000/api/user', { 
                headers: { 'Authorization': `Bearer ${token}` } 
            });
            const userData = await res.json();
            const docRel = userData.doctor || {}; 

            setDoctor({
                ...userData,
                name: userData.name,
                specialization: docRel.specialization || 'Dokter Spesialis',
                image: docRel.image || userData.image,
                status: 'Online'
            });

            setEditData({
                name: userData.name,
                specialization: docRel.specialization || '',
            });
        } catch (error) { 
            console.error("Gagal memuat profil:", error); 
        } finally {
            setLoading(false);
        }
    };

    const fetchChatHistory = async (token) => {
        try {
            const res = await fetch('http://127.0.0.1:8000/api/chat/history', { 
                headers: { 'Authorization': `Bearer ${token}` } 
            });
            if (res.ok) {
                const data = await res.json();
                const list = Array.isArray(data) ? data : (data.data || []);
                setChats(list);
            }
        } catch (error) { 
            console.error("Gagal memuat chat:", error); 
        }
    };

    // 🔥 LOGIC UPDATE PROFILE ANTI TERTUKAR ADMIN
    const handleUpdate = async (e) => {
        e.preventDefault();
        setSaving(true);
        const token = localStorage.getItem('token');
        
        const formData = new FormData();
        formData.append('name', editData.name);
        formData.append('specialization', editData.specialization);
        
        // Kirim data wajib agar validasi backend tidak gagal
        formData.append('email', doctor.email); 
        formData.append('phone', doctor.phone);

        if (selectedImage) {
            formData.append('image', selectedImage);
        }
        
        // Gunakan spoofing PUT untuk Laravel
        formData.append('_method', 'PUT'); 

        try {
            const res = await fetch('http://127.0.0.1:8000/api/profile', {
                method: 'POST', 
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                },
                body: formData
            });

            const result = await res.json();

            if (res.ok) {
                alert("Profil Dokter berhasil diperbarui! 🎉");
                
                // 🔥 PENTING: Update localStorage supaya foto di Header ikut berubah
                localStorage.setItem('userInfo', JSON.stringify(result.user));
                // Trigger event biar komponen Header tahu ada perubahan
                window.dispatchEvent(new Event("userInfoUpdated"));

                fetchProfile(token);
                setIsEditing(false);
                setSelectedImage(null);
                setPreviewUrl(null);
            } else {
                alert("Gagal: " + (result.message || "Periksa kembali inputan Anda"));
            }
        } catch (err) { 
            alert("Gagal terhubung ke server"); 
        } finally { 
            setSaving(false); 
        }
    };

    const handleChatClick = (patientId) => {
        const targetPatient = chats.find(c => c.user_id === patientId);
        if (targetPatient) {
            navigate(`/chat/${patientId}`, { 
                state: { 
                    partner: {
                        id: targetPatient.user_id,
                        name: targetPatient.name,
                        image: targetPatient.image,
                        role: 'patient'
                    }
                } 
            }); 
        }
    };

    const handleLogout = () => {
        if(confirm("Keluar dari Dashboard?")) { 
            localStorage.clear(); 
            window.dispatchEvent(new Event("userInfoUpdated"));
            navigate('/login'); 
        }
    };

    const getProfileImage = (path) => {
        if (previewUrl) return previewUrl;
        if (!path) return "https://cdn-icons-png.flaticon.com/512/3774/3774299.png";
        if (path.startsWith('http')) return path;
        const clean = path.replace(/^public\//, '').replace(/^\//, '');
        return `http://127.0.0.1:8000/storage/${clean}`;
    };

    const s = {
        page: { background: '#f8fafc', minHeight: '100vh', fontFamily: '"Inter", sans-serif', paddingBottom:'50px', display:'flex', justifyContent:'center' },
        container: { width:'100%', maxWidth: '1200px', padding: '40px 20px', display: 'grid', gridTemplateColumns: '350px 1fr', gap: '30px', alignItems: 'start' },
        card: { background: 'white', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 10px 30px -5px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', position: 'sticky', top: '40px' },
        headerGradient: { background: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)', height: '120px', position: 'relative' },
        avatarContainer: { width: '100px', height: '100px', background: 'white', borderRadius: '50%', padding: '4px', position: 'absolute', bottom: '-50px', left: '50%', transform: 'translateX(-50%)', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' },
        formGroup: { marginBottom: '15px' },
        label: { fontSize: '12px', fontWeight: 'bold', color: '#64748b', marginBottom: '6px', display: 'block' },
        input: { width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none', background: '#f8fafc' },
        btnPrimary: { width: '100%', padding: '14px', background: '#0ea5e9', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', marginTop: '10px' },
        btnSecondary: { width: '100%', padding: '12px', background: '#f1f5f9', color: '#334155', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', marginTop:'10px' },
        chatItem: { display: 'flex', alignItems: 'center', padding: '20px', borderBottom: '1px solid #f1f5f9', cursor: 'pointer', transition: '0.2s', background: 'white' }
    };

    if (loading) return <div style={{height:'100vh', display:'flex', justifyContent:'center', alignItems:'center'}}><Loader2 className="animate-spin" size={40} color="#0ea5e9" /></div>;

    return (
        <div style={s.page}>
            <div style={s.container}>
                <div style={s.card}>
                    <div style={s.headerGradient}>
                        <div style={s.avatarContainer} onClick={() => isEditing && fileInputRef.current.click()}>
                            <img 
                                src={getProfileImage(doctor?.image)} 
                                style={{width:'100%', height:'100%', borderRadius:'50%', objectFit:'cover'}} 
                                alt="Profil" 
                                onError={(e) => e.target.src = "https://cdn-icons-png.flaticon.com/512/3774/3774299.png"}
                            />
                            {isEditing && (
                                <div style={{position:'absolute', bottom:0, right:0, background:'white', borderRadius:'50%', padding:'6px', border:'1px solid #cbd5e1'}}>
                                    <Camera size={14} color="#64748b"/>
                                </div>
                            )}
                            <input type="file" ref={fileInputRef} style={{display:'none'}} accept="image/*" onChange={e => { 
                                if(e.target.files[0]) {
                                    setSelectedImage(e.target.files[0]); 
                                    setPreviewUrl(URL.createObjectURL(e.target.files[0])); 
                                }
                            }} />
                        </div>
                    </div>
                    <div style={{ padding: '60px 25px 30px', textAlign: 'center' }}>
                        {!isEditing ? (
                            <>
                                <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#1e293b', margin: '0 0 5px' }}>{doctor?.name}</h2>
                                <span style={{ fontSize: '13px', color: '#0ea5e9', fontWeight: 'bold', background:'#e0f2fe', padding:'4px 12px', borderRadius:'20px' }}>
                                    {doctor?.specialization}
                                </span>
                                <div style={{marginTop:'25px', display: 'flex', flexDirection: 'column', gap: '10px'}}>
                                    <button onClick={() => setIsEditing(true)} style={s.btnSecondary}><Edit2 size={16}/> Edit Profil</button>
                                    <button onClick={handleLogout} style={{...s.btnSecondary, background:'#fef2f2', color:'#ef4444'}}><LogOut size={16}/> Keluar</button>
                                </div>
                            </>
                        ) : (
                            <form onSubmit={handleUpdate} style={{textAlign:'left'}}>
                                <div style={s.formGroup}>
                                    <label style={s.label}>Nama Lengkap</label>
                                    <input style={s.input} value={editData.name} onChange={e=>setEditData({...editData, name:e.target.value})} required />
                                </div>
                                <div style={s.formGroup}>
                                    <label style={s.label}>Spesialisasi</label>
                                    <input style={s.input} value={editData.specialization} onChange={e=>setEditData({...editData, specialization:e.target.value})} required />
                                </div>
                                <button type="submit" disabled={saving} style={s.btnPrimary}>
                                    {saving ? <Loader2 className="animate-spin" size={18}/> : <Save size={18}/>}
                                    {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </button>
                                <button type="button" onClick={()=>{setIsEditing(false); setPreviewUrl(null); setSelectedImage(null);}} style={s.btnSecondary}>Batal</button>
                            </form>
                        )}
                    </div>
                </div>

                <div>
                    <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#1e293b', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <MessageSquare size={28} color="#0ea5e9"/> Pesan Masuk
                    </h2>
                    <div style={{ background: 'white', borderRadius: '24px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                        {chats.length > 0 ? chats.map((chat) => (
                            <div key={chat.user_id} style={s.chatItem} onClick={() => handleChatClick(chat.user_id)}>
                                <img 
                                    src={getProfileImage(chat.image)} 
                                    style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '15px', objectFit: 'cover', background:'#f1f5f9' }} 
                                    alt="Avatar" 
                                    onError={(e) => e.target.src = "https://cdn-icons-png.flaticon.com/512/3774/3774299.png"}
                                />
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>{chat.name}</div>
                                    <div style={{ fontSize: '13px', color: '#64748b' }}>{chat.last_message || "Pesan Gambar/File"}</div>
                                </div>
                            </div>
                        )) : (
                            <div style={{padding:'80px 20px', textAlign:'center', color:'#94a3b8'}}>
                                <p>Belum ada pesan masuk dari pasien.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}