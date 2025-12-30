<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Cart;
use Illuminate\Support\Facades\DB;

class CartController extends Controller
{
    // 1. LIHAT KERANJANG
    public function index(Request $request)
    {
        // Ambil keranjang milik user yang sedang login
        $carts = Cart::with('medicine') // Load data obatnya juga
            ->where('user_id', $request->user()->id)
            ->get();

        // Format data biar enak dibaca Frontend
        $formattedCarts = $carts->map(function ($cart) {
            return [
                'id' => $cart->id,
                'medicine_id' => $cart->medicine->id,
                'name' => $cart->medicine->name,
                'price' => $cart->medicine->price,
                'image' => $cart->medicine->image,
                'category' => $cart->medicine->category,
                'quantity' => $cart->quantity,
            ];
        });

        return response()->json($formattedCarts);
    }

    // 2. TAMBAH KE KERANJANG
    public function store(Request $request)
    {
        $request->validate([
            'medicine_id' => 'required|exists:medicines,id',
        ]);

        $userId = $request->user()->id;
        $medicineId = $request->medicine_id;

        // Cek apakah obat ini udah ada di keranjang user?
        $existingCart = Cart::where('user_id', $userId)
                            ->where('medicine_id', $medicineId)
                            ->first();

        if ($existingCart) {
            // Kalau udah ada, tambah qty-nya aja
            $existingCart->increment('quantity');
        } else {
            // Kalau belum, bikin baru
            Cart::create([
                'user_id' => $userId,
                'medicine_id' => $medicineId,
                'quantity' => 1
            ]);
        }

        return response()->json(['message' => 'Berhasil masuk keranjang!']);
    }

    // 3. UPDATE JUMLAH (Tambah/Kurang)
    public function update(Request $request, $id)
    {
        $cart = Cart::where('user_id', $request->user()->id)->findOrFail($id);
        
        $cart->update([
            'quantity' => $request->quantity
        ]);

        return response()->json(['message' => 'Jumlah diupdate']);
    }

    // 4. HAPUS DARI KERANJANG
    public function destroy(Request $request, $id)
    {
        $cart = Cart::where('user_id', $request->user()->id)->findOrFail($id);
        $cart->delete();

        return response()->json(['message' => 'Dihapus dari keranjang']);
    }
}