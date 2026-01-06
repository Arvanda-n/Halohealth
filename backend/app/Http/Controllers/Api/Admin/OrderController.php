<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index()
    {
        // Ambil data order + nama user-nya, urutkan dari yang terbaru
        $orders = Order::with('user')->latest()->get();

        return response()->json([
            'success' => true,
            'data' => $orders
        ]);
    }

    // Fitur Update Status (Biar admin bisa ganti status jadi 'completed')
    public function update(Request $request, $id)
    {
        $order = Order::find($id);
        if($order) {
            $order->update(['status' => $request->status]);
            return response()->json(['success' => true, 'message' => 'Status updated']);
        }
        return response()->json(['success' => false, 'message' => 'Order not found'], 404);
    }
}