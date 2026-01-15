<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    // 1. Pasien membuat transaksi (Checkout)
    public function store(Request $request)
    {
        $request->validate([
            'doctor_id' => 'required|exists:users,id',
            'amount' => 'required|numeric'
        ]);

        $transaction = Transaction::create([
            'patient_id' => auth()->id(),
            'doctor_id' => $request->doctor_id,
            'amount' => $request->amount,
            
            // 🔥 REVISI PENTING:
            // Ubah jadi 'pending' biar tombol chat terkunci dulu sebelum diapprove Admin
            'status' => 'pending' 
        ]);

        return response()->json($transaction, 201);
    }

    // 2. Admin lihat semua transaksi
    public function index()
    {
        // Ditambah orderBy desc biar transaksi terbaru muncul paling atas
        return Transaction::with(['patient', 'doctor'])
            ->orderBy('created_at', 'desc')
            ->get();
    }

    // 3. History Transaksi per User (Profil Pasien)
    public function history()
    {
        $transactions = Transaction::where('patient_id', auth()->id())
            ->with(['doctor']) 
            ->orderBy('created_at', 'desc') 
            ->get();

        return response()->json($transactions);
    }

    // 🔥 4. FITUR BARU: Update Status Transaksi (Dipakai Admin)
    public function update(Request $request, $id)
    {
        // Validasi input status
        $request->validate([
            'status' => 'required|in:pending,success,failed,completed'
        ]);

        // Cari transaksi, kalau gak ada error 404
        $transaction = Transaction::findOrFail($id);

        // Update statusnya
        $transaction->update([
            'status' => $request->status
        ]);

        return response()->json([
            'message' => 'Status transaksi berhasil diperbarui',
            'data' => $transaction
        ]);
    }
}