<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Doctor;

class AdminDoctorController extends Controller
{
    public function index()
    {
        return Doctor::all();
    }

    public function store(Request $request)
    {
        // simpan dokter baru
    }

    public function show($id)
    {
        return Doctor::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        // update dokter
    }

    public function destroy($id)
    {
        Doctor::destroy($id);
        return response()->json(['message' => 'Doctor deleted']);
    }
}
