import React, { useState, useEffect } from 'react';
import { SidebarAdmin } from '../../components/sidebar';
import { Users, Mail, Calendar, Shield, AlertCircle, Search, Loader2, Stethoscope, User } from 'lucide-react';

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('http://127.0.0.1:8000/api/admin/users', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (res.status === 403) {
                throw new Error("Akses Ditolak! Anda bukan Admin.");
            }

            const data = await res.json();
            const userData = data.data ? data.data : data;
            setUsers(Array.isArray(userData) ? userData : []);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(u => 
        (u.name || '').toLowerCase().includes(search.toLowerCase()) ||
        (u.email || '').toLowerCase().includes(search.toLowerCase()) ||
        (u.role || '').toLowerCase().includes(search.toLowerCase())
    );

    // --- STYLES ---
    const s = {
        container: { display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: '"Inter", sans-serif', width: '100%' },
        contentArea: { flex: 1, padding: '30px', overflowX: 'hidden' },
        wrapper: { width: '100%' },

        header: { marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' },
        title: { fontSize: '26px', fontWeight: '800', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' },
        subtitle: { color: '#64748b', fontSize: '14px' },

        card: { background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', overflow: 'hidden' },
        
        toolbar: { padding: '20px', borderBottom: '1px solid #f1f5f9', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
        searchBox: { display: 'flex', alignItems: 'center', gap: '10px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '10px 15px', width: '350px' },
        input: { border: 'none', background: 'transparent', outline: 'none', fontSize: '14px', color: '#334155', width: '100%' },

        tableContainer: { width: '100%', overflowX: 'auto' },
        table: { width: '100%', borderCollapse: 'collapse', whiteSpace: 'nowrap' },
        thead: { background: '#f8fafc', borderBottom: '2px solid #e2e8f0' },
        th: { padding: '16px 20px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' },
        tr: { borderBottom: '1px solid #f1f5f9' },
        td: { padding: '16px 20px', fontSize: '14px', color: '#334155', verticalAlign: 'middle' },

        // Avatar Style
        avatar: (role) => {
            let bg = '#f1f5f9', color = '#94a3b8';
            if (role === 'admin') { bg = '#fee2e2'; color = '#ef4444'; }
            if (role === 'doctor') { bg = '#f3e8ff'; color = '#a855f7'; }
            if (role === 'patient') { bg = '#e0f2fe'; color = '#0ea5e9'; }
            
            return { width: '36px', height: '36px', borderRadius: '50%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: color, fontSize: '14px', fontWeight: 'bold' };
        },
        userBox: { display: 'flex', alignItems: 'center', gap: '12px' },
        
        // 🔥 LOGIC WARNA BADGE (BEDA WARNA)
        badge: (role) => {
            let bg = '#e0f2fe', color = '#0284c7', icon = <User size={12}/>; // Default Patient (Blue)

            if (role === 'admin') { 
                bg = '#fee2e2'; color = '#991b1b'; icon = <Shield size={12}/>; // Admin (Red)
            } else if (role === 'doctor') { 
                bg = '#f3e8ff'; color = '#6b21a8'; icon = <Stethoscope size={12}/>; // Doctor (Purple)
            }

            return {
                background: bg, color: color,
                padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold', 
                textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: '5px'
            };
        }
    };

    return (
        <div style={s.container}>
            <SidebarAdmin />
            
            <div style={s.contentArea}>
                <div style={s.wrapper}>
                    
                    {/* Header */}
                    <div style={s.header}>
                        <div>
                            <h1 style={s.title}>
                                <Users size={32} color="#0ea5e9" fill="#e0f2fe" /> 
                                Data Pengguna
                            </h1>
                            <p style={s.subtitle}>
                                Kelola data pasien, dokter, dan admin.
                            </p>
                        </div>
                    </div>

                    {error ? (
                        <div style={{ padding: '20px', background: '#fee2e2', color: '#991b1b', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid #fecaca' }}>
                            <AlertCircle /> {error}
                        </div>
                    ) : (
                        <div style={s.card}>
                            
                            {/* Toolbar Search */}
                            <div style={s.toolbar}>
                                <div style={s.searchBox}>
                                    <Search size={18} color="#94a3b8" />
                                    <input 
                                        style={s.input} 
                                        placeholder="Cari nama, email, atau role..." 
                                        value={search} 
                                        onChange={(e) => setSearch(e.target.value)} 
                                    />
                                </div>
                                <div style={{ fontSize:'13px', color:'#64748b' }}>
                                    Total: <b>{filteredUsers.length}</b> Pengguna
                                </div>
                            </div>

                            {/* Table */}
                            <div style={s.tableContainer}>
                                <table style={s.table}>
                                    <thead style={s.thead}>
                                        <tr>
                                            <th style={s.th}>Nama Lengkap</th>
                                            <th style={s.th}>Email</th>
                                            <th style={s.th}>Role</th>
                                            <th style={s.th}>Bergabung Sejak</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr><td colSpan="4" style={{ padding: '60px', textAlign: 'center' }}><Loader2 className="animate-spin" style={{margin:'0 auto', color:'#0ea5e9'}}/></td></tr>
                                        ) : filteredUsers.length > 0 ? (
                                            filteredUsers.map((u, i) => (
                                                <tr key={u.id} style={{ ...s.tr, background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                                                    <td style={s.td}>
                                                        <div style={s.userBox}>
                                                            {/* Avatar ikut berubah warna sesuai role */}
                                                            <div style={s.avatar(u.role)}>
                                                                {u.role === 'doctor' ? <Stethoscope size={18}/> : (u.role === 'admin' ? <Shield size={18}/> : u.name.charAt(0).toUpperCase())}
                                                            </div>
                                                            <div>
                                                                <div style={{ fontWeight: '600', color:'#1e293b' }}>{u.name}</div>
                                                                <div style={{ fontSize: '11px', color:'#94a3b8' }}>ID: {u.id}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td style={s.td}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                            <Mail size={14} color="#94a3b8" /> {u.email}
                                                        </div>
                                                    </td>
                                                    <td style={s.td}>
                                                        <span style={s.badge(u.role)}>
                                                            {s.badge(u.role).icon} {u.role || 'Patient'}
                                                        </span>
                                                    </td>
                                                    <td style={s.td}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize:'13px', color:'#64748b' }}>
                                                            <Calendar size={14} />
                                                            {new Date(u.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" style={{ padding: '60px', textAlign: 'center' }}>
                                                    <div style={{ width:'80px', height:'80px', background:'#f1f5f9', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 15px' }}>
                                                        <Users size={40} color="#cbd5e1" />
                                                    </div>
                                                    <p style={{ color: '#64748b', fontWeight:'600' }}>Data pengguna tidak ditemukan.</p>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}