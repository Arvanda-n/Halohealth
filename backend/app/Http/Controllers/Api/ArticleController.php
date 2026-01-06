<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class ArticleController extends Controller
{
    // 1. GET ALL (Lihat Semua Data)
    public function index()
    {
        $articles = Article::latest()->get();

        return response()->json([
            'success' => true,
            'message' => 'List Data Articles',
            'data'    => $articles
        ], 200);
    }

    // 2. POST (Simpan Data Baru)
    public function store(Request $request)
    {
        // Validasi input
        $validator = Validator::make($request->all(), [
            'title'     => 'required|string|max:255',
            'content'   => 'required',
            'category'  => 'required',
            'author'    => 'required',
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Upload Gambar
        $imagePath = null;
        if ($request->hasFile('thumbnail')) {
            $image = $request->file('thumbnail');
            $image->storeAs('public/articles', $image->hashName());
            // Simpan URL lengkapnya
            $imagePath = url('storage/articles/' . $image->hashName());
        }

        // Simpan ke Database
        $article = Article::create([
            'title'     => $request->title,
            'content'   => $request->content,
            'category'  => $request->category,
            'author'    => $request->author,
            'thumbnail' => $imagePath,
            'published_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Artikel Berhasil Disimpan!',
            'data'    => $article
        ], 201);
    }

    // 3. GET DETAIL (Lihat 1 Artikel)
    public function show($id)
    {
        $article = Article::find($id);

        if (!$article) {
            return response()->json([
                'success' => false,
                'message' => 'Artikel Tidak Ditemukan!',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Detail Data Article',
            'data'    => $article
        ], 200);
    }

    // 4. DELETE (Hapus Artikel)
    public function destroy($id)
    {
        $article = Article::find($id);

        if (!$article) {
            return response()->json(['message' => 'Artikel tidak ditemukan'], 404);
        }

        // Hapus file gambarnya juga biar gak nyampah (Opsional)
        if ($article->thumbnail) {
            // Ambil nama file dari URL
            $filename = basename($article->thumbnail);
            Storage::delete('public/articles/' . $filename);
        }

        $article->delete();

        return response()->json([
            'success' => true,
            'message' => 'Artikel Berhasil Dihapus!',
        ], 200);
    }
}