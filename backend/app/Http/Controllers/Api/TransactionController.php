<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    // Pasien membuat transaksi
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
            'status' => 'pending'
        ]);

        return response()->json($transaction, 201);
    }

    // Admin lihat semua transaksi
    public function index()
    {
        return Transaction::with(['patient', 'doctor'])->get();
    }
}

