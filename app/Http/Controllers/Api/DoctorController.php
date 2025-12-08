<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Doctor;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Http\Response;

class DoctorController extends Controller
{
    // List semua dokter (with simple pagination)
    public function index(Request $request)
    {
        $perPage = (int) $request->query('per_page', 10);
        $doctors = Doctor::orderBy('name')->paginate($perPage);
        return response()->json($doctors);
    }

    // Tampilkan satu dokter
    public function show($id)
    {
        $doctor = Doctor::find($id);
        if (!$doctor) {
            return response()->json(['message' => 'Doctor not found'], Response::HTTP_NOT_FOUND);
        }
        return response()->json($doctor);
    }

    // Simpan dokter baru
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|unique:doctors,email',
            'phone' => 'nullable|string|max:30',
            'specialty' => 'nullable|string|max:255',
            'license_number' => 'nullable|string|max:100|unique:doctors,license_number',
            'address' => 'nullable|string',
            'gender' => ['nullable', Rule::in(['male','female','other'])],
            'birth_date' => 'nullable|date',
            'photo' => 'nullable|string', // jika upload, gunakan storage flow (base64 or multipart)
            'active' => 'nullable|boolean',
        ]);

        $doctor = Doctor::create($validated);

        return response()->json($doctor, Response::HTTP_CREATED);
    }

    // Update dokter
    public function update(Request $request, $id)
{
    $doctor = Doctor::find($id);

    if (!$doctor) {
        return response()->json([
            'message' => 'Doctor not found'
        ], 404);
    }

    $validated = $request->validate([
        'name' => 'sometimes|string|max:255',
        'email' => 'nullable|email|unique:doctors,email,' . $doctor->id,
        'phone' => 'nullable|string|max:30',
        'specialty' => 'nullable|string|max:255',
        'license_number' => 'nullable|string|max:100|unique:doctors,license_number,' . $doctor->id,
        'address' => 'nullable|string',
        'gender' => 'nullable|string',
        'birth_date' => 'nullable|date',
        'photo' => 'nullable|string',
        'active' => 'nullable|boolean',
    ]);

    $doctor->update($validated);

    return response()->json([
        'message' => 'Doctor updated successfully',
        'data' => $doctor
    ], 200);
}


    // Hapus dokter
   public function destroy($id)
{
    $doctor = Doctor::find($id);

    if (!$doctor) {
        return response()->json([
            'message' => 'Doctor not found'
        ], 404);
    }

    $doctor->delete();

    return response()->json([
        'message' => 'Doctor deleted successfully'
    ], 200);
}

}
