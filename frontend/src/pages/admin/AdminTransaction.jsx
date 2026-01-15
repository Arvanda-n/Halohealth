import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/sidebar'; // Pastikan path Sidebar benar
import { CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react';

export default function AdminTransaction() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    // 1. Fetch Data Transaksi (Semua User)
    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('http://127.0.0.1:8000/api/admin/transactions', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            // Urutkan dari yang terbaru (id desc)
            const sortedData = Array.isArray(data) ? data.sort((a, b) => b.id - a.id) : [];
            setTransactions(sortedData);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // 2. Fungsi Update Status
    const handleUpdateStatus = async (id, newStatus) => {
        const token = localStorage.getItem('token');
        if(!confirm(`Yakin ubah status jadi ${newStatus}?`)) return;

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/admin/transactions/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                alert("Status berhasil diperbarui!");
                fetchTransactions(); // Refresh data
            }
        } catch (err) {
            console.error("Gagal update:", err);
        }
    };

    // --- HELPER WARNA ---
    const getStatusColor = (status) => {
        switch(status) {
            case 'success': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'failed': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            {/* Sidebar Admin */}
            <Sidebar /> 

            <div className="flex-1 p-8 overflow-y-auto ml-64">
                <h1 className="text-2xl font-bold mb-6 text-slate-800">Verifikasi Pembayaran</h1>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b border-gray-200 text-slate-500 font-semibold uppercase tracking-wider">
                            <tr>
                                <th className="p-4">ID</th>
                                <th className="p-4">Pasien</th>
                                <th className="p-4">Dokter</th>
                                <th className="p-4">Total</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan="6" className="p-8 text-center"><Loader2 className="animate-spin inline"/> Memuat...</td></tr>
                            ) : transactions.map((trx) => (
                                <tr key={trx.id} className="hover:bg-slate-50 transition">
                                    <td className="p-4 font-mono text-xs text-slate-500">#HH-{trx.id}</td>
                                    <td className="p-4 font-bold text-slate-700">{trx.patient?.name}</td>
                                    <td className="p-4 text-slate-600">{trx.doctor?.name}</td>
                                    <td className="p-4 font-bold text-sky-600">Rp {parseInt(trx.amount).toLocaleString('id-ID')}</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(trx.status)}`}>
                                            {trx.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="p-4 flex gap-2">
                                        {/* Tombol Aksi hanya muncul kalau masih Pending */}
                                        {trx.status === 'pending' && (
                                            <>
                                                <button 
                                                    onClick={() => handleUpdateStatus(trx.id, 'success')}
                                                    className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-700 transition"
                                                >
                                                    <CheckCircle size={14} /> Terima
                                                </button>
                                                <button 
                                                    onClick={() => handleUpdateStatus(trx.id, 'failed')}
                                                    className="flex items-center gap-1 bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-200 transition"
                                                >
                                                    <XCircle size={14} /> Tolak
                                                </button>
                                            </>
                                        )}
                                        {trx.status === 'success' && <span className="text-xs text-green-600 font-bold flex items-center gap-1"><CheckCircle size={14}/> Lunas</span>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}