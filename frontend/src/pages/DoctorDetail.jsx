import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../App.css'; 

const DoctorDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [doctor, setDoctor] = useState(null);

    useEffect(() => {
        const fetchDoctor = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/doctors/${id}`);
                const data = await response.json();
                setDoctor(data);
            } catch (error) {
                console.error("Gagal ambil data dokter:", error);
            }
        };
        fetchDoctor();
    }, [id]);

    if (!doctor) return <div className="flex items-center justify-center h-screen text-blue-600 font-bold">Mengambil Data...</div>;

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 md:p-10 font-sans text-gray-800">
            
            {/* Tombol Back */}
            <div className="max-w-6xl mx-auto mb-6">
                <button 
                    onClick={() => navigate(-1)} 
                    className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition font-medium px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md"
                >
                    <img src="https://unpkg.com/lucide-static@latest/icons/arrow-left.svg" className="w-5 h-5" alt="back" />
                    Kembali ke List
                </button>
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* KOLOM KIRI: KARTU PROFIL (Sticky) */}
                <div className="md:col-span-1">
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 sticky top-10">
                        {/* Header Gradient */}
                        <div className="h-32 bg-gradient-to-r from-blue-500 to-cyan-400"></div>
                        
                        <div className="px-6 pb-8 relative">
                            {/* Foto Profil */}
                            <div className="relative -mt-16 mb-4 flex justify-center">
                                <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-gray-200 overflow-hidden">
                                    <img 
                                        src={doctor.photo} 
                                        alt={doctor.name} 
                                        className="w-full h-full object-cover"
                                        onError={(e) => {e.target.src = "https://cdn-icons-png.flaticon.com/512/3774/3774299.png"}}
                                    />
                                </div>
                                <div className="absolute bottom-2 right-[30%] bg-green-500 w-5 h-5 border-4 border-white rounded-full" title="Online"></div>
                            </div>

                            <div className="text-center">
                                <h1 className="text-xl font-bold text-gray-900">{doctor.name}</h1>
                                <p className="text-blue-600 font-medium mt-1">{doctor.specialization}</p>
                                
                                {/* Rating Stars Dummy */}
                                <div className="flex justify-center items-center gap-1 mt-3">
                                    {[1,2,3,4,5].map(i => (
                                        <img key={i} src="https://unpkg.com/lucide-static@latest/icons/star.svg" className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    ))}
                                    <span className="text-sm text-gray-400 ml-2">(4.9/5)</span>
                                </div>
                            </div>

                            <hr className="my-6 border-gray-100" />

                            <div className="flex justify-between items-center mb-6">
                                <span className="text-gray-500 text-sm">Biaya Konsultasi</span>
                                <span className="text-xl font-bold text-gray-900">Rp {doctor.consultation_fee.toLocaleString('id-ID')}</span>
                            </div>

                            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition flex items-center justify-center gap-2 mb-3">
                                <img src="https://unpkg.com/lucide-static@latest/icons/message-square.svg" className="w-5 h-5 brightness-0 invert" />
                                Chat Dokter
                            </button>
                            
                            <button className="w-full bg-white border-2 border-gray-200 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-50 transition">
                                Buat Janji RS
                            </button>
                        </div>
                    </div>
                </div>

                {/* KOLOM KANAN: DETAIL INFO */}
                <div className="md:col-span-2 space-y-6">
                    
                    {/* STATISTIK GRID */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center hover:border-blue-200 transition">
                            <div className="bg-blue-50 p-3 rounded-full mb-2 text-blue-600">
                                <img src="https://unpkg.com/lucide-static@latest/icons/users.svg" className="w-6 h-6" />
                            </div>
                            <span className="text-2xl font-bold text-gray-900">500+</span>
                            <span className="text-xs text-gray-500 uppercase tracking-wide mt-1">Pasien</span>
                        </div>
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center hover:border-blue-200 transition">
                            <div className="bg-purple-50 p-3 rounded-full mb-2 text-purple-600">
                                <img src="https://unpkg.com/lucide-static@latest/icons/briefcase.svg" className="w-6 h-6" />
                            </div>
                            <span className="text-2xl font-bold text-gray-900">{doctor.experience_years} Thn</span>
                            <span className="text-xs text-gray-500 uppercase tracking-wide mt-1">Pengalaman</span>
                        </div>
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center hover:border-blue-200 transition">
                            <div className="bg-green-50 p-3 rounded-full mb-2 text-green-600">
                                <img src="https://unpkg.com/lucide-static@latest/icons/award.svg" className="w-6 h-6" />
                            </div>
                            <span className="text-2xl font-bold text-gray-900">4.9</span>
                            <span className="text-xs text-gray-500 uppercase tracking-wide mt-1">Rating</span>
                        </div>
                    </div>

                    {/* TENTANG DOKTER */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-4">
                            <img src="https://unpkg.com/lucide-static@latest/icons/user.svg" className="w-6 h-6 text-blue-600" />
                            <h3 className="text-xl font-bold text-gray-900">Tentang Dokter</h3>
                        </div>
                        <p className="text-gray-600 leading-relaxed">
                            {doctor.name} adalah seorang spesialis {doctor.specialization} yang berdedikasi tinggi. 
                            Beliau memiliki pengalaman lebih dari {doctor.experience_years} tahun dalam menangani berbagai kasus kesehatan.
                            Dikenal ramah dan solutif, beliau siap membantu Anda mendapatkan diagnosa dan penanganan yang tepat.
                        </p>

                        <div className="mt-6">
                            <h4 className="font-bold text-gray-900 mb-3">Jadwal Praktik</h4>
                            <div className="flex gap-2 flex-wrap">
                                {['Senin 09:00 - 15:00', 'Rabu 13:00 - 18:00', 'Jumat 08:00 - 11:00'].map((schedule, idx) => (
                                    <span key={idx} className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-600">
                                        {schedule}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIWAYAT PENDIDIKAN (DUMMY) */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-6">
                            <img src="https://unpkg.com/lucide-static@latest/icons/graduation-cap.svg" className="w-6 h-6 text-blue-600" />
                            <h3 className="text-xl font-bold text-gray-900">Riwayat Pendidikan</h3>
                        </div>
                        
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 font-bold shrink-0">S1</div>
                                <div>
                                    <h4 className="font-bold text-gray-900">Kedokteran Umum</h4>
                                    <p className="text-gray-500 text-sm">Universitas Indonesia, Jakarta</p>
                                    <p className="text-gray-400 text-xs mt-1">Lulus Tahun 2015</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-bold shrink-0">Sp</div>
                                <div>
                                    <h4 className="font-bold text-gray-900">Spesialis {doctor.specialization}</h4>
                                    <p className="text-gray-500 text-sm">Universitas Gadjah Mada, Yogyakarta</p>
                                    <p className="text-gray-400 text-xs mt-1">Lulus Tahun 2019</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default DoctorDetail;