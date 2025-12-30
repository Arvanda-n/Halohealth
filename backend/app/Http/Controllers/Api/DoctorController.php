<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DoctorController extends Controller
{
    // 1. CREATE (BIKIN USER + DOKTER SEKALIGUS)
    public function store(Request $request)
    {
        // Validasi input
        $request->validate([
            'name' => 'required',
            'phone' => 'required|unique:users,phone',
            'password' => 'required',
            'specialization' => 'required',
            'experience_years' => 'required|numeric',
            'consultation_fee' => 'required|numeric',
        ]);

        try {
            $result = DB::transaction(function () use ($request) {
                
                // A. INSERT KE TABEL USERS
                $userId = DB::table('users')->insertGetId([
                    'name' => $request->name,
                    'phone' => $request->phone,
                    'password' => Hash::make($request->password),
                    'role' => 'doctor',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                // B. INSERT KE TABEL DOCTORS (Gunakan 'image' bukan 'photo')
                $doctorId = DB::table('doctors')->insertGetId([
                    'user_id' => $userId,
                    'specialization' => $request->specialization,
                    'experience_years' => $request->experience_years,
                    'consultation_fee' => $request->consultation_fee,
                    'image' => $request->image, // <--- SUDAH DIPERBAIKI JADI 'image'
                    'is_online' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                return $doctorId;
            });

            return response()->json(['message' => 'Dokter Berhasil Dibuat!', 'id' => $result], 201);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal membuat dokter: ' . $e->getMessage()], 500);
        }
    }

    // 2. GET ALL
    public function index()
    {
        $doctors = DB::table('doctors')
            ->join('users', 'doctors.user_id', '=', 'users.id')
            ->select(
                'doctors.id',
                'users.name',
                'doctors.specialization',
                'doctors.consultation_fee',
                'doctors.image', // <--- SUDAH DIPERBAIKI
                'doctors.is_online'
            )
            ->get();

        $formattedDoctors = $doctors->map(function ($doc) {
            return [
                'id' => $doc->id,
                'name' => $doc->name,
                'specialist' => $doc->specialization,
                'price' => $doc->consultation_fee,
                'image' => $doc->image ?? 'https://cdn-icons-png.flaticon.com/512/3774/3774299.png',
                'is_online' => $doc->is_online,
                'rating' => '5.0'
            ];
        });

        return response()->json($formattedDoctors);
    }

    // 3. SHOW DETAIL
    public function show($id)
    {
        $doctor = DB::table('doctors')
            ->join('users', 'doctors.user_id', '=', 'users.id')
            ->where('doctors.id', $id)
            ->select(
                'doctors.id',
                'users.name',
                'doctors.specialization',
                'doctors.experience_years',
                'doctors.consultation_fee',
                'doctors.image', // <--- SUDAH DIPERBAIKI
                'doctors.hospital', 
                'doctors.is_online'
            )
            ->first();

        if (!$doctor) {
            return response()->json(['message' => 'Dokter tidak ditemukan'], 404);
        }

        $response = [
            'id' => $doctor->id,
            'name' => $doctor->name,
            'specialist' => $doctor->specialization,
            'experience_years' => $doctor->experience_years,
            'price' => $doctor->consultation_fee,
            'image' => $doctor->image ?? 'https://cdn-icons-png.flaticon.com/512/3774/3774299.png',
            'hospital' => $doctor->hospital ?? 'HaloHealth Hospital',
            'is_online' => $doctor->is_online
        ];

        return response()->json($response);
    }
}