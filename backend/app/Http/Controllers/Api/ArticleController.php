<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\File; // Tambah ini buat hapus file manual

class ArticleController extends Controller
{
    // 1. GET ALL
    public function index()
    {
        $articles = Article::latest()->get();
        return response()->json([
            'success' => true,
            'data'    => $articles
        ], 200);
    }

    // 2. STORE (Simpan Baru ke folder UPLOADS)
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title'     => 'required|string|max:255',
            'content'   => 'required',
            'category'  => 'required',
            'author'    => 'required',
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:10240',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $imagePath = null;
        if ($request->hasFile('thumbnail')) {
            $image = $request->file('thumbnail');
            // Bikin nama file unik
            $filename = time() . '_' . $image->getClientOriginalName();
            
            // 🔥 PINDAHKAN LANGSUNG KE FOLDER PUBLIC/UPLOADS/ARTICLES
            $image->move(public_path('uploads/articles'), $filename);
            
            // Simpan URL-nya
            $imagePath = url('uploads/articles/' . $filename);
        }

        $article = Article::create([
            'title'     => $request->title,
            'content'   => $request->content,
            'category'  => $request->category,
            'author'    => $request->author,
            'thumbnail' => $imagePath,
            'image'     => $imagePath,
            'published_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Artikel Berhasil Disimpan!',
            'data'    => $article
        ], 201);
    }

    // 3. SHOW
    public function show($id)
    {
        $article = Article::find($id);
        if (!$article) return response()->json(['message' => 'Not Found'], 404);
        
        return response()->json([
            'success' => true,
            'data'    => $article
        ], 200);
    }

    // 4. UPDATE (Edit ke folder UPLOADS)
    public function update(Request $request, $id)
    {
        $article = Article::find($id);
        if (!$article) return response()->json(['message' => 'Not Found'], 404);

        $validator = Validator::make($request->all(), [
            'title'     => 'required|string|max:255',
            'content'   => 'required',
            'category'  => 'required',
            'author'    => 'required',
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:10240',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        if ($request->hasFile('thumbnail')) {
            // Hapus gambar lama di folder uploads (kalau ada)
            if ($article->thumbnail) {
                // Ambil nama file dari URL lama
                $oldPath = public_path('uploads/articles/' . basename($article->thumbnail));
                if (File::exists($oldPath)) {
                    File::delete($oldPath);
                }
            }

            // Upload gambar baru
            $image = $request->file('thumbnail');
            $filename = time() . '_' . $image->getClientOriginalName();
            $image->move(public_path('uploads/articles'), $filename);
            
            $imagePath = url('uploads/articles/' . $filename);
            $article->thumbnail = $imagePath;
            $article->image = $imagePath;
        }

        $article->update([
            'title'    => $request->title,
            'content'  => $request->content,
            'category' => $request->category,
            'author'   => $request->author,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Update Berhasil!',
            'data'    => $article
        ], 200);
    }

    // 5. DESTROY
    public function destroy($id)
    {
        $article = Article::find($id);
        if (!$article) return response()->json(['message' => 'Not Found'], 404);

        // Hapus file fisik
        if ($article->thumbnail) {
            $oldPath = public_path('uploads/articles/' . basename($article->thumbnail));
            if (File::exists($oldPath)) {
                File::delete($oldPath);
            }
        }

        $article->delete();
        return response()->json(['success' => true, 'message' => 'Dihapus']);
    }
}