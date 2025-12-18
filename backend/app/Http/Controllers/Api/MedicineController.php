<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Medicine;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class MedicineController extends Controller
{
    // GET ALL
    public function index()
    {
        return response()->json(Medicine::all());
    }

    // CREATE (Hanya Admin)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'description' => 'required',
            'price' => 'required|integer',
            'stock' => 'required|integer',
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        $medicine = Medicine::create($validated); // <--- ERROR 500 TADI KARENA INI, TAPI SOLUSINYA DI MODEL

        return response()->json([
            'message' => 'Obat berhasil ditambahkan',
            'data' => $medicine
        ], 201);
    }

    // ... function show, update, destroy lainnya biarkan saja
}