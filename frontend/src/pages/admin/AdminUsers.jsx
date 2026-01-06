import { useState, useEffect } from 'react';
import { Users, Search, Trash2, Mail, Phone, Loader2 } from 'lucide-react';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Fetch Data User dari Backend
  const fetchUsers = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Token Admin
        }
      });
      const result = await response.json();
      // Ambil data array (handle format {data: []} atau [])
      setUsers(Array.isArray(result.data) ? result.data : (Array.isArray(result) ? result : []));
    } catch (error) {
      console.error("Gagal ambil user:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  // Fitur Hapus User
  const handleDelete = async (id) => {
    if(!confirm("Yakin hapus user ini? Data tidak bisa kembali.")) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if(res.ok) {
        alert("User berhasil dihapus");
        fetchUsers();
      }
    } catch (err) { alert("Gagal menghapus user"); }
  };

  const filteredUsers = users.filter(u => 
    (u.name || '').toLowerCase().includes(search.toLowerCase()) || 
    (u.email || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ marginBottom:'24px' }}>
        <h1 style={{ fontSize:'24px', fontWeight:'bold', color:'#1e293b' }}>Data Pasien</h1>
        <p style={{ color:'#64748b' }}>Daftar pengguna terdaftar di HaloHealth.</p>
      </div>

      {/* Search Bar */}
      <div style={{ background:'white', padding:'16px', borderRadius:'12px', boxShadow:'0 2px 5px rgba(0,0,0,0.05)', marginBottom:'20px', display:'flex', alignItems:'center', gap:'10px' }}>
        <Search size={20} color="#94a3b8" />
        <input type="text" placeholder="Cari nama atau email user..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ border:'none', outline:'none', width:'100%', fontSize:'14px' }} />
      </div>

      <div style={{ background:'white', borderRadius:'12px', overflow:'hidden', boxShadow:'0 4px 6px rgba(0,0,0,0.05)' }}>
        {loading ? (
          <div style={{ padding:'40px', textAlign:'center' }}><Loader2 className="animate-spin" style={{margin:'0 auto'}} color="#0ea5e9"/></div>
        ) : (
          <table style={{ width:'100%', borderCollapse:'collapse', textAlign:'left' }}>
            <thead style={{ background:'#f8fafc', borderBottom:'1px solid #e2e8f0' }}>
              <tr>
                <th style={{ padding:'16px', color:'#64748b' }}>Nama User</th>
                <th style={{ padding:'16px', color:'#64748b' }}>Kontak</th>
                <th style={{ padding:'16px', color:'#64748b' }}>Role</th>
                <th style={{ padding:'16px', color:'#64748b', textAlign:'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                <tr key={user.id} style={{ borderBottom:'1px solid #f1f5f9' }}>
                  <td style={{ padding:'16px', fontWeight:'600', color:'#1e293b' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                      <div style={{ width:'35px', height:'35px', background:'#e0f2fe', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', color:'#0284c7', fontWeight:'bold' }}>
                        {(user.name || 'U').charAt(0).toUpperCase()}
                      </div>
                      {user.name}
                    </div>
                  </td>
                  <td style={{ padding:'16px' }}>
                    <div style={{ fontSize:'13px', color:'#64748b', display:'flex', flexDirection:'column', gap:'4px' }}>
                      <span style={{ display:'flex', alignItems:'center', gap:'6px' }}><Mail size={12}/> {user.email}</span>
                      {user.phone && <span style={{ display:'flex', alignItems:'center', gap:'6px' }}><Phone size={12}/> {user.phone}</span>}
                    </div>
                  </td>
                  <td style={{ padding:'16px' }}>
                    <span style={{ 
                      background: user.role === 'admin' ? '#fef3c7' : '#dcfce7', 
                      color: user.role === 'admin' ? '#d97706' : '#16a34a', 
                      padding:'4px 10px', borderRadius:'20px', fontSize:'11px', fontWeight:'bold', textTransform:'uppercase' 
                    }}>
                      {user.role || 'User'}
                    </span>
                  </td>
                  <td style={{ padding:'16px', textAlign:'center' }}>
                    <button onClick={() => handleDelete(user.id)} style={{ background:'#fee2e2', border:'none', padding:'8px', borderRadius:'6px', cursor:'pointer', color:'#ef4444' }}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="4" style={{ padding:'30px', textAlign:'center', color:'#94a3b8' }}>Tidak ada user ditemukan.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}