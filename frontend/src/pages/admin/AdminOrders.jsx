import { useState, useEffect } from 'react';
import { ShoppingCart, Eye, CheckCircle, Truck, Package, XCircle, Clock, Loader2 } from 'lucide-react';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. FETCH DATA DARI DATABASE
  const fetchOrders = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/admin/orders', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const result = await response.json();
      setOrders(result.data || []);
    } catch (error) {
      console.error("Gagal ambil order:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  // 2. UPDATE STATUS LOGIC
  const handleStatusChange = async (id, newStatus) => {
    if(!confirm(`Ubah status jadi ${newStatus}?`)) return;
    try {
        const res = await fetch(`http://127.0.0.1:8000/api/admin/orders/${id}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}` 
            },
            body: JSON.stringify({ status: newStatus })
        });
        if(res.ok) fetchOrders(); // Refresh data
    } catch (error) { alert("Gagal update"); }
  };

  const getStatusColor = (status) => {
    if(status === 'completed') return { bg:'#dcfce7', text:'#16a34a', icon: <CheckCircle size={14}/> };
    if(status === 'process') return { bg:'#e0f2fe', text:'#0284c7', icon: <Truck size={14}/> };
    if(status === 'cancelled') return { bg:'#fee2e2', text:'#ef4444', icon: <XCircle size={14}/> };
    return { bg:'#fff7ed', text:'#ea580c', icon: <Clock size={14}/> };
  };

  return (
    <div>
      <div style={{ marginBottom:'24px' }}>
        <h1 style={{ fontSize:'24px', fontWeight:'bold', color:'#1e293b' }}>Pesanan Masuk</h1>
        <p style={{ color:'#64748b' }}>Realtime data transaksi dari database.</p>
      </div>

      <div style={{ background:'white', borderRadius:'12px', overflow:'hidden', boxShadow:'0 4px 6px rgba(0,0,0,0.05)' }}>
        {loading ? (
            <div style={{ padding:'40px', textAlign:'center' }}><Loader2 className="animate-spin" style={{margin:'0 auto'}}/></div>
        ) : (
            <table style={{ width:'100%', borderCollapse:'collapse', textAlign:'left' }}>
                <thead style={{ background:'#f8fafc', borderBottom:'1px solid #e2e8f0' }}>
                    <tr>
                        <th style={{ padding:'16px', color:'#64748b' }}>Invoice</th>
                        <th style={{ padding:'16px', color:'#64748b' }}>Pembeli</th>
                        <th style={{ padding:'16px', color:'#64748b' }}>Items (Note)</th>
                        <th style={{ padding:'16px', color:'#64748b' }}>Total</th>
                        <th style={{ padding:'16px', color:'#64748b' }}>Status</th>
                        <th style={{ padding:'16px', color:'#64748b', textAlign:'center' }}>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.length > 0 ? orders.map((order) => {
                        const style = getStatusColor(order.status);
                        return (
                            <tr key={order.id} style={{ borderBottom:'1px solid #f1f5f9' }}>
                                <td style={{ padding:'16px', fontWeight:'bold', color:'#1e293b', fontSize:'13px' }}>{order.invoice_code}</td>
                                <td style={{ padding:'16px' }}>
                                    <div style={{ fontWeight:'600' }}>{order.user?.name || 'Unknown'}</div>
                                    <div style={{ fontSize:'12px', color:'#94a3b8' }}>{new Date(order.created_at).toLocaleDateString('id-ID')}</div>
                                </td>
                                <td style={{ padding:'16px', color:'#64748b', maxWidth:'200px' }}>
                                    <div style={{display:'flex', alignItems:'center', gap:'5px', fontSize:'13px'}}>
                                        <Package size={14}/> {order.note || 'No Detail'}
                                    </div>
                                </td>
                                <td style={{ padding:'16px', fontWeight:'bold', color:'#0ea5e9' }}>
                                    Rp {order.total_price.toLocaleString('id-ID')}
                                </td>
                                <td style={{ padding:'16px' }}>
                                    <span style={{ background: style.bg, color: style.text, padding:'4px 10px', borderRadius:'20px', fontSize:'11px', fontWeight:'bold', textTransform:'uppercase', display:'inline-flex', alignItems:'center', gap:'4px' }}>
                                        {style.icon} {order.status}
                                    </span>
                                </td>
                                <td style={{ padding:'16px', textAlign:'center' }}>
                                    <select 
                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                        value={order.status}
                                        style={{ padding:'6px', borderRadius:'6px', border:'1px solid #e2e8f0', fontSize:'12px', cursor:'pointer' }}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="process">Proses</option>
                                        <option value="completed">Selesai</option>
                                        <option value="cancelled">Batal</option>
                                    </select>
                                </td>
                            </tr>
                        );
                    }) : (
                        <tr><td colSpan="6" style={{ padding:'30px', textAlign:'center', color:'#94a3b8' }}>Belum ada pesanan masuk.</td></tr>
                    )}
                </tbody>
            </table>
        )}
      </div>
    </div>
  );
}