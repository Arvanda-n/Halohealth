<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ConsultationController extends Controller
{
    public function store(Request $request)
{
    $request->validate([
        'doctor_id' => 'required|exists:doctors,id',
        'question' => 'required|string'
    ]);

    $consult = Consultation::create([
        'user_id' => auth()->id(),
        'doctor_id' => $request->doctor_id,
        'question' => $request->question
    ]);

    return response()->json(['message' => 'Konsultasi berhasil dibuat','data'=>$consult]);
}

public function index()
{
    $consults = Consultation::with('doctor')->where('user_id', auth()->id())->get();
    return response()->json($consults);
}

}
