import React, { useState, useEffect } from 'react';
import { SidebarAdmin } from '../../components/sidebar';
import { CalendarCheck, Clock, User, Stethoscope, ArrowRight } from 'lucide-react';

export default function AdminBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('http://127.0.0.1:8000/api/admin/bookings', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setBookings(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // --- STYLES ---
    const styles = {
        container: { display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: '"Inter", sans-serif' },
        main: { flex: 1, padding: '40px', marginLeft: '260px' },
        header: { marginBottom: '30px' },
        title: { fontSize: '24px', fontWeight: '800', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '10px' },
        
        grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' },
        card: { background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px', transition: '0.3s', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' },
        
        row: { display: 'flex', alignItems: 'center', gap: '12px' },
        iconBox: { width: '40px', height: '40px', borderRadius: '10px', background: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' },
        
        label: { fontSize: '11px', color: '#94a3b8', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '4px' },
        value: { fontSize: '15px', fontWeight: 'bold', color: '#334155' },
        subValue: { fontSize: '13px', color: '#64748b' },

        footer: { borderTop: '1px dashed #e2e8f0', paddingTop: '15px', marginTop: 'auto' },
        btnAction: { width: '100%', padding: '10px', background: '#0ea5e9', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }
    };

    return (
        <div style={styles.container}>
            <SidebarAdmin />
            
            <div style={styles.main}>
                <div style={styles.header}>
                    <h1 style={styles.title}>
                        <CalendarCheck size={28} color="#0ea5e9" /> Jadwal Konsultasi
                    </h1>
                    <p style={{ color: '#64748b', marginTop: '5px' }}>Daftar pasien yang sudah lunas dan siap konsultasi.</p>
                </div>

                {loading ? (
                    <p style={{ color: '#94a3b8' }}>Memuat jadwal...</p>
                ) : (
                    <div style={styles.grid}>
                        {bookings.length > 0 ? bookings.map((bk) => (
                            <div key={bk.id} style={styles.card}>
                                {/* Pasien Info */}
                                <div style={styles.row}>
                                    <div style={styles.iconBox}><User size={20} /></div>
                                    <div>
                                        <div style={styles.label}>Pasien</div>
                                        <div style={styles.value}>{bk.patient?.name}</div>
                                    </div>
                                </div>

                                <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9' }} />

                                {/* Dokter Info */}
                                <div style={styles.row}>
                                    <div style={{ ...styles.iconBox, background: '#fef2f2', color: '#ef4444' }}><Stethoscope size={20} /></div>
                                    <div>
                                        <div style={styles.label}>Dokter Tujuan</div>
                                        <div style={styles.value}>{bk.doctor?.name}</div>
                                        <div style={styles.subValue}>{bk.doctor?.specialist || 'Umum'}</div>
                                    </div>
                                </div>

                                {/* Waktu */}
                                <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#64748b' }}>
                                    <Clock size={16} />
                                    <span>Booking: {new Date(bk.created_at).toLocaleString('id-ID')}</span>
                                </div>

                                <div style={styles.footer}>
                                    <button style={styles.btnAction} onClick={() => alert("Fitur chat admin belum aktif")}>
                                        Lihat Detail <ArrowRight size={16} />
                                    </button>
                                </div>
                            </div>
                        )) : (
                            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px', background: 'white', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
                                <CalendarCheck size={50} color="#cbd5e1" style={{ margin: '0 auto 15px' }} />
                                <p style={{ color: '#64748b', fontWeight: 'bold' }}>Belum ada jadwal masuk.</p>
                                <p style={{ fontSize: '13px', color: '#94a3b8' }}>Pastikan transaksi sudah di-ACC di menu Verifikasi Bayar.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}