import Header from '../components/header'
import ServiceMenu from '../components/servicemenu'
import DoctorCard from '../components/DoctorCard'
import Sidebar from '../components/sidebar'
import foto1 from "../assets/foto1.png";
import foto2 from "../assets/foto2.png";


export default function Home() {
  const doctors = [
    { id: 1, name: 'Dr. Andi', specialist: 'Dokter Umum', price: '25.000' },
    { id: 2, name: 'Dr. Sinta', specialist: 'Dokter Anak', price: '35.000' },
    
  ]

  return (
    <div className="desktop-layout">
      {/* SIDEBAR DESKTOP */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <div className="main-content">
        <Header />

        {/* Banner */}
        <div className="banner">
          <h2>Konsultasi Dokter Online</h2>
          <p>Chat dokter 24 jam, kapan saja</p>
          <button className="btn">Mulai Sekarang</button>
        </div>



<section className="photo-section"> 
  <img src={foto1} className="photo big" alt="foto 1" />
  <img src={foto2} className="photo small" alt="foto 2" />
</section>


{/* === MEDICAL BOARD === */}
<section className="medical-section">
  <h3>Diawasi oleh Board of Medical Excellence</h3>
  <p>
    Seluruh layanan kesehatan diawasi oleh tenaga medis profesional.
  </p>
</section>

{/* === DUKUNGAN BERBAGAI KEBUTUHAN === */}
<section className="support-section">
  <h3>Dukungan untuk Berbagai Kebutuhan</h3>
  <div className="support-grid">
    {Array.from({ length: 12 }).map((_, i) => (
      <div key={i} className="support-item">ICON</div>
    ))}
  </div>
</section>






        {/* Menu Layanan */}
        <ServiceMenu />

        {/* Dokter Rekomendasi */}
        <div className="container">
          <h3>Dokter Rekomendasi</h3>
          {doctors.map(d => (
            <DoctorCard key={d.id} doctor={d} />
          ))}
        </div>
      </div>
    </div>
  )
}
