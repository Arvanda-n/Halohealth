import Header from '../components/header'
import ServiceMenu from '../components/servicemenu'
import DoctorCard from '../components/DoctorCard'
import Sidebar from '../components/sidebar'

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
