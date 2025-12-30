import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ background: '#0f172a', color: 'white', padding: '60px 0 20px', fontFamily: '"Inter", sans-serif' }}>
      
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr', gap: '40px' }}>
        
        {/* KOLOM 1: BRANDING */}
        <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                {/* Pakai logo-only.png + text-only.png atau Teks biasa */}
                <img src="/images/logo-only.png" alt="Logo" style={{ height: '50px' }} />
                <span style={{ fontSize: '24px', fontWeight: 'bold', letterSpacing: '-0.5px' }}>HaloHealth</span>
            </div>
            <p style={{ color: '#94a3b8', lineHeight: '1.6', fontSize: '14px', maxWidth: '300px' }}>
                Solusi kesehatan terpercaya dalam genggaman Anda. Konsultasi dokter, beli obat, dan update info kesehatan kapan saja, di mana saja.
            </p>
            <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                <SocialIcon icon={<Instagram size={20} />} />
                <SocialIcon icon={<Twitter size={20} />} />
                <SocialIcon icon={<Facebook size={20} />} />
            </div>
        </div>

        {/* KOLOM 2: LINK CEPAT */}
        <div>
            <h4 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '20px', color: '#f8fafc' }}>Menu Utama</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <FooterLink href="/" text="Beranda" />
                <FooterLink href="/doctors" text="Cari Dokter" />
                <FooterLink href="/medicines" text="Toko Obat" />
                <FooterLink href="/articles" text="Artikel Kesehatan" />
            </ul>
        </div>

        {/* KOLOM 3: BANTUAN */}
        <div>
            <h4 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '20px', color: '#f8fafc' }}>Layanan</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <FooterLink href="#" text="Tentang Kami" />
                <FooterLink href="#" text="Kebijakan Privasi" />
                <FooterLink href="#" text="Syarat & Ketentuan" />
                <FooterLink href="#" text="Karir Dokter" />
            </ul>
        </div>

        {/* KOLOM 4: KONTAK */}
        <div>
            <h4 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '20px', color: '#f8fafc' }}>Hubungi Kami</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <ContactItem icon={<Mail size={18} />} text="help@halohealth.id" />
                <ContactItem icon={<Phone size={18} />} text="+62 812-3456-7890" />
                <ContactItem icon={<MapPin size={18} />} text="Jl. Sehat Selalu No. 99, Jakarta Selatan, Indonesia" />
            </div>
        </div>

      </div>

      <div style={{ maxWidth: '1200px', margin: '50px auto 0', padding: '20px 20px 0', borderTop: '1px solid #1e293b', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
        &copy; {new Date().getFullYear()} HaloHealth Indonesia. All rights reserved.
      </div>
    </footer>
  );
}

// KOMPONEN KECIL BIAR RAPI
function FooterLink({ href, text }) {
    return (
        <li>
            <a href={href} style={{ textDecoration: 'none', color: '#94a3b8', fontSize: '14px', transition: '0.2s' }} 
               onMouseOver={(e) => e.target.style.color = '#0ea5e9'}
               onMouseOut={(e) => e.target.style.color = '#94a3b8'}>
                {text}
            </a>
        </li>
    );
}

function ContactItem({ icon, text }) {
    return (
        <div style={{ display: 'flex', gap: '12px', alignItems: 'start', color: '#94a3b8', fontSize: '14px' }}>
            <span style={{ color: '#0ea5e9' }}>{icon}</span>
            <span style={{ lineHeight: '1.5' }}>{text}</span>
        </div>
    );
}

function SocialIcon({ icon }) {
    return (
        <div style={{ 
            width: '36px', height: '36px', background: '#1e293b', borderRadius: '50%', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            transition: '0.2s', color: 'white'
        }}
        onMouseOver={(e) => e.currentTarget.style.background = '#0ea5e9'}
        onMouseOut={(e) => e.currentTarget.style.background = '#1e293b'}
        >
            {icon}
        </div>
    );
}