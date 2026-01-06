import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Save, ArrowLeft, ImageIcon, Loader2 } from 'lucide-react';

export default function AdminMedicineEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    sub_category: ''
  });
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const fetchMedicine = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/medicines/${id}`);
        const result = await response.json();
        if (result.success) {
          const med = result.data;
          setFormData({
            name: med.name,
            description: med.description,
            price: med.price,
            stock: med.stock,
            category: med.category,
            sub_category: med.sub_category || ''
          });
          setPreview(med.image);
        }
      } catch (error) {
        alert("Gagal ambil data");
      } finally {
        setInitialLoading(false);
      }
    };
    fetchMedicine();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (photo) data.append('photo', photo);
    data.append('_method', 'PUT'); // Spoofing method

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/medicines/${id}`, {
        method: 'POST', // Gunakan POST + _method PUT
        body: data,
      });

      if (response.ok) {
        alert('Data obat diperbarui! ✅');
        navigate('/admin/medicines');
      } else {
        alert('Gagal memperbarui data');
      }
    } catch (error) {
      alert('Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) return <div style={{ textAlign: 'center', padding: '50px' }}>Loading data...</div>;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
        <Link to="/admin/medicines" style={{ background: 'white', padding: '10px', borderRadius: '50%', display: 'flex', color: '#64748b', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b' }}>Edit Obat</h1>
          <p style={{ color: '#64748b' }}>Sesuaikan informasi stok atau harga.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div style={{ background: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          {/* SAMA DENGAN FORM CREATE DI ATAS */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Nama Obat</label>
            <input type="text" name="name" required value={formData.name} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Kategori</label>
              <select name="category" value={formData.category} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white' }}>
                <option value="Tablet">Tablet</option>
                <option value="Obat Cair">Obat Cair</option>
                <option value="Vitamin">Vitamin</option>
                <option value="Ibu & Bayi">Ibu & Bayi</option>
                <option value="Herbal">Herbal</option>
                <option value="Alat Kesehatan">Alat Kesehatan</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Sub Kategori</label>
              <input type="text" name="sub_category" value={formData.sub_category} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Harga (Rp)</label>
              <input type="number" name="price" required value={formData.price} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Stok</label>
              <input type="number" name="stock" required value={formData.stock} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Deskripsi Obat</label>
            <textarea name="description" required value={formData.description} onChange={handleChange} rows="4" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}></textarea>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', textAlign: 'center' }}>
            <label style={{ display: 'block', marginBottom: '15px', fontWeight: '600' }}>Foto Produk</label>
            <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1', borderRadius: '12px', overflow: 'hidden', border: '2px dashed #e2e8f0', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {preview ? <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : <ImageIcon size={40} color="#cbd5e1" />}
              <input type="file" accept="image/*" onChange={handleFileChange} style={{ position: 'absolute', opacity: 0, inset: 0, cursor: 'pointer' }} />
            </div>
          </div>
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', background: '#0ea5e9', color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
            {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
            {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </form>
    </div>
  );
}