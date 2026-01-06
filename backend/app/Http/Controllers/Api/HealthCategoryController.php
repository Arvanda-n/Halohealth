<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HealthCategory; // ✅ WAJIB (INI YANG KURANG)
use Illuminate\Http\Request;

class HealthCategoryController extends Controller
{
    public function store(Request $request)
{
    $request->validate([
        'name' => 'required|string',
        'icon' => 'nullable|string'
    ]);

    $category = HealthCategory::create([
        'name' => $request->name,
        'icon' => $request->icon
    ]);

    return response()->json([
        'success' => true,
        'data' => $category
    ], 201);

    
}

public function index()
{
    return response()->json([
        'success' => true,
        'data' => HealthCategory::all()
    ]);
}

}
