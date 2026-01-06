import { Outlet } from 'react-router-dom';
import { SidebarAdmin } from '../components/sidebar'; // 🔥 Panggil fungsi SidebarAdmin dari file sidebar.jsx

export default function AdminLayout() {
  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      background: '#f8fafc', // Warna background lebih modern (slate-50)
      fontFamily: '"Inter", sans-serif' 
    }}>
      
      {/* SIDEBAR (KIRI) */}
      {/* Kita panggil komponen SidebarAdmin yang sudah kita buat lengkap tadi */}
      <SidebarAdmin />

      {/* KONTEN UTAMA (KANAN) */}
      {/* Margin left 260px karena lebar sidebar kita tadi 260px */}
      <main style={{ 
        marginLeft: '260px', 
        flex: 1, 
        padding: '40px',
        minHeight: '100vh'
      }}>
          {/* Outlet adalah tempat halaman-halaman admin (Dashboard, Kelola Dokter, dll) muncul */}
          <Outlet />
      </main>

    </div>
  );
}