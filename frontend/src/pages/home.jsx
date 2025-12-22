import Header from '../components/header'
import ServiceMenu from '../components/servicemenu'
import DoctorCard from '../components/DoctorCard'
import Sidebar from '../components/sidebar'
import foto1 from "../assets/foto3.png";
import foto2 from "../assets/foto2.png";
import foto3 from "../assets/foto4.png";
import chatIcon from "../assets/icons/chat.png";
import tokoIcon from "../assets/icons/toko.png";
import homecareIcon from "../assets/icons/homecare.png";
import asuransiIcon from "../assets/icons/asuransi.png";
import skinIcon from "../assets/icons/haloskin.png";
import fitIcon from "../assets/icons/halofit.png";



export default function Home() {
  const doctors = [
    { id: 1, name: 'Dr. Andi', specialist: 'Dokter Umum', price: '25.000' },
    { id: 2, name: 'Dr. Sinta', specialist: 'Dokter Anak', price: '35.000' },
  ]

    const supports = [
  {
    icon: chatIcon,
    title: "Chat dengan Dokter",
    desc: "Lebih dari 50 spesialis tersedia 24 jam",
  },
  {
    icon: tokoIcon,
    title: "Toko Kesehatan",
    desc: "100% produk asli, 1 jam sampai",
  },
  {
    icon: homecareIcon,
    title: "Homecare",
    desc: "Tes lab, vaksin & dokter ke rumah",
  },
  {
    icon: asuransiIcon,
    title: "Asuransiku",
    desc: "Bayar menggunakan asuransimu",
  },
  {
    icon: skinIcon,
    title: "Haloskin",
    desc: "Perawatan kulit berbasis medis",
  },
  {
    icon: fitIcon,
    title: "Halofit",
    desc: "Program tubuh fit klinis",
  },
];

  

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
  <img src={foto3} className="photo big" alt="foto 3" />
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
    {Array.from({ length: 0 }).map((_, i) => (
      <div key={i} className="support-item">ICON</div>
    ))}
  </div>
</section>

<div className="support-grid">
  {supports.map((item, i) => (
    <div key={i} className="support-card">
      <img src={item.icon} alt={item.title} />

      <div className="support-text">
        <h4>{item.title}</h4>
        <p>{item.desc}</p>
      </div>

      <span className="arrow">›</span>
    </div>
  ))}
</div>


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
