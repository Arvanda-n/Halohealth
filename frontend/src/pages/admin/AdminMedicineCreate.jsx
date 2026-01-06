import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Save, ArrowLeft, ImageIcon, Loader2 } from 'lucide-react';

export default function AdminMedicineCreate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: 'Tablet',
    sub_category: 'Demam & Flu' // Default sub kategori
  });
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);

  const subCategories = ["Demam & Flu", "Batuk", "Pencernaan", "Vitamin & Suplemen", "Ibu & Anak", "Perawatan Luka", "Alat Kesehatan", "Herbal & Jamu"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Cegah angka minus untuk price dan stock
    if ((name === 'price' || name === 'stock') && value < 0) return;
    setFormData({ ...formData, [name]: value });
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

    try {
      const response = await fetch('http://127.0.0.1:8000/api/medicines', {
        method: 'POST',
        body: data,
      });
      if (response.ok) {
        alert('Obat berhasil ditambahkan! 💊');
        navigate('/admin/medicines');
      }
    } catch (error) {
      alert('Koneksi gagal');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
        <Link to="/admin/medicines" style={{ background: 'white', padding: '10px', borderRadius: '50%', color: '#64748b', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}><ArrowLeft size={20} /></Link>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Tambah Obat</h1>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div style={{ background: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Nama Obat</label>
            <input type="text" name="name" required value={formData.name} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Kategori</label>
              <select name="category" value={formData.category} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <option value="Tablet">Tablet</option>
                <option value="Obat Cair">Obat Cair</option>
                <option value="Vitamin">Vitamin</option>
                <option value="Herbal">Herbal</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Sub Kategori</label>
              <select name="sub_category" value={formData.sub_category} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                {subCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Harga (Rp)</label>
              <input type="number" name="price" required min="0" value={formData.price} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Stok</label>
              <input type="number" name="stock" required min="0" value={formData.stock} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Deskripsi</label>
            <textarea name="description" required value={formData.description} onChange={handleChange} rows="4" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}></textarea>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: 'white', padding: '20px', borderRadius: '16px', textAlign: 'center' }}>
            <label style={{ display: 'block', marginBottom: '15px', fontWeight: '600' }}>Foto</label>
            <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1', borderRadius: '12px', overflow: 'hidden', border: '2px dashed #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {preview ? <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : <ImageIcon size={40} color="#cbd5e1" />}
              <input type="file" accept="image/*" onChange={handleFileChange} style={{ position: 'absolute', opacity: 0, inset: 0, cursor: 'pointer' }} />
            </div>
          </div>
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', background: '#0ea5e9', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? <Loader2 className="animate-spin" /> : 'Simpan Obat'}
          </button>
        </div>
      </form>
    </div>
  );
}