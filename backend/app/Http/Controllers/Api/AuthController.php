<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Doctor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class AuthController extends Controller
{
    /**
     * REGISTER DOKTER (DIBUAT OLEH ADMIN)
     * FIX: Mengirim angka murni ke database (Integer)
     */
    public function registerDoctor(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'required|string|unique:users,phone',
            'password' => 'required|string|min:6',
            'specialization' => 'nullable|string',
            'experience' => 'required|numeric', // Kita minta angka dari frontend
            'price' => 'required|numeric',      // Kita minta angka dari frontend
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // 1. Simpan ke tabel USERS
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'password' => Hash::make($validated['password']),
            'role' => 'doctor', 
        ]);

        // 2. Handle Upload Foto ke folder storage/app/public/profiles
        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('profiles', 'public');
        }

        // 3. Simpan ke tabel DOCTORS
        // 🔥 FIX: Paksa tipe data menjadi Integer agar tidak "Data Truncated"
        Doctor::create([
            'user_id' => $user->id,
            'specialization' => $validated['specialization'] ?? 'Dokter Umum',
            'sip' => '-',
            'hospital' => '-',
            'experience_years' => (int)$validated['experience'], // Konversi ke angka murni
            'consultation_fee' => (int)$validated['price'],      // Konversi ke angka murni
            'image' => $imagePath,
        ]);

        return response()->json(['message' => 'Dokter berhasil didaftarkan!'], 201);
    }

    /**
     * UPDATE PROFILE
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,'.$user->id,
            'phone' => 'required|string|unique:users,phone,'.$user->id,
            'image' => 'nullable|image|max:2048',
            'specialization' => 'nullable|string',
        ]);

        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
        ]);

        if ($request->hasFile('image')) {
            if ($user->image) Storage::disk('public')->delete($user->image);
            $user->image = $request->file('image')->store('profiles', 'public');
            $user->save();
        }

        if ($user->role === 'doctor') {
            Doctor::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'specialization' => $request->specialization,
                    'image' => $user->image
                ]
            );
        }

        return response()->json(['message' => 'Profil Update!', 'user' => $user->load('doctor')]);
    }

    /**
     * LOGIN
     */
    public function login(Request $request)
    {
        if (!Auth::attempt($request->only('phone', 'password'))) {
            return response()->json(['message' => 'Salah!'], 401);
        }
        $user = Auth::user();
        return response()->json([
            'token' => $user->createToken('auth_token')->plainTextToken,
            'user' => $user->load('doctor')
        ]);
    }

    /**
     * LOGOUT
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logout!']);
    }
}