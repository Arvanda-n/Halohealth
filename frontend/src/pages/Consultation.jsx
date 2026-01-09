import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/header';
import Footer from '../components/Footer';
import { MessageSquare, User, Clock, CheckCircle, ArrowRight, Loader2 } from 'lucide-react';

export default function Consultation() {
    const [consultations, setConsultations] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchMyConsultations();
    }, []);

    const fetchMyConsultations = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://127.0.0.1:8000/api/consultations', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            
            // Backend mengirim data konsultasi sesuai role user yang login
            setConsultations(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Gagal load konsultasi:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />
            
            <div className="flex-1 container mx-auto max-w-4xl p-6 mt-24 mb-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Konsultasi Saya</h1>
                        <p className="text-gray-500 mt-1">Pantau jawaban dokter dan riwayat kesehatan Anda.</p>
                    </div>
                    <button 
                        onClick={() => navigate('/doctors')}
                        className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-200"
                    >
                        <MessageSquare size={20} /> Tanya Dokter
                    </button>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-blue-500">
                        <Loader2 className="animate-spin mb-2" size={40} />
                        <p className="font-medium">Memuat history konsultasi...</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {consultations.length > 0 ? consultations.map((item) => (
                            <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:border-blue-300 transition-all">
                                {/* Header Card */}
                                <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-white">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                            <User size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-800 text-lg">
                                                {/* Mengambil nama dokter dari relasi */}
                                                {item.doctor?.user?.name || 'Dokter Spesialis'}
                                            </h3>
                                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                                <Clock size={14} />
                                                <span>{new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
                                        item.status === 'answered' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
                                    }`}>
                                        {/* Status berasal dari kolom status di database */}
                                        {item.status === 'answered' ? 'Sudah Dijawab' : 'Menunggu'}
                                    </span>
                                </div>

                                {/* Content Card */}
                                <div className="p-6 space-y-4">
                                    <div className="bg-gray-50 rounded-2xl p-5">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Pertanyaan Anda</p>
                                        <p className="text-gray-700 leading-relaxed font-medium">{item.question}</p>
                                    </div>

                                    {item.answer ? (
                                        <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100 relative">
                                            <div className="absolute -top-3 left-6 bg-blue-600 text-white p-1 rounded-full shadow-md">
                                                <CheckCircle size={14} />
                                            </div>
                                            <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2">Jawaban Dokter</p>
                                            <p className="text-gray-800 leading-relaxed">{item.answer}</p>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-amber-500 px-2 text-sm italic font-medium">
                                            <Clock size={16} />
                                            <span>Dokter akan segera menjawab pertanyaan Anda...</span>
                                        </div>
                                    )}
                                </div>

                                {/* Footer Card (Optional Chat Bridge) */}
                                {item.status === 'answered' && (
                                    <div className="px-6 py-4 bg-gray-50 flex justify-end border-t border-gray-100">
                                        <button 
                                            onClick={() => navigate(`/chat/${item.doctor?.user_id}`)}
                                            className="text-blue-600 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all"
                                        >
                                            Lanjut Chat dengan Dokter <ArrowRight size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        )) : (
                            <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                                <MessageSquare size={48} className="mx-auto text-gray-300 mb-4" />
                                <h3 className="text-lg font-bold text-gray-400">Belum Ada Konsultasi</h3>
                                <p className="text-gray-400 text-sm mt-1">Riwayat tanya jawab Anda akan muncul di sini.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
            
            <Footer />
        </div>
    );
}