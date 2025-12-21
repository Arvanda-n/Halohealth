<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Consultation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ConsultationController extends Controller
{
    // 1. PASIEN KIRIM PERTANYAAN (POST)
    public function store(Request $request)
    {
        $request->validate([
            'doctor_id' => 'required|exists:doctors,id',
            'question' => 'required|string',
        ]);

        $consultation = Consultation::create([
            'user_id' => Auth::id(),
            'doctor_id' => $request->doctor_id,
            'question' => $request->question,
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Konsultasi berhasil dikirim',
            'data' => $consultation
        ], 201);
    }

    // 2. LIHAT HISTORY KONSULTASI (GET)
    public function index()
    {
        $user = Auth::user();

        if ($user->role === 'doctor') {
            // Dokter lihat pertanyaan yang masuk ke dia
            $doctor = $user->doctor; 
            if(!$doctor) return response()->json(['message' => 'Data dokter error'], 404);

            $data = Consultation::where('doctor_id', $doctor->id)
                                ->with('user')
                                ->orderBy('created_at', 'desc')
                                ->get();
        } else {
            // Pasien lihat pertanyaan dia sendiri
            $data = Consultation::where('user_id', $user->id)
                                ->with('doctor.user')
                                ->orderBy('created_at', 'desc')
                                ->get();
        }

        return response()->json($data);
    }

    // 3. DOKTER JAWAB (PUT)
    public function update(Request $request, $id)
    {
        if (Auth::user()->role !== 'doctor') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate(['answer' => 'required|string']);

        $consultation = Consultation::find($id);
        if (!$consultation) return response()->json(['message' => 'Not found'], 404);

        $consultation->update([
            'answer' => $request->answer,
            'status' => 'answered'
        ]);

        return response()->json(['message' => 'Jawaban terkirim', 'data' => $consultation]);
    }
}