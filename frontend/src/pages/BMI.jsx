import { useState } from "react";
import Header from "../components/header";
import Footer from "../components/Footer";

export default function BMI() {
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [stress, setStress] = useState("");
  const [result, setResult] = useState(null);

  const handleCalculate = () => {
    if (!height || !weight || !gender) {
      alert("Mohon lengkapi data jenis kelamin, tinggi, dan berat badan!");
      return;
    }
    const heightMeter = height / 100;
    const bmi = (weight / (heightMeter * heightMeter)).toFixed(1);

    let status = "";
    let color = "";
    if (bmi < 18.5) {
        status = "Kurang Ideal";
        color = "#eab308"; // Kuning
    } else if (bmi < 25) {
        status = "Ideal";
        color = "#22c55e"; // Hijau
    } else {
        status = "Berlebih";
        color = "#ef4444"; // Merah
    }

    setResult({ bmi, status, color });
  };

  // --- STYLES OBJECT ---
  const s = {
    container: { maxWidth: '1100px', margin: '40px auto', padding: '0 20px', display: 'flex', gap: '40px', fontFamily: 'Inter, sans-serif' },
    main: { flex: 2, background: 'white', padding: '40px', borderRadius: '24px', boxShadow: '0 10px 40px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' },
    title: { fontSize: '28px', fontWeight: '800', color: '#1e293b', marginBottom: '8px' },
    subtitle: { color: '#64748b', marginBottom: '35px', fontSize: '15px' },
    genderBox: { display: 'flex', gap: '20px', marginBottom: '30px' },
    genderCard: (isActive) => ({
      flex: 1, padding: '20px', borderRadius: '16px', border: `2px solid ${isActive ? '#0ea5e9' : '#f1f5f9'}`,
      background: isActive ? '#f0f9ff' : 'white', cursor: 'pointer', textAlign: 'center', transition: '0.3s'
    }),
    imgCircle: { width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover', marginBottom: '10px' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '15px' },
    input: { padding: '15px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '16px', outline: 'none' },
    button: { padding: '16px', background: '#0ea5e9', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', marginTop: '10px' },
    resultCard: (color) => ({
      marginTop: '30px', padding: '30px', borderRadius: '20px', textAlign: 'center', 
      background: `${color}10`, border: `1px solid ${color}40`, animation: 'fadeIn 0.5s ease'
    }),
    info: { flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' },
    infoCard: { display: 'flex', alignItems: 'center', gap: '15px', padding: '18px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #f1f5f9' }
  };

  return (
    <div style={{ background: '#fcfcfc', minHeight: '100vh' }}>
      <Header />

      <div style={s.container}>
        {/* FORM LEFT */}
        <div style={s.main}>
          <h1 style={s.title}>Kalkulator BMI</h1>
          <p style={s.subtitle}>Cek Body Mass Index kamu secara mandiri untuk memantau kesehatan.</p>

          <div style={s.genderBox}>
            <div style={s.genderCard(gender === "male")} onClick={() => setGender("male")}>
              <img style={s.imgCircle} src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS87Gr4eFO7Pt2pE8oym4dxXnxGZYL2Pl_N5A&s" alt="Pria" />
              <div style={{ fontWeight: '600', color: gender === "male" ? '#0ea5e9' : '#64748b' }}>Laki-laki</div>
            </div>

            <div style={s.genderCard(gender === "female")} onClick={() => setGender("female")}>
              <img style={s.imgCircle} src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEDC16AsldgZpB00C0o0Fjo0_CNdh8l5NL5A&s" alt="Wanita" />
              <div style={{ fontWeight: '600', color: gender === "female" ? '#0ea5e9' : '#64748b' }}>Perempuan</div>
            </div>
          </div>

          <div style={s.inputGroup}>
            <input style={s.input} type="number" placeholder="Tinggi Badan (cm)" value={height} onChange={(e) => setHeight(e.target.value)} />
            <input style={s.input} type="number" placeholder="Berat Badan (kg)" value={weight} onChange={(e) => setWeight(e.target.value)} />
            <select style={s.input} value={stress} onChange={(e) => setStress(e.target.value)}>
              <option value="">Tingkat Aktivitas Harian</option>
              <option value="rendah">Jarang Olahraga</option>
              <option value="sedang">Olahraga Ringan (1-3 hari/minggu)</option>
              <option value="tinggi">Aktif (6-7 hari/minggu)</option>
            </select>
            <button style={s.button} onClick={handleCalculate}>Hitung BMI Sekarang</button>
          </div>

          {result && (
            <div style={s.resultCard(result.color)}>
              <h2 style={{ fontSize: '16px', color: '#64748b', margin: 0 }}>Skor BMI Kamu</h2>
              <h1 style={{ fontSize: '56px', color: result.color, margin: '10px 0' }}>{result.bmi}</h1>
              <p style={{ fontSize: '15px', color: '#1e293b', margin: 0 }}>
                Kondisi tubuh kamu saat ini: <strong style={{ color: result.color }}>{result.status}</strong>
              </p>
            </div>
          )}
        </div>

        {/* INFO RIGHT */}
        <div style={s.info}>
          <h3 style={{ color: '#1e293b', fontSize: '20px', fontWeight: '700' }}>Informasi BMI</h3>
          <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.6' }}>
            Body Mass Index (BMI) adalah cara praktis untuk menilai apakah berat badan Anda sehat dibandingkan tinggi badan Anda.
          </p>

          <div style={s.infoCard}>
            <img style={{ width: '40px' }} src="https://img.icons8.com/fluency/96/guarantee.png" alt="icon" />
            <span style={{ fontSize: '14px', color: '#475569', fontWeight: '500' }}>Standar medis akurat</span>
          </div>

          <div style={s.infoCard}>
            <img style={{ width: '40px' }} src="https://img.icons8.com/fluency/96/running.png" alt="icon" />
            <span style={{ fontSize: '14px', color: '#475569', fontWeight: '500' }}>Rekomendasi gaya hidup</span>
          </div>

          <div style={s.infoCard}>
            <img style={{ width: '40px' }} src="https://img.icons8.com/fluency/96/apple.png" alt="icon" />
            <span style={{ fontSize: '14px', color: '#475569', fontWeight: '500' }}>Pantau asupan nutrisi</span>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}