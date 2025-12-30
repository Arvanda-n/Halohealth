<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Medicine; // <--- Pastikan ini ada
use Illuminate\Http\Request;
use Illuminate\Support\Str; // <--- Pastikan ini ada

class MedicineController extends Controller
{
    // 1. GET ALL (Lihat Semua)
    public function index()
{
    $medicines = Medicine::all();

    // Format data biar cocok sama Frontend React (sub_category jadi sub)
    $formatted = $medicines->map(function($item) {
        return [
            'id' => $item->id,
            'name' => $item->name,
            'slug' => $item->slug,
            'price' => $item->price,
            'stock' => $item->stock,
            'category' => $item->category,
            'sub' => $item->sub_category, // <--- INI KUNCINYA BIAR FE GAK ERROR
            'image' => $item->image,
            'description' => $item->description
        ];
    });

    return response()->json($formatted);
}
    // 2. CREATE (Tambah)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'description' => 'required',
            'price' => 'required|integer',
            'stock' => 'required|integer',
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        $medicine = Medicine::create($validated);

        return response()->json([
            'message' => 'Obat berhasil ditambahkan',
            'data' => $medicine
        ], 201);
    }

    // 3. SHOW (Lihat Satu)
    public function show($id)
    {
        $medicine = Medicine::find($id);
        if (!$medicine) {
            return response()->json(['message' => 'Obat tidak ditemukan'], 404);
        }
        return response()->json($medicine);
    }

    // 4. UPDATE (Edit)
    public function update(Request $request, $id)
    {
        $medicine = Medicine::find($id);
        
        if (!$medicine) {
            return response()->json(['message' => 'Obat tidak ditemukan'], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string',
            'description' => 'sometimes',
            'price' => 'sometimes|integer',
            'stock' => 'sometimes|integer',
        ]);

        if ($request->has('name')) {
            $validated['slug'] = Str::slug($request->name);
        }

        $medicine->update($validated);

        return response()->json([
            'message' => 'Obat berhasil diupdate',
            'data' => $medicine
        ]);
    }

    // 5. DESTROY (Hapus)
    public function destroy($id)
    {
        $medicine = Medicine::find($id);
        
        if (!$medicine) {
            return response()->json(['message' => 'Obat tidak ditemukan'], 404);
        }

        $medicine->delete();
        
        return response()->json(['message' => 'Obat berhasil dihapus']);
    }
}