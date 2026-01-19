<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\Medicine; // 🔥 [WAJIB] Jangan lupa baris ini! Kalau ga ada, dia bingung obat itu apa.
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB; 

class TransactionController extends Controller
{
    // 1. BUAT TRANSAKSI (User Beli)
    public function store(Request $request)
    {
        // Validasi
        $request->validate([
            'amount' => 'required|numeric',
            'type' => 'nullable|string',
            'items' => 'nullable|array', // Pastikan items array diterima
        ]);

        // Pakai DB Transaction biar aman (Kalau stok gagal kurang, transaksi batal)
        return DB::transaction(function () use ($request) {
            
            // A. Simpan Transaksi ke Tabel transactions
            $transaction = Transaction::create([
                'user_id' => Auth::id(),
                'doctor_id' => $request->doctor_id, // Bisa null
                'amount' => $request->amount,
                'payment_method' => $request->payment_method ?? 'gopay',
                'status' => 'success', // Langsung success biar gampang
                'type' => $request->type ?? 'consultation',
                'note' => $request->note,
            ]);

            // B. 🔥 LOGIKA PENGURANGAN STOK (INI KUNCINYA)
            // Cek: Apakah tipe transaksinya 'medicine'? Dan ada barangnya?
            if ($request->type === 'medicine' && !empty($request->items)) {
                
                foreach ($request->items as $item) {
                    // 1. Cari obat berdasarkan ID yang dikirim frontend
                    $medicine = Medicine::find($item['id']);
                    
                    // 2. Kalau obat ketemu, kurangi stoknya
                    if ($medicine) {
                        // Kurangi stok sebanyak quantity pembelian
                        $medicine->decrement('stock', $item['quantity']);
                    }
                }
            }

            return response()->json([
                'message' => 'Transaksi berhasil & Stok berkurang!',
                'data' => $transaction
            ], 201);
        });
    }

    // 2. Dashboard Admin & List Transaksi
    public function index()
    {
        $transactions = Transaction::with(['user', 'doctor', 'doctorData'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['data' => $transactions]);
    }

    // 3. History User
    public function history()
    {
        $transactions = Transaction::where('user_id', Auth::id())
            ->with(['doctor', 'doctorData']) 
            ->orderBy('created_at', 'desc') 
            ->get();

        return response()->json(['data' => $transactions]);
    }

    // 4. Update Status (Admin)
    public function update(Request $request, $id)
    {
        $transaction = Transaction::findOrFail($id);
        $transaction->update(['status' => $request->status]);
        return response()->json(['data' => $transaction]);
    }
}