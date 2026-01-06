<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Doctor;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\File; // Tambahkan ini untuk hapus file
use Illuminate\Support\Facades\Validator;

class DoctorController extends Controller
{
    // 1. GET ALL
    public function index()
    {
        $doctors = Doctor::with('user')->latest()->get();

        return response()->json([
            'success' => true,
            'data'    => $doctors
        ], 200);
    }

    // 2. CREATE (SIMPAN BARU)
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'           => 'required|string|max:255',
            'email'          => 'required|email|unique:users,email',
            'phone'          => 'required',
            'password'       => 'required|min:6',
            'specialization' => 'required',
            'experience_years'=> 'required|numeric',
            'consultation_fee'=> 'required|numeric',
            'photo'          => 'nullable|image|max:10240', // Maksimal 10MB
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        try {
            $result = DB::transaction(function () use ($request) {
                // A. Buat User Akun
                $user = User::create([
                    'name'     => $request->name,
                    'email'    => $request->email,
                    'phone'    => $request->phone,
                    'password' => Hash::make($request->password),
                    'role'     => 'doctor',
                ]);

                // B. PROSES UPLOAD FOTO (Metode Direct ke Public)
                $photoUrl = null;
                if ($request->hasFile('photo')) {
                    $image = $request->file('photo');
                    $filename = time() . '_' . $image->hashName();
                    
                    // Simpan ke folder public/uploads/doctors
                    $image->move(public_path('uploads/doctors'), $filename);
                    
                    // Buat link URL lengkap
                    $photoUrl = url('uploads/doctors/' . $filename);
                }

                // C. Buat Data Dokter
                $doctor = Doctor::create([
                    'user_id'          => $user->id,
                    'specialization'   => $request->specialization,
                    'experience_years' => $request->experience_years,
                    'consultation_fee' => $request->consultation_fee,
                    'image'            => $photoUrl,
                    'is_online'        => true,
                ]);

                return $doctor;
            });

            return response()->json(['success' => true, 'message' => 'Dokter Berhasil Dibuat!', 'data' => $result], 201);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal: ' . $e->getMessage()], 500);
        }
    }

    // 3. SHOW DETAIL
    public function show($id)
    {
        $doctor = Doctor::with('user')->find($id);

        if (!$doctor) {
            return response()->json(['message' => 'Dokter tidak ditemukan'], 404);
        }

        return response()->json(['success' => true, 'data' => $doctor]);
    }

    // 4. UPDATE (FULL UPDATE: USER + DOKTER + FOTO)
    public function update(Request $request, $id)
    {
        $doctor = Doctor::find($id);
        if (!$doctor) return response()->json(['message' => 'Not Found'], 404);
        
        $user = User::find($doctor->user_id);

        $validator = Validator::make($request->all(), [
            'name'           => 'required',
            'email'          => 'required|email|unique:users,email,'.$user->id, 
            'phone'          => 'required',
            'specialization' => 'required',
            'experience_years'=> 'required|numeric',
            'consultation_fee'=> 'required|numeric',
            'photo'          => 'nullable|image|max:10240', 
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        try {
            DB::transaction(function () use ($request, $doctor, $user) {
                // A. Update Akun User
                $userData = [
                    'name'  => $request->name,
                    'email' => $request->email,
                    'phone' => $request->phone,
                ];
                if ($request->filled('password')) {
                    $userData['password'] = Hash::make($request->password);
                }
                $user->update($userData);

                // B. Update Data Dokter
                $doctorData = [
                    'specialization'   => $request->specialization,
                    'experience_years' => $request->experience_years,
                    'consultation_fee' => $request->consultation_fee,
                ];

                // C. UPDATE FOTO BARU
                if ($request->hasFile('photo')) {
                    // Hapus foto lama dari folder public/uploads/doctors
                    if ($doctor->image) {
                        $oldFilename = basename($doctor->image);
                        $oldPath = public_path('uploads/doctors/' . $oldFilename);
                        if (File::exists($oldPath)) {
                            File::delete($oldPath);
                        }
                    }

                    // Simpan foto baru
                    $image = $request->file('photo');
                    $filename = time() . '_' . $image->hashName();
                    $image->move(public_path('uploads/doctors'), $filename);
                    $doctorData['image'] = url('uploads/doctors/' . $filename);
                }

                $doctor->update($doctorData);
            });

            return response()->json(['message' => 'Update Berhasil', 'data' => $doctor]);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal Update: ' . $e->getMessage()], 500);
        }
    }

    // 5. DELETE (Hapus Data & Foto Fisik)
    public function destroy($id)
    {
        $doctor = Doctor::find($id);
        if (!$doctor) return response()->json(['message' => 'Not Found'], 404);

        $user = User::find($doctor->user_id);
        
        // Hapus foto dari folder publik
        if ($doctor->image) {
            $filename = basename($doctor->image);
            $path = public_path('uploads/doctors/' . $filename);
            if (File::exists($path)) {
                File::delete($path);
            }
        }
        
        $doctor->delete();
        if($user) $user->delete();

        return response()->json(['message' => 'Dokter Berhasil Dihapus']);
    }
}