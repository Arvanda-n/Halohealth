<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TransactionController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric',
            'doctor_id' => 'nullable', 
            'type' => 'nullable|string',
            'note' => 'nullable|string',
            'status' => 'nullable|string'
        ]);

        $transaction = Transaction::create([
            'user_id' => Auth::id(),
            'doctor_id' => $request->doctor_id,
            'amount' => $request->amount,
            'payment_method' => $request->payment_method ?? 'gopay',
            'status' => $request->status ?? 'pending',
            'type' => $request->type ?? 'consultation',
            'note' => $request->note, 
        ]);

        return response()->json([
            'message' => 'Transaksi berhasil dibuat',
            'data' => $transaction
        ], 201);
    }

    // Admin Lihat Semua
    public function index()
    {
        // 🔥 Tambahkan 'doctorData' di with()
        $transactions = Transaction::with(['user', 'doctor', 'doctorData'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['data' => $transactions]);
    }

    // User Lihat History
    public function history()
    {
        // 🔥 Tambahkan 'doctorData' di with() biar fotonya kebawa
        $transactions = Transaction::where('user_id', Auth::id())
            ->with(['doctor', 'doctorData']) 
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['data' => $transactions]);
    }

    public function update(Request $request, $id)
    {
        $request->validate(['status' => 'required']);
        $transaction = Transaction::findOrFail($id);
        $transaction->update(['status' => $request->status]);
        return response()->json(['data' => $transaction]);
    }
}