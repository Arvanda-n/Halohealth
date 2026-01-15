import React, { useState, useEffect } from 'react';
import { SidebarAdmin } from '../../components/sidebar';
import { Users, Mail, Calendar, Shield, AlertCircle } from 'lucide-react';

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
            setUsers(Array.isArray(data) ? data : []);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // --- STYLE RAPI (Inline CSS) ---
    const s = {
        container: { display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: '"Inter", sans-serif' },
        content: { marginLeft: '260px', padding: '40px', flex: 1 }, // Sesuaikan lebar sidebar
        header: { marginBottom: '30px' },
        h1: { fontSize: '24px', fontWeight: 'bold', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '12px' },
        card: { background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', overflow: 'hidden' },
        table: { width: '100%', borderCollapse: 'collapse' },
        th: { textAlign: 'left', padding: '16px 24px', background: '#f1f5f9', color: '#64748b', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' },
        td: { padding: '16px 24px', borderBottom: '1px solid #f1f5f9', color: '#334155', fontSize: '14px' },
        badge: (role) => ({
            background: role === 'admin' ? '#fee2e2' : '#e0f2fe',
            color: role === 'admin' ? '#991b1b' : '#0284c7',
            padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', display: 'inline-block'
        })
    };

    return (
        <div style={s.container}>
            <SidebarAdmin />
            
            <div style={s.content}>
                <div style={s.header}>
                    <h1 style={s.h1}>
                        <Users size={28} color="#0ea5e9" /> Data Pengguna
                    </h1>
                    <p style={{ color: '#64748b', marginTop: '5px' }}>Daftar semua pasien yang terdaftar di aplikasi.</p>
                </div>

                {error ? (
                    <div style={{ padding: '20px', background: '#fee2e2', color: '#991b1b', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <AlertCircle /> {error} (Silakan Login sebagai Admin)
                    </div>
                ) : (
                    <div style={s.card}>
                        <table style={s.table}>
                            <thead>
                                <tr>
                                    <th style={s.th}>Nama Lengkap</th>
                                    <th style={s.th}>Email</th>
                                    <th style={s.th}>Role</th>
                                    <th style={s.th}>Bergabung</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>Memuat data...</td></tr>
                                ) : users.length > 0 ? (
                                    users.map((u, i) => (
                                        <tr key={u.id} style={{ background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                                            <td style={{ ...s.td, fontWeight: '600' }}>{u.name}</td>
                                            <td style={s.td}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <Mail size={14} color="#94a3b8" /> {u.email}
                                                </div>
                                            </td>
                                            <td style={s.td}>
                                                <span style={s.badge(u.role)}>{u.role || 'Pasien'}</span>
                                            </td>
                                            <td style={s.td}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <Calendar size={14} color="#94a3b8" />
                                                    {new Date(u.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" style={{ padding: '50px', textAlign: 'center' }}>
                                            <Shield size={40} color="#cbd5e1" style={{ margin: '0 auto 10px' }} />
                                            <p style={{ color: '#64748b' }}>Belum ada data user.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}