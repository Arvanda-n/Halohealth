import { useState } from "react";
import Header from "../components/header";
import Footer from "../components/Footer";

export default function CekStress() {
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [stressAnswer, setStressAnswer] = useState("");
  const [result, setResult] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    let score = 0;
    if (stressAnswer === "sering") score = 3;
    if (stressAnswer === "cukup") score = 2;
    if (stressAnswer === "tidak") score = 1;

    let level = "";
    let description = "";

    if (score === 3) {
      level = "Tinggi";
      description =
        "Kamu mengalami tingkat stres tinggi. Disarankan untuk beristirahat, mengurangi beban pikiran, dan berkonsultasi dengan profesional.";
    } else if (score === 2) {
      level = "Sedang";
      description =
        "Tingkat stres kamu berada di level sedang. Coba atur waktu istirahat dan lakukan aktivitas yang menyenangkan.";
    } else {
      level = "Rendah";
      description =
        "Tingkat stres kamu rendah. Pertahankan pola hidup sehat dan manajemen stres yang baik.";
    }

    setResult({ level, description });
  };

  return (
    <>
      <Header />

      <div className="cekstress-container">
        <h1 className="cekstress-title">Cek Tingkat Stres</h1>
        <p className="cekstress-subtitle">
          Jawab pertanyaan berikut untuk mengetahui kondisi stres kamu
        </p>

        {!result ? (
          <form className="cekstress-card" onSubmit={handleSubmit}>
            {/* Jenis Kelamin */}
            <div className="form-group">
              <label>Jenis Kelamin</label>
              <select value={gender} onChange={(e) => setGender(e.target.value)} required>
                <option value="">Pilih</option>
                <option value="pria">Pria</option>
                <option value="wanita">Wanita</option>
              </select>
            </div>

            {/* Usia */}
            <div className="form-group">
              <label>Usia</label>
              <input
                type="number"
                placeholder="Masukkan usia"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
              />
            </div>

            {/* Pertanyaan Stres */}
            <div className="form-group">
              <label>Seberapa sering kamu merasa gelisah atau stres?</label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    value="sering"
                    checked={stressAnswer === "sering"}
                    onChange={(e) => setStressAnswer(e.target.value)}
                    required
                  />
                  Sering
                </label>
                <label>
                  <input
                    type="radio"
                    value="cukup"
                    checked={stressAnswer === "cukup"}
                    onChange={(e) => setStressAnswer(e.target.value)}
                  />
                  Cukup Banyak
                </label>
                <label>
                  <input
                    type="radio"
                    value="tidak"
                    checked={stressAnswer === "tidak"}
                    onChange={(e) => setStressAnswer(e.target.value)}
                  />
                  Tidak
                </label>
              </div>
            </div>

            <button className="btn-submit">Lihat Hasil</button>
          </form>
        ) : (
          <div className={`result-card ${result.level.toLowerCase()}`}>
            <h2>Tingkat Stres Kamu</h2>
            <h1 className="stress-level">{result.level}</h1>
            <p>{result.description}</p>

            <button
              className="btn-reset"
              onClick={() => setResult(null)}
            >
              Cek Ulang
            </button>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
