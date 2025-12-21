<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Transaction;

class TransactionController extends Controller
{
    // List transaksi user login
    public function index(Request $request)
    {
        return response()->json(
            Transaction::where('user_nid', $request->user()->id)->get()
        );
    }

    // Buat transaksi
    public function store(Request $request)
    {
        $request->validate([
            'type' => 'required|string',
            'item_id' => 'required|integer',
            'total_price' => 'required|numeric|min:1000'
        ]);

        $transaction = Transaction::create([
            'user_nid' => $request->user()->id,
            'type' => $request->type,
            'item_id' => $request->item_id,
            'total_price' => $request->total_price,
            'status' => 'pending'
        ]);

        return response()->json([
            'message' => 'Transaction created',
            'data' => $transaction
        ], 201);
    }
}
