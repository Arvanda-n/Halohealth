<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Doctor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DoctorController extends Controller
{
    // 1. GET ALL (Bisa difilter by spesialis)
    public function index(Request $request)
    {
        $query = Doctor::with('user'); // Load data user (nama/email) juga

        if ($request->has('specialization')) {
            $query->where('specialization', 'like', '%' . $request->specialization . '%');
        }

        return response()->json($query->get());
    }

    // 2. SHOW (Lihat Detail 1 Dokter)
    public function show($id)
    {
        $doctor = Doctor::with('user')->find($id);

        if (!$doctor) {
            return response()->json(['message' => 'Dokter tidak ditemukan'], 404);
        }

        return response()->json($doctor);
    }

    // 3. STORE (Admin/Sistem bikin data dokter baru)
    public function store(Request $request)
    {
        // Validasi input
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id|unique:doctors,user_id',
            'specialization' => 'required|string',
            'license_number' => 'nullable|string|unique:doctors,license_number',
            'experience_years' => 'required|integer',
            'consultation_fee' => 'required|integer',
            'address' => 'nullable|string',
            'gender' => 'nullable|in:male,female',
        ]);

        $doctor = Doctor::create($validated);

        return response()->json([
            'message' => 'Data dokter berhasil dibuat',
            'data' => $doctor
        ], 201);
    }

    // 4. UPDATE (Dokter update profil sendiri)
    public function update(Request $request, $id)
    {
        $doctor = Doctor::find($id);

        if (!$doctor) {
            return response()->json(['message' => 'Dokter tidak ditemukan'], 404);
        }

        $validated = $request->validate([
            'specialization' => 'sometimes|string',
            'license_number' => 'sometimes|string|unique:doctors,license_number,' . $id,
            'experience_years' => 'sometimes|integer',
            'consultation_fee' => 'sometimes|integer',
            'address' => 'nullable|string',
            'is_online' => 'boolean',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048', // Validasi foto
        ]);

        // Logic Upload Foto (Kalau ada yang diupload)
        if ($request->hasFile('photo')) {
            // Hapus foto lama jika ada
            if ($doctor->photo) {
                Storage::delete($doctor->photo);
            }
            // Simpan foto baru
            $validated['photo'] = $request->file('photo')->store('doctor-photos', 'public');
        }

        $doctor->update($validated);

        return response()->json([
            'message' => 'Profil dokter berhasil diupdate',
            'data' => $doctor
        ]);
    }

    // 5. DELETE (Hapus Dokter)
    public function destroy($id)
    {
        $doctor = Doctor::find($id);
        if (!$doctor) {
            return response()->json(['message' => 'Dokter tidak ditemukan'], 404);
        }
        
        // Hapus fotonya dulu biar gak nyampah
        if ($doctor->photo) {
            Storage::delete($doctor->photo);
        }

        $doctor->delete();
        return response()->json(['message' => 'Data dokter berhasil dihapus']);
    }
}