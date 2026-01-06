import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2, Search, Pill, Loader2, Pencil, Package } from 'lucide-react'; 

export default function AdminMedicines() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchMedicines = async () => {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/medicines');
        const result = await response.json();
        const dataArray = result.data ? result.data : result;
        setMedicines(Array.isArray(dataArray) ? dataArray : []);
    } catch (error) {
        console.error("Error:", error);
        setMedicines([]); 
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => { fetchMedicines(); }, []);

  const handleDelete = async (id) => {
    if(!confirm("Yakin hapus obat ini?")) return;
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/medicines/${id}`, { method: 'DELETE' });
        if(response.ok) {
            alert("Obat berhasil dihapus");
            fetchMedicines();
        }
    } catch (error) { alert("Gagal menghapus"); }
  };

  const filteredMedicines = medicines.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase()) || 
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath; 
    return `http://127.0.0.1:8000/${imagePath.replace(/^\//, '')}`;
  };

  return (
    <div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px' }}>
            <div>
                <h1 style={{ fontSize:'24px', fontWeight:'bold', color:'#1e293b' }}>Kelola Obat & Vitamin</h1>
                <p style={{ color:'#64748b' }}>Stok produk Toko Kesehatan HaloHealth.</p>
            </div>
            <Link to="/admin/medicines/create" style={{ background:'#0ea5e9', color:'white', padding:'10px 16px', borderRadius:'8px', textDecoration:'none', display:'flex', alignItems:'center', gap:'8px', fontWeight:'600' }}>
                <Plus size={18} /> Tambah Obat
            </Link>
        </div>

        <div style={{ background:'white', padding:'16px', borderRadius:'12px', boxShadow:'0 2px 5px rgba(0,0,0,0.05)', marginBottom:'20px', display:'flex', alignItems:'center', gap:'10px' }}>
            <Search size={20} color="#94a3b8" />
            <input 
                type="text" placeholder="Cari nama obat atau kategori..." 
                value={search} onChange={(e) => setSearch(e.target.value)}
                style={{ border:'none', outline:'none', width:'100%', fontSize:'14px' }}
            />
        </div>

        <div style={{ background:'white', borderRadius:'12px', overflow:'hidden', boxShadow:'0 4px 6px rgba(0,0,0,0.05)' }}>
            {loading ? (
                <div style={{ padding:'40px', textAlign:'center' }}><Loader2 className="animate-spin" style={{margin:'0 auto'}} color="#0ea5e9"/></div>
            ) : (
                <table style={{ width:'100%', borderCollapse:'collapse', textAlign:'left' }}>
                    <thead style={{ background:'#f8fafc', borderBottom:'1px solid #e2e8f0' }}>
                        <tr>
                            <th style={{ padding:'16px', color:'#64748b' }}>Produk</th>
                            <th style={{ padding:'16px', color:'#64748b' }}>Kategori</th>
                            <th style={{ padding:'16px', color:'#64748b' }}>Stok</th>
                            <th style={{ padding:'16px', color:'#64748b' }}>Harga</th>
                            <th style={{ padding:'16px', color:'#64748b', textAlign:'center' }}>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredMedicines.length > 0 ? filteredMedicines.map((item) => (
                            <tr key={item.id} style={{ borderBottom:'1px solid #f1f5f9' }}>
                                <td style={{ padding:'16px', display:'flex', alignItems:'center', gap:'12px' }}>
                                    <div style={{ width:'45px', height:'45px', borderRadius:'8px', background:'#f1f5f9', overflow:'hidden', display:'flex', justifyContent:'center', alignItems:'center' }}>
                                        {item.image ? (
                                            <img src={getImageUrl(item.image)} alt="med" style={{ width:'100%', height:'100%', objectFit:'contain' }} />
                                        ) : ( <Pill size={20} color="#94a3b8" /> )}
                                    </div>
                                    <div style={{ fontWeight:'600', color:'#1e293b' }}>{item.name}</div>
                                </td>
                                <td style={{ padding:'16px' }}>
                                    <span style={{ background:'#f0f9ff', color:'#0369a1', padding:'4px 10px', borderRadius:'6px', fontSize:'12px', fontWeight:'600' }}>
                                        {item.category}
                                    </span>
                                </td>
                                <td style={{ padding:'16px' }}>
                                    <div style={{ display:'flex', alignItems:'center', gap:'5px', color: item.stock < 10 ? '#ef4444' : '#64748b' }}>
                                        <Package size={14} /> {item.stock} unit
                                    </div>
                                </td>
                                <td style={{ padding:'16px', fontWeight:'bold', color:'#0ea5e9' }}>
                                    Rp {item.price.toLocaleString()}
                                </td>
                                <td style={{ padding:'16px', textAlign:'center' }}>
                                    <div style={{ display:'flex', justifyContent:'center', gap:'8px' }}>
                                        <Link to={`/admin/medicines/edit/${item.id}`} style={{ background:'#e0f2fe', padding:'8px', borderRadius:'6px', color:'#0284c7' }}><Pencil size={16} /></Link>
                                        <button onClick={() => handleDelete(item.id)} style={{ background:'#fee2e2', border:'none', padding:'8px', borderRadius:'6px', cursor:'pointer', color:'#ef4444' }}><Trash2 size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                             <tr><td colSpan="5" style={{ padding:'30px', textAlign:'center', color:'#94a3b8' }}>Obat tidak ditemukan.</td></tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    </div>
  );
}