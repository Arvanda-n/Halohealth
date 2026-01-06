import { useState, useEffect } from 'react';
import { CalendarCheck, User, Clock, Loader2, CheckCircle, XCircle } from 'lucide-react';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Booking dari Backend (Consultations)
  const fetchBookings = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/consultations', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const result = await response.json();
      setBookings(Array.isArray(result.data) ? result.data : []);
    } catch (error) {
      console.error("Gagal ambil booking:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  // Update Status (Selesai/Batal)
  const updateStatus = async (id, status) => {
    if(!confirm(`Ubah status jadi ${status}?`)) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/consultations/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify({ status: status })
      });
      if(res.ok) { fetchBookings(); }
    } catch (err) { alert("Gagal update status"); }
  };

  return (
    <div>
      <div style={{ marginBottom:'24px' }}>
        <h1 style={{ fontSize:'24px', fontWeight:'bold', color:'#1e293b' }}>Jadwal Konsultasi</h1>
        <p style={{ color:'#64748b' }}>Daftar janji temu pasien dan dokter.</p>
      </div>

      {loading ? (
        <div style={{ textAlign:'center', padding:'40px' }}><Loader2 className="animate-spin" style={{margin:'0 auto'}} color="#0ea5e9"/></div>
      ) : (
        <div style={{ display:'grid', gap:'16px' }}>
          {bookings.length > 0 ? bookings.map((item) => (
            <div key={item.id} style={{ background:'white', padding:'20px', borderRadius:'12px', border:'1px solid #e2e8f0', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              
              <div style={{ display:'flex', gap:'20px', alignItems:'center' }}>
                <div style={{ width:'50px', height:'50px', background:'#f0f9ff', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', color:'#0ea5e9' }}>
                  <CalendarCheck size={24} />
                </div>
                <div>
                   <h4 style={{ margin:'0 0 5px', fontSize:'16px', fontWeight:'bold' }}>
                      {item.doctor?.name || 'Dokter Umum'}
                   </h4>
                   <div style={{ display:'flex', gap:'15px', fontSize:'13px', color:'#64748b' }}>
                      <span style={{ display:'flex', alignItems:'center', gap:'5px' }}><User size={14}/> {item.user?.name || 'Pasien'}</span>
                      <span style={{ display:'flex', alignItems:'center', gap:'5px' }}><Clock size={14}/> {item.schedule_date || 'Tgl Tidak Ada'}</span>
                   </div>
                   <p style={{ margin:'5px 0 0', fontSize:'13px', color:'#334155', fontStyle:'italic' }}>
                      "{item.complaint || 'Tidak ada keluhan spesifik'}"
                   </p>
                </div>
              </div>

              <div style={{ display:'flex', flexDirection:'column', alignItems:'end', gap:'10px' }}>
                <span style={{ 
                  background: item.status === 'selesai' ? '#dcfce7' : (item.status === 'batal' ? '#fee2e2' : '#fff7ed'), 
                  color: item.status === 'selesai' ? '#16a34a' : (item.status === 'batal' ? '#ef4444' : '#ea580c'),
                  padding:'5px 12px', borderRadius:'20px', fontSize:'12px', fontWeight:'bold', textTransform:'uppercase'
                }}>
                  {item.status || 'Menunggu'}
                </span>
                
                <div style={{ display:'flex', gap:'8px' }}>
                   <button onClick={() => updateStatus(item.id, 'selesai')} title="Selesai" style={{ background:'#22c55e', border:'none', padding:'8px', borderRadius:'6px', cursor:'pointer', color:'white' }}><CheckCircle size={16}/></button>
                   <button onClick={() => updateStatus(item.id, 'batal')} title="Batal" style={{ background:'#ef4444', border:'none', padding:'8px', borderRadius:'6px', cursor:'pointer', color:'white' }}><XCircle size={16}/></button>
                </div>
              </div>

            </div>
          )) : (
            <div style={{ textAlign:'center', padding:'40px', color:'#94a3b8', background:'white', borderRadius:'12px' }}>Belum ada jadwal konsultasi masuk.</div>
          )}
        </div>
      )}
    </div>
  );
}