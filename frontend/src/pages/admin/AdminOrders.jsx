import React, { useState, useEffect } from 'react';
import { SidebarAdmin } from '../../components/sidebar';
import { Users, Trash2, Search, Mail, Calendar, Shield } from 'lucide-react';

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const token = localStorage.getItem('token');
        try {
            // Pastikan URL backend benar
            const res = await fetch('http://127.0.0.1:8000/api/admin/users', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setUsers(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Gagal ambil user:", error);
        } finally {
            setLoading(false);
        }
    };

    // --- STYLES (Biar Rapi Tanpa Tailwind) ---
    const styles = {
        container: { display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: '"Inter", sans-serif' },
        main: { flex: 1, padding: '40px', marginLeft: '260px' }, // Margin buat sidebar
        header: { marginBottom: '30px' },
        title: { fontSize: '24px', fontWeight: '800', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '10px' },
        
        card: { background: 'white', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', overflow: 'hidden', border: '1px solid #e2e8f0' },
        table: { width: '100%', borderCollapse: 'collapse' },
        thead: { background: '#f1f5f9', borderBottom: '1px solid #e2e8f0' },
        th: { padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' },
        tr: { borderBottom: '1px solid #f1f5f9', transition: '0.2s' },
        td: { padding: '16px 24px', fontSize: '14px', color: '#334155' },
        
        badge: (role) => ({
            background: role === 'admin' ? '#fee2e2' : '#e0f2fe',
            color: role === 'admin' ? '#991b1b' : '#075985',
            padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold', textTransform: 'capitalize'
        }),
        
        emptyState: { padding: '50px', textAlign: 'center', color: '#94a3b8' }
    };

    return (
        <div style={styles.container}>
            <SidebarAdmin />
            
            <div style={styles.main}>
                <div style={styles.header}>
                    <h1 style={styles.title}>
                        <Users size={28} color="#0ea5e9" /> Data Pengguna
                    </h1>
                    <p style={{ color: '#64748b', marginTop: '5px' }}>Daftar semua pengguna terdaftar di aplikasi.</p>
                </div>

                <div style={styles.card}>
                    <table style={styles.table}>
                        <thead style={styles.thead}>
                            <tr>
                                <th style={styles.th}>Nama Lengkap</th>
                                <th style={styles.th}>Email</th>
                                <th style={styles.th}>Role</th>
                                <th style={styles.th}>Tanggal Daftar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="4" style={styles.emptyState}>Memuat data...</td></tr>
                            ) : users.length > 0 ? (
                                users.map((u, i) => (
                                    <tr key={u.id} style={{ ...styles.tr, background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                                        <td style={{ ...styles.td, fontWeight: 'bold' }}>{u.name}</td>
                                        <td style={styles.td}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <Mail size={14} color="#94a3b8" /> {u.email}
                                            </div>
                                        </td>
                                        <td style={styles.td}>
                                            <span style={styles.badge(u.role)}>
                                                {u.role || 'Pasien'}
                                            </span>
                                        </td>
                                        <td style={styles.td}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <Calendar size={14} color="#94a3b8" />
                                                {new Date(u.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" style={styles.emptyState}>
                                        <Shield size={40} style={{ margin: '0 auto 10px', opacity: 0.5 }} />
                                        <p>Belum ada user lain selain Admin.</p>
                                        <small>Coba register akun baru di halaman depan.</small>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}