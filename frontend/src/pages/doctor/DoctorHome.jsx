import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header";
import Footer from "../../components/Footer";
import { MessageCircle, Users, Calendar, FileText, Star } from "lucide-react";

export default function DoctorHome() {
  const navigate = useNavigate();
  const mainBlue = "#0ea5e9";

  const [stats, setStats] = useState({
    todayConsultation: 0,
    activePatients: 0,
    schedules: 0,
    rating: 0,
  });

  useEffect(() => {
    // SIMULASI DATA (nanti ganti API Laravel)
    setStats({
      todayConsultation: 8,
      activePatients: 34,
      schedules: 5,
      rating: 4.8,
    });
  }, []);

  const menus = [
    { title: "Chat Konsultasi", desc: "Pasien aktif", icon: MessageCircle, link: "/doctor/chats" },
    { title: "Jadwal Praktik", desc: "Atur jam praktik", icon: Calendar, link: "/doctor/schedule" },
    { title: "Daftar Pasien", desc: "Riwayat pasien", icon: Users, link: "/doctor/patients" },
    { title: "Rekam Medis", desc: "Catatan kesehatan", icon: FileText, link: "/doctor/medical-records" },
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />

      <div style={{ maxWidth: "1300px", margin: "0 auto", padding: "30px 20px", flex: 1 }}>

        {/* HEADER */}
        <section style={{ marginBottom: "40px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#1e293b" }}>
            Dashboard Dokter 👨‍⚕️
          </h2>
          <p style={{ color: "#64748b" }}>
            Kelola konsultasi, pasien, dan jadwal praktik Anda
          </p>
        </section>

        {/* STATISTIC */}
        <section style={{ marginBottom: "50px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
            {[
              { label: "Konsultasi Hari Ini", value: stats.todayConsultation },
              { label: "Pasien Aktif", value: stats.activePatients },
              { label: "Jadwal Praktik", value: stats.schedules },
              { label: "Rating", value: stats.rating, icon: Star },
            ].map((item, i) => (
              <div key={i}
                style={{
                  background: "white",
                  padding: "25px",
                  borderRadius: "14px",
                  border: "1px solid #e2e8f0",
                }}
              >
                <p style={{ fontSize: "13px", color: "#64748b" }}>{item.label}</p>
                <h3 style={{ fontSize: "26px", marginTop: "10px", color: mainBlue }}>
                  {item.value}
                </h3>
              </div>
            ))}
          </div>
        </section>

        {/* MENU */}
        <section style={{ marginBottom: "60px" }}>
          <h3 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "20px" }}>
            Menu Dokter
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px" }}>
            {menus.map((menu, i) => {
              const Icon = menu.icon;
              return (
                <div
                  key={i}
                  onClick={() => navigate(menu.link)}
                  style={{
                    cursor: "pointer",
                    padding: "25px",
                    borderRadius: "14px",
                    background: "white",
                    border: "1px solid #e2e8f0",
                    display: "flex",
                    alignItems: "center",
                    gap: "20px",
                    transition: "0.3s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.boxShadow =
                      "0 10px 25px rgba(14,165,233,0.15)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.boxShadow = "none")
                  }
                >
                  <div
                    style={{
                      width: "55px",
                      height: "55px",
                      borderRadius: "12px",
                      background: "#e0f2fe",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon color={mainBlue} />
                  </div>

                  <div>
                    <h4 style={{ margin: 0, fontWeight: "bold" }}>{menu.title}</h4>
                    <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>
                      {menu.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* INFO */}
        <section>
          <div
            style={{
              background: "#f0f9ff",
              padding: "30px",
              borderRadius: "16px",
              borderLeft: `6px solid ${mainBlue}`,
            }}
          >
            <h3 style={{ margin: 0, color: "#0369a1" }}>
              Pelayanan Profesional & Aman
            </h3>
            <p style={{ marginTop: "8px", color: "#334155", fontSize: "14px" }}>
              Seluruh aktivitas konsultasi tercatat dan terintegrasi dengan sistem HaloHealth.
            </p>
          </div>
        </section>

      </div>

      <Footer />
    </div>
  );
}
