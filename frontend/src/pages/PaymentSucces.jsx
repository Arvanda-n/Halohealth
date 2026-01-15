import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, MessageCircle, Home } from 'lucide-react';

export default function PaymentSuccess() {
    const navigate = useNavigate();
    const location = useLocation();
    const { doctorId, doctorName } = location.state || {}; // Ambil data dari halaman bayar sebelumnya

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-100 bg-white rounded-2xl shadow-xl p-8 text-center">
                <div className="flex justify-center mb-6">
                    <CheckCircle size={80} className="text-green-500 animate-bounce" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Pembayaran Berhasil!</h1>
                <p className="text-gray-600 mb-8">
                    Sesi konsultasi dengan <strong>{doctorName || 'Dokter'}</strong> telah aktif. Silakan mulai chat untuk berkonsultasi.
                </p>

                <div className="flex flex-col gap-3">
                    <button 
                        onClick={() => navigate(`/chat/${doctorId}`)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
                    >
                        <MessageCircle size={20} /> Mulai Chat Sekarang
                    </button>
                    
                    <button 
                        onClick={() => navigate('/')}
                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
                    >
                        <Home size={20} /> Kembali ke Beranda
                    </button>
                </div>
            </div>
        </div>
    );
}