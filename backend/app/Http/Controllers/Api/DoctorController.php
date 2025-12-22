<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DoctorController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'specialization' => 'required',
            'experience_years' => 'required|numeric',
            'consultation_fee' => 'required|numeric',
        ]);

        $id = DB::table('doctors')->insertGetId([
            'user_id' => $request->user_id,
            'specialization' => $request->specialization,
            'experience_years' => $request->experience_years,
            'consultation_fee' => $request->consultation_fee,
            'photo' => $request->image, // 👈 UBAH DISINI: Kolom DB 'photo', Input JSON 'image'
            'is_online' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json(['message' => 'Dokter Berhasil Ditambahkan!', 'id' => $id], 201);
    }

    public function index()
    {
        $doctors = DB::table('doctors')
            ->join('users', 'doctors.user_id', '=', 'users.id')
            ->select(
                'doctors.id',
                'users.name',
                'doctors.specialization',
                'doctors.consultation_fee',
                'doctors.photo' // 👈 UBAH DISINI: Ambil dari kolom 'photo'
            )
            ->get();

        $formattedDoctors = $doctors->map(function ($doc) {
            // Cek kolom 'photo', bukan 'image'
            $foto = $doc->photo ? $doc->photo : 'https://cdn-icons-png.flaticon.com/512/3774/3774299.png';

            return [
                'id' => $doc->id,
                'name' => $doc->name,
                'specialist' => $doc->specialization,
                'price' => $doc->consultation_fee,
                'image' => $foto, // Frontend tetap taunya 'image', jadi biarin ini 'image'
                'rating' => '5.0'
            ];
        });

        return response()->json($formattedDoctors);
    }
}