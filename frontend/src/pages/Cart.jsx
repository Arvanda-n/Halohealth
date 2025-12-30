import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/header';
import Footer from '../components/Footer';
// 👇 KITA PAKE LUCIDE UTK ICON YANG BAGUS-BAGUS AJA
import { Trash2, ArrowLeft, ShieldCheck, Loader2, ShoppingBag, AlertTriangle } from 'lucide-react';

export default function Cart() {
  const navigate = useNavigate();

  // STATE DATA
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // STATE MODAL HAPUS
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // 1. AMBIL DATA CART
  const fetchCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        alert("Sesi habis, silakan login lagi.");
        navigate('/login');
        return;
    }
    try {
        setLoading(true);
        const response = await fetch('http://127.0.0.1:8000/api/carts', {
            headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
        });
        if (!response.ok) throw new Error('Gagal mengambil keranjang');
        const data = await response.json();
        setCartItems(data);
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => { fetchCart(); }, []);

  // HITUNG TOTAL
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = subtotal * 0.11;
  const total = subtotal + tax;

  // 2. UPDATE JUMLAH
  const updateQty = async (cartId, currentQty, change) => {
    const newQty = currentQty + change;
    if (newQty < 1) return; 

    const token = localStorage.getItem('token');
    try {
        setCartItems(items => items.map(item => item.id === cartId ? { ...item, quantity: newQty } : item));
        await fetch(`http://127.0.0.1:8000/api/carts/${cartId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ quantity: newQty })
        });
    } catch (err) { fetchCart(); }
  };

  // 3. LOGIKA HAPUS (Buka Modal)
  const askToDelete = (id) => {
      setDeleteId(id);
      setShowModal(true);
  };

  // 4. KONFIRMASI HAPUS
  const confirmDelete = async () => {
    if (!deleteId) return;
    const token = localStorage.getItem('token');
    try {
        setCartItems(items => items.filter(item => item.id !== deleteId));
        setShowModal(false);
        await fetch(`http://127.0.0.1:8000/api/carts/${deleteId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
    } catch (err) {
        alert("Gagal menghapus barang");
        fetchCart();
    }
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: '"Inter", sans-serif', display:'flex', flexDirection:'column' }}>
      
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 99, background: 'white', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <Header />
      </div>

      <div className="container" style={{ flex: 1, maxWidth: '1100px', margin: '0 auto', padding: '30px 20px', paddingTop: '100px', width: '100%' }}>
        
        {/* JUDUL */}
        <div style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button onClick={() => navigate('/medicines')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <ArrowLeft /> {/* Pake Lucide */}
            </button>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>Keranjang Belanja</h2>
        </div>

        {loading ? (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Loader2 className="animate-spin" size={40} color="#0ea5e9" style={{ margin: '0 auto' }} />
                <p style={{ marginTop: '10px', color: '#64748b' }}>Memuat data keranjang...</p>
            </div>
        ) : cartItems.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'row', gap: '30px', alignItems: 'start', flexWrap: 'wrap' }}>
                
                {/* LIST BARANG */}
                <div style={{ flex: 2, minWidth: '300px' }}>
                    {cartItems.map((item) => (
                        <div key={item.id} style={{ background: 'white', borderRadius: '12px', padding: '20px', marginBottom: '20px', display: 'flex', gap: '20px', alignItems: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0' }}>
                            {/* Gambar Obat */}
                            <div style={{ width: '80px', height: '80px', background: '#f1f5f9', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                                <img src={item.image?.startsWith('http') ? item.image : `http://127.0.0.1:8000${item.image}`} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={(e) => e.target.src = "https://placehold.co/150x150?text=No+Image"} />
                            </div>
                            
                            {/* Detail Text */}
                            <div style={{ flex: 1 }}>
                                <p style={{ fontSize: '12px', color: '#0ea5e9', fontWeight: 'bold', marginBottom: '5px' }}>{item.category || 'Obat'}</p>
                                <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#334155', margin: '0 0 5px 0' }}>{item.name}</h3>
                                <p style={{ fontSize: '15px', fontWeight: 'bold', color: '#0f172a' }}>Rp {item.price?.toLocaleString('id-ID')}</p>
                            </div>

                            {/* Tombol Aksi */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'end', gap: '15px' }}>
                                {/* TOMBOL SAMPAH (PAKE LUCIDE - LEBIH BAGUS) */}
                                <button onClick={() => askToDelete(item.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }} title="Hapus">
                                    <Trash2 size={18} />
                                </button>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#f8fafc', padding: '5px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                    
                                    {/* TOMBOL MINUS (PAKE GAMBAR LINK - BIAR JELAS) */}
                                    <button onClick={() => updateQty(item.id, item.quantity, -1)} style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer' }}>
                                        <img src="https://cdn-icons-png.flaticon.com/512/561/561179.png" width="12" alt="Minus" />
                                    </button>
                                    
                                    <span style={{ fontSize: '14px', fontWeight: 'bold', minWidth: '20px', textAlign: 'center', color: '#334155' }}>{item.quantity}</span>
                                    
                                    {/* TOMBOL PLUS (PAKE GAMBAR LINK - BIAR JELAS) */}
                                    <button onClick={() => updateQty(item.id, item.quantity, 1)} style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0ea5e9', border: 'none', borderRadius: '6px', cursor: 'pointer', boxShadow: '0 2px 5px rgba(14, 165, 233, 0.3)' }}>
                                        <img src="https://cdn-icons-png.flaticon.com/512/748/748113.png" width="12" style={{ filter: 'brightness(0) invert(1)' }} alt="Plus" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* RINGKASAN BELANJA */}
                <div style={{ flex: 1, minWidth: '300px' }}>
                    <div style={{ background: 'white', borderRadius: '12px', padding: '25px', border: '1px solid #e2e8f0', position: 'sticky', top: '100px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', color: '#334155' }}>Ringkasan Belanja</h3>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#64748b', fontSize: '14px' }}><span>Total Harga ({cartItems.length} barang)</span><span>Rp {subtotal.toLocaleString('id-ID')}</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', color: '#64748b', fontSize: '14px' }}><span>Biaya Layanan & PPN (11%)</span><span>Rp {tax.toLocaleString('id-ID')}</span></div>
                        <div style={{ borderTop: '1px dashed #cbd5e1', margin: '15px 0' }}></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px', color: '#0f172a', fontSize: '18px', fontWeight: 'bold' }}><span>Total Tagihan</span><span>Rp {total.toLocaleString('id-ID')}</span></div>
                        
                        <button 
                            onClick={() => navigate('/booking-checkout')}
                            style={{ width: '100%', padding: '15px', background: '#0ea5e9', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', boxShadow: '0 4px 15px rgba(14, 165, 233, 0.3)' }}>
                            Checkout
                        </button>
                        
                        {/* ICON JAMINAN (PAKE LUCIDE - LEBIH BAGUS) */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '20px', color: '#10b981', fontSize: '13px', background: '#ecfdf5', padding: '10px', borderRadius: '8px' }}>
                            <ShieldCheck size={18} />
                            <span>Jaminan transaksi aman & terpercaya.</span>
                        </div>
                    </div>
                </div>
            </div>
        ) : (
            <div style={{ textAlign: 'center', padding: '80px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ background: '#f1f5f9', padding: '20px', borderRadius: '50%', marginBottom: '20px' }}>
                    <ShoppingBag size={50} color="#94a3b8" /> {/* Pake Lucide */}
                </div>
                <h3 style={{ color: '#334155', marginBottom: '5px' }}>Keranjang belanja kosong</h3>
                <p style={{ color: '#64748b', marginBottom: '25px' }}>Sepertinya kamu belum menambahkan obat apapun.</p>
                <button onClick={() => navigate('/medicines')} style={{ background: '#0ea5e9', color: 'white', border: 'none', padding: '12px 30px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }}>Mulai Belanja</button>
            </div>
        )}
      </div>

      <Footer />

      {/* MODAL POP-UP KONFIRMASI HAPUS (PAKE LUCIDE BIAR TAJAM) */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
            <div style={{ background: 'white', borderRadius: '16px', padding: '30px', maxWidth: '400px', width: '100%', textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', animation: 'fadeIn 0.2s ease-out' }}>
                <div style={{ width: '60px', height: '60px', background: '#fee2e2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                    <AlertTriangle color="#ef4444" size={30} />
                </div>
                
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e293b', marginBottom: '10px' }}>Hapus barang ini?</h3>
                <p style={{ color: '#64748b', fontSize: '15px', marginBottom: '30px', lineHeight: '1.5' }}>Barang yang dihapus tidak bisa dikembalikan.</p>

                <div style={{ display: 'flex', gap: '15px' }}>
                    <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', background: 'white', color: '#475569', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }}>Batal</button>
                    <button onClick={confirmDelete} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', background: '#ef4444', color: 'white', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px', boxShadow: '0 4px 10px rgba(239, 68, 68, 0.3)' }}>Ya, Hapus</button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
}