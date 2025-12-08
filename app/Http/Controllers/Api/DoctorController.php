<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Doctor;
use Illuminate\Http\Request;

class DoctorController extends Controller
{
    public function index()
    {
        // Ambil data dokter + data user-nya (nama, foto, dll)
        $doctors = Doctor::with('user')->where('is_online', true)->get();
        return response()->json($doctors);
    }

    public function show($id)
    {
        $doctor = Doctor::with('user')->find($id);
        if (!$doctor) {
            return response()->json(['message' => 'Dokter tidak ditemukan'], 404);
        }
        return response()->json($doctor);
    }
}

