import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/header';
import Footer from '../components/Footer';
import { 
    Search, Star, Stethoscope, 
    Baby, Heart, Eye, Brain, Smile, 
    Zap, Activity, Loader2, MessageCircle, ShieldCheck, Clock
} from 'lucide-react';

export default function Doctors() {
  const navigate = useNavigate();
  
  // STATE
  const [doctors, setDoctors] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  // LIST KATEGORI
  const categories = [
    { name: 'Dokter Umum', icon: <Stethoscope size={24} color="#0ea5e9" />, color: '#e0f2fe' },
    { name: 'Spesialis Anak', icon: <Baby size={24} color="#ec4899" />, color: '#fce7f3' },
    { name: 'Spesialis Kulit', icon: <Smile size={24} color="#f59e0b" />, color: '#fef3c7' },
    { name: 'Penyakit Dalam', icon: <Zap size={24} color="#8b5cf6" />, color: '#ede9fe' },
    { name: 'Kandungan', icon: <Baby size={24} color="#ec4899" />, color: '#fce7f3' },
    { name: 'Spesialis THT', icon: <Activity size={24} color="#10b981" />, color: '#d1fae5' },
    { name: 'Kesehatan Jiwa', icon: <Brain size={24} color="#6366f1" />, color: '#e0e7ff' },
    { name: 'Dokter Gigi', icon: <Smile size={24} color="#06b6d4" />, color: '#cffafe' },
    { name: 'Dokter Hewan', icon: <Activity size={24} color="#f97316" />, color: '#ffedd5' },
    { name: 'Spesialis Mata', icon: <Eye size={24} color="#3b82f6" />, color: '#dbeafe' },
    { name: 'Spesialis Jantung', icon: <Heart size={24} color="#ef4444" />, color: '#fee2e2' },
  ];

  // FETCH DATA (SINKRON DENGAN BACKEND BARU)
  useEffect(() => {
    const fetchDoctors = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/doctors');
            const result = await response.json();
            // Ambil data dari result.data karena struktur API baru
            const finalData = result.data ? result.data : (Array.isArray(result) ? result : []);
            setDoctors(finalData);
        } catch (error) {
            console.error("Gagal ambil data dokter:", error);
            setDoctors([]);
        } finally {
            setLoading(false);
        }
    };
    fetchDoctors();
  }, []);

  // FILTER LOGIC
  const filteredDoctors = doctors.filter(doc => {
      // Menggunakan doc.specialization sesuai database
      const categoryMatch = selectedCategory === "Semua" ? true : (doc.specialization || doc.specialist) === selectedCategory;
      const name = doc.user?.name || doc.name || "";
      const searchMatch = name.toLowerCase().includes(searchTerm.toLowerCase());
      return categoryMatch && searchMatch;
  });

  // HELPER URL GAMBAR
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://cdn-icons-png.flaticon.com/512/3774/3774299.png";
    if (imagePath.startsWith('http')) return imagePath;
    return `http://127.0.0.1:8000/${imagePath.replace(/^\//, '')}`;
  };

  return (
    <div style={{ background: 'white', minHeight: '100vh', fontFamily: '"Inter", sans-serif', color: '#333' }}>
      <Header />

      <div className="container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 20px' }}>
        
        {/* === SECTION ATAS: SPLIT LAYOUT === */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '50px', alignItems: 'start', marginBottom: '60px' }}>
            
            <div className='hidden-mobile'> 
                <h1 style={{ fontSize: '26px', fontWeight: 'bold', color: '#334155', marginBottom: '10px' }}>
                    Chat Dokter di HaloHealth
                </h1>
                <p style={{ color: '#64748b', lineHeight: '1.6', marginBottom: '30px' }}>
                    Layanan telemedisin yang siap siaga untuk bantu kamu hidup lebih sehat.
                </p>

                <div style={{ marginBottom: '30px' }}>
                    <img 
                        src="https://img.freepik.com/free-vector/doctor-consultation-concept-illustration_114360-1296.jpg" 
                        alt="Consultation" 
                        style={{ width: '100%', borderRadius: '16px' }} 
                    />
                </div>
                
                <h4 style={{ fontWeight: 'bold', color: '#334155', marginBottom: '15px' }}>
                    Mengapa Chat Dokter di HaloHealth?
                </h4>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <li style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '14px', color: '#475569' }}>
                        <div style={{ background: '#fce7f3', padding: '8px', borderRadius: '50%', color: '#db2777' }}><MessageCircle size={18} /></div>
                        Satu aplikasi untuk berbagai kebutuhan, dari chat dokter hingga beli obat.
                    </li>
                    <li style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '14px', color: '#475569' }}>
                        <div style={{ background: '#dcfce7', padding: '8px', borderRadius: '50%', color: '#16a34a' }}><ShieldCheck size={18} /></div>
                        Dapatkan rujukan ke pemeriksaan offline di RS jika diperlukan.
                    </li>
                    <li style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '14px', color: '#475569' }}>
                        <div style={{ background: '#e0f2fe', padding: '8px', borderRadius: '50%', color: '#0284c7' }}><Clock size={18} /></div>
                        Dapat diintegrasikan dengan asuransi kesehatan rekanan korporasi.
                    </li>
                </ul>
            </div>

            <div>
                 <div style={{ marginBottom: '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', borderRadius: '8px', padding: '5px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        <Search style={{ marginLeft: '15px', color: '#cbd5e1' }} />
                        <input 
                            type="text" 
                            placeholder="Cari dokter, spesialis, atau keluhan..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: '100%', padding: '15px', border: 'none', outline: 'none', fontSize: '15px' }}
                        />
                    </div>
                </div>

                <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', color: '#334155' }}>
                    Cari Dokter atau Spesialisasi
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '25px 10px', justifyContent: 'center' }}>
                    {categories.map((cat) => (
                        <div key={cat.name} onClick={() => setSelectedCategory(selectedCategory === cat.name ? 'Semua' : cat.name)}
                             style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', textAlign: 'center', opacity: (selectedCategory === "Semua" || selectedCategory === cat.name) ? 1 : 0.4 }}>
                            <div style={{ width: '55px', height: '55px', borderRadius: '50%', background: cat.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px', border: selectedCategory === cat.name ? '2px solid #0ea5e9' : 'none' }}>
                                {cat.icon}
                            </div>
                            <span style={{ fontSize: '12px', color: '#475569', lineHeight: '1.3', fontWeight: '500' }}>{cat.name}</span>
                        </div>
                    ))}
                </div>

                <div style={{ marginTop: '40px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', color: '#334155', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px' }}>
                        {selectedCategory === "Semua" ? "Rekomendasi Dokter Terbaik" : `Dokter ${selectedCategory}`}
                    </h3>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '30px' }}><Loader2 className="animate-spin" /></div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px' }}>
                            {filteredDoctors.length > 0 ? (
                                filteredDoctors.map((doc) => (
                                    <div key={doc.id} onClick={() => navigate(`/doctors/${doc.id}`)}
                                         style={{ display: 'flex', gap: '15px', padding: '15px', background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', cursor: 'pointer', transition: '0.2s' }}>
                                        <img 
                                            src={getImageUrl(doc.image)} alt="doctor" 
                                            style={{ width: '70px', height: '70px', borderRadius: '10px', objectFit: 'cover' }}
                                            onError={(e) => e.target.src = "https://cdn-icons-png.flaticon.com/512/3774/3774299.png"}
                                        />
                                        <div style={{ flex: 1 }}>
                                            <h4 style={{ margin: '0 0 5px', fontSize: '16px', fontWeight: 'bold' }}>{doc.user?.name || doc.name}</h4>
                                            <p style={{ margin: '0 0 8px', fontSize: '13px', color: '#0ea5e9' }}>{doc.specialization || doc.specialist}</p>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ fontSize: '12px', color: '#94a3b8' }}>{doc.experience_years || 0} Tahun Pengalaman</span>
                                                <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#f59e0b' }}>Rp {(doc.consultation_fee || doc.price || 0).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p style={{ color: '#94a3b8', textAlign: 'center' }}>Tidak ada dokter ditemukan.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* === SECTION SEO TEXT (HAPUS JANGAN SAMPAI ILANG!) === */}
        <div style={{ marginTop: '80px', borderTop: '1px solid #e2e8f0', paddingTop: '40px', color: '#64748b', fontSize: '14px', lineHeight: '1.8' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#334155', marginBottom: '15px' }}>
                Tanya Dokter Umum dan Spesialis di HaloHealth
            </h2>
            <p style={{ marginBottom: '20px' }}>
                Kini kamu bisa tanya dokter online langsung dari website HaloHealth. Layanan kesehatan online terpercaya di Indonesia ini memiliki daftar dokter pilihan terbaik di bidangnya masing-masing. Mulai dari dokter umum yang bisa membantu menjawab keluhan ringan, hingga dokter spesialis berpengalaman dan terpercaya. Terdiri dari banyak jenis dokter spesialis. Mulai dari dokter gigi, ahli kebidanan, spesialis penyakit dalam, THT, spesialis mata, hingga dokter spesialis anak. Semua dokter akan memberikan layanan kesehatan yang kamu butuhkan untuk memberi jalan keluar atas masalah kesehatan yang lebih berat. Jangan tunggu hingga parah, langsung konsultasikan kondisi kesehatan kamu agar bisa segera ditangani oleh yang berpengalaman hanya di HaloHealth!
            </p>

            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#334155', marginBottom: '10px' }}>
                Mengapa Pilih Tanya Dokter HaloHealth?
            </h3>
            <p style={{ marginBottom: '20px' }}>
                Memilih Tanya Dokter HaloHealth akan mempertemukan kamu dengan tenaga medis profesional secara cepat. Tidak perlu repot mencari dokter terdekat dan harus keluar rumah. HaloHealth memastikan kamu mendapatkan pelayanan terbaik dari tim dokter spesialis di Indonesia yang terhubung langsung dari halaman website HaloHealth.
                <br /><br />
                Fasilitas ini bisa kamu gunakan untuk menjawab pelbagai masalah kesehatan yang sering dialami seperti Gejala tipes, Anemia, dan Hepatitis. Selain itu kamu juga bisa memastikan kondisi kesehatan kamu yang berkaitan dengan organ penting seperti kondisi pneumonia dan bronkitis di paru-paru. Masalah kesehatan yang kerap kali jadi pertanyaan misalnya masalah kista dan kehamilan bagi wanita, juga kesehatan keluarga kamu yang berkaitan dengan gejala usus buntu, Asam lambung, hingga batu ginjal.
            </p>

            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#334155', marginBottom: '10px' }}>
                Memiliki dokter berpengalaman di seluruh Indonesia
            </h3>
            <p style={{ marginBottom: '20px' }}>
                Dokter Online HaloHealth bukanlah praktisi kesehatan sembarangan. Kamu bisa terhubung langsung dengan cepat dan mudah, serta tidak perlu meragukan kualitas konsultasi dan penanganan yang ditawarkan.
            </p>

            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#334155', marginBottom: '10px' }}>
                Privasi kamu tetap terjaga
            </h3>
            <p style={{ marginBottom: '20px' }}>
                Tak perlu khawatir, semua percakapan dan diagnosis kesehatanmu dengan dokter di HaloHealth akan terjaga keprivasiannya.
            </p>

            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#334155', marginBottom: '10px' }}>
                Cara Menghubungi Dokter Online
            </h3>
            <p style={{ marginBottom: '15px' }}>
                Konsultasi dengan dokter HaloHealth secara online bisa dilakukan dengan cepat. Hanya dengan tiga langkah mudah kamu bisa terhubung dengan dokter yang kamu butuhkan.
            </p>
            <ol style={{ paddingLeft: '20px', marginBottom: '20px' }}>
                <li style={{ marginBottom: '10px' }}>
                    <strong>Langkah pertama:</strong> Pilih dari dokter-dokter terbaik yang tersedia, dan kirim permintaan untuk berbicara sesuai dengan kebutuhan atau keluhan kesehatanmu.
                </li>
                <li style={{ marginBottom: '10px' }}>
                    <strong>Langkah kedua:</strong> Tunggu dokter. Dokter akan menyetujui permintaan kamu (biasanya dalam satu menit).
                </li>
                <li>
                    <strong>Langkah terakhir:</strong> Bicara dengan dokter. Saat kamu telah terhubung dengan dokter, silahkan jelaskan kondisi kamu dengan tenang dan jelas dengan tanya dokter HaloHealth.
                </li>
            </ol>
        </div>

      </div>
      <Footer />
    </div>
  );
}