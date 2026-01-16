import { useState } from "react";
import { Smile, Frown, Meh } from "lucide-react";

export default function TesDepresi() {
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [stress, setStress] = useState("");
  const [muram, setMuram] = useState("");
  const [nafsu, setNafsu] = useState("");
  const [result, setResult] = useState(null);

  const hitungTes = () => {
    let score = 0;

    if (stress === "tinggi") score += 2;
    if (stress === "sedang") score += 1;
    if (muram === "ya") score += 2;
    if (nafsu === "ya") score += 2;

    if (score <= 2) {
      setResult("aman");
    } else if (score <= 4) {
      setResult("cukup");
    } else {
      setResult("tidak");
    }
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "40px",
        padding: "40px",
        minHeight: "100vh",
        background: "#f8fafc",
      }}
    >
      {/* FORM TES */}
      <div
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "16px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>Tes Depresi Mandiri</h2>

        {/* GENDER */}
        <p>Jenis Kelamin</p>
        <div style={{ display: "flex", gap: "15px", marginBottom: "15px" }}>
          <button
            onClick={() => setGender("laki")}
            style={{
              flex: 1,
              padding: "15px",
              borderRadius: "12px",
              border: gender === "laki" ? "2px solid #22c55e" : "1px solid #ddd",
              background: "#f0fdf4",
              cursor: "pointer",
            }}
          >
            👨 Laki-laki
          </button>
          <button
            onClick={() => setGender("perempuan")}
            style={{
              flex: 1,
              padding: "15px",
              borderRadius: "12px",
              border:
                gender === "perempuan"
                  ? "2px solid #22c55e"
                  : "1px solid #ddd",
              background: "#f0fdf4",
              cursor: "pointer",
            }}
          >
            👩 Perempuan
          </button>
        </div>

        {/* TINGGI & BERAT */}
        <input
          placeholder="Tinggi badan (cm)"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          style={inputStyle}
        />
        <input
          placeholder="Berat badan (kg)"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          style={inputStyle}
        />

        {/* STRESS */}
        <select style={inputStyle} onChange={(e) => setStress(e.target.value)}>
          <option value="">Tingkat stres</option>
          <option value="rendah">Rendah</option>
          <option value="sedang">Sedang</option>
          <option value="tinggi">Tinggi</option>
        </select>

        {/* PERTANYAAN */}
        <select style={inputStyle} onChange={(e) => setMuram(e.target.value)}>
          <option value="">Sering merasa muram & sedih?</option>
          <option value="ya">Ya</option>
          <option value="tidak">Tidak</option>
        </select>

        <select style={inputStyle} onChange={(e) => setNafsu(e.target.value)}>
          <option value="">Tidak nafsu makan?</option>
          <option value="ya">Ya</option>
          <option value="tidak">Tidak</option>
        </select>

        <button
          onClick={hitungTes}
          style={{
            width: "100%",
            padding: "14px",
            background: "#22c55e",
            border: "none",
            borderRadius: "12px",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Lihat Hasil
        </button>

        {/* HASIL */}
        {result && (
          <div
            style={{
              marginTop: "25px",
              padding: "20px",
              borderRadius: "14px",
              textAlign: "center",
              animation: "pop 0.4s ease",
              background:
                result === "aman"
                  ? "#dcfce7"
                  : result === "cukup"
                  ? "#fef9c3"
                  : "#fee2e2",
            }}
          >
            {result === "aman" && (
              <>
                <Smile size={40} color="#16a34a" />
                <h3>Aman 🎉</h3>
                <p>Kondisi mental kamu tergolong stabil dan sehat</p>
              </>
            )}

            {result === "cukup" && (
              <>
                <Meh size={40} color="#ca8a04" />
                <h3>Cukup Aman 🙂</h3>
                <p>Perlu lebih memperhatikan kesehatan mental</p>
              </>
            )}

            {result === "tidak" && (
              <>
                <Frown size={40} color="#dc2626" />
                <h3>Tidak Aman 😔</h3>
                <p>Sebaiknya konsultasi dengan tenaga profesional</p>
              </>
            )}
          </div>
        )}
      </div>

      {/* PENJELASAN */}
      <div>
        <h2>Tentang Tes Depresi</h2>
        <p style={{ color: "#64748b", marginBottom: "20px" }}>
          Tes ini membantu mengenali kondisi emosional secara mandiri dengan
          pendekatan ringan dan ramah.
        </p>

        <div style={{ display: "grid", gap: "20px" }}>
          {[
            "😊 Membantu memahami perasaan",
            "🌈 Mendorong kesadaran diri",
            "💙 Menjadi langkah awal menjaga mental",
          ].map((text, i) => (
            <div
              key={i}
              style={{
                background: "white",
                padding: "20px",
                borderRadius: "14px",
                boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
                transition: "transform 0.3s",
              }}
              className="hover-card"
            >
              {text}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pop {
          from { transform: scale(0.9); opacity: 0 }
          to { transform: scale(1); opacity: 1 }
        }
        .hover-card:hover {
          transform: translateY(-6px) scale(1.03);
        }
      `}</style>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "15px",
  borderRadius: "10px",
  border: "1px solid #ddd",
};
