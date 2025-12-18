<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;

class ArticleController extends Controller
{
    // LIST ALL ARTICLES
    public function index()
    {
        return response()->json([
            'status' => true,
            'data' => Article::all()
        ]);
    }

    // CREATE ARTICLE
    public function store(Request $request)
    {
        $request->validate([
            'title'     => 'required',
            'content'   => 'required',
            'category'  => 'required|in:obat,penyakit', // dua kategori
            'thumbnail' => 'nullable|image'
        ]);

        $thumbnail = null;

        if ($request->hasFile('thumbnail')) {
            $thumbnail = $request->file('thumbnail')->store('thumbnails', 'public');
        }

        $article = Article::create([
            'title'     => $request->title,
            'content'   => $request->content,
            'category'  => $request->category,
            'thumbnail' => $thumbnail
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Artikel berhasil dibuat',
            'data' => $article
        ], 201);
    }

    // DETAIL ARTICLE
    public function show($id)
    {
        $article = Article::find($id);

        if (!$article) {
            return response()->json([
                'status' => false,
                'message' => 'Artikel tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'status' => true,
            'data' => $article
        ]);
    }

    // UPDATE ARTICLE
    public function update(Request $request, $id)
    {
        $article = Article::find($id);

        if (!$article) {
            return response()->json([
                'status' => false,
                'message' => 'Artikel tidak ditemukan'
            ], 404);
        }

        $thumbnail = $article->thumbnail;

        if ($request->hasFile('thumbnail')) {
            $thumbnail = $request->file('thumbnail')->store('thumbnails', 'public');
        }

        $article->update([
            'title'     => $request->title ?? $article->title,
            'content'   => $request->content ?? $article->content,
            'category'  => $request->category ?? $article->category,
            'thumbnail' => $thumbnail
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Artikel berhasil diupdate',
            'data' => $article
        ]);
    }

    // DELETE ARTICLE
    public function destroy($id)
    {
        $article = Article::find($id);

        if (!$article) {
            return response()->json([
                'status' => false,
                'message' => 'Artikel tidak ditemukan'
            ], 404);
        }

        $article->delete();

        return response()->json([
            'status' => true,
            'message' => 'Artikel berhasil dihapus'
        ]);
    }
}
