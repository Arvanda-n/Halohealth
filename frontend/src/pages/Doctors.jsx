import Header from '../components/header';
import DoctorCard from '../components/DoctorCard';

export default function Doctors() {
  const doctors = [
    { id: 1, name: 'Dr. Andi', specialist: 'Dokter Umum', price: '25.000' },
    { id: 2, name: 'Dr. Sinta', specialist: 'Dokter Anak', price: '35.000' },
    { id: 3, name: 'Dr. Budi', specialist: 'Dokter Gigi', price: '30.000' },
    { id: 4, name: 'Dr. Lina', specialist: 'Dokter Kulit', price: '40.000' },
  ];

  console.log('DOCTORS ARRAY:', doctors);

  return (
    <div style={{ background: '#f4f6f8', minHeight: '200vh' }}>
      <Header />

      <div className="container">
        <h2>Daftar Dokter</h2>

        {doctors.map((doctor) => (
          <DoctorCard key={doctor.id} doctor={doctor} />
        ))}
      </div>
    </div>
  );
}
