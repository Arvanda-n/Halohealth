<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Medicine;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Validator;

class MedicineController extends Controller
{
    // 1. GET ALL (Dengan Format FE)
    public function index()
    {
        $medicines = Medicine::latest()->get();

        $formatted = $medicines->map(function($item) {
            return [
                'id'          => $item->id,
                'name'        => $item->name,
                'slug'        => $item->slug,
                'price'       => (int) $item->price,
                'stock'       => (int) $item->stock,
                'category'    => $item->category,
                'sub'         => $item->sub_category,
                'image'       => $item->image,
                'description' => $item->description
            ];
        });

        return response()->json([
            'success' => true,
            'data'    => $formatted
        ]);
    }

    // 2. CREATE (Tambah Obat + Upload Foto)
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'         => 'required|string|max:255',
            'description'  => 'required',
            'price'        => 'required|numeric',
            'stock'        => 'required|numeric',
            'category'     => 'required',
            'sub_category' => 'nullable',
            'photo'        => 'nullable|image|max:5120', // Max 5MB
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $photoUrl = null;
        if ($request->hasFile('photo')) {
            $image = $request->file('photo');
            $filename = time() . '_' . Str::slug($request->name) . '.' . $image->getClientOriginalExtension();
            
            // Simpan ke public/uploads/medicines
            $image->move(public_path('uploads/medicines'), $filename);
            $photoUrl = url('uploads/medicines/' . $filename);
        }

        $medicine = Medicine::create([
            'name'         => $request->name,
            'slug'         => Str::slug($request->name),
            'description'  => $request->description,
            'price'        => $request->price,
            'stock'        => $request->stock,
            'category'     => $request->category,
            'sub_category' => $request->sub_category,
            'image'        => $photoUrl,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Obat berhasil ditambahkan',
            'data'    => $medicine
        ], 201);
    }

    // 3. SHOW (Lihat Detail)
    public function show($id)
    {
        $medicine = Medicine::find($id);
        if (!$medicine) {
            return response()->json(['message' => 'Obat tidak ditemukan'], 404);
        }
        return response()->json(['success' => true, 'data' => $medicine]);
    }

    // 4. UPDATE (Edit Obat + Ganti Foto)
    public function update(Request $request, $id)
    {
        $medicine = Medicine::find($id);
        if (!$medicine) {
            return response()->json(['message' => 'Obat tidak ditemukan'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name'         => 'sometimes|string|max:255',
            'description'  => 'sometimes',
            'price'        => 'sometimes|numeric',
            'stock'        => 'sometimes|numeric',
            'category'     => 'sometimes',
            'photo'        => 'nullable|image|max:5120',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $data = $request->all();
        
        if ($request->has('name')) {
            $data['slug'] = Str::slug($request->name);
        }

        // Logika Update Foto
        if ($request->hasFile('photo')) {
            // Hapus foto lama jika ada
            if ($medicine->image) {
                $oldFilename = basename($medicine->image);
                $oldPath = public_path('uploads/medicines/' . $oldFilename);
                if (File::exists($oldPath)) {
                    File::delete($oldPath);
                }
            }

            // Upload foto baru
            $image = $request->file('photo');
            $filename = time() . '_' . Str::random(5) . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('uploads/medicines'), $filename);
            $data['image'] = url('uploads/medicines/' . $filename);
        }

        $medicine->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Obat berhasil diperbarui',
            'data'    => $medicine
        ]);
    }

    // 5. DESTROY (Hapus Obat & File Fotonya)
    public function destroy($id)
    {
        $medicine = Medicine::find($id);
        if (!$medicine) {
            return response()->json(['message' => 'Obat tidak ditemukan'], 404);
        }

        // Hapus file fisik foto
        if ($medicine->image) {
            $filename = basename($medicine->image);
            $path = public_path('uploads/medicines/' . $filename);
            if (File::exists($path)) {
                File::delete($path);
            }
        }

        $medicine->delete();

        return response()->json([
            'success' => true,
            'message' => 'Obat berhasil dihapus'
        ]);
    }
}