<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
{
    $categories = Category::with('doctors')->get();
    return response()->json($categories);
}

public function show($id)
{
    $category = Category::with('doctors')->findOrFail($id);
    return response()->json($category);
}

}
