<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    // REGISTER PASIEN
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|unique:users,phone',
            'password' => 'required|string|min:6',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'phone' => $validated['phone'],
            'password' => Hash::make($validated['password']),
            'role' => 'patient',
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Register berhasil',
            'access_token' => $token,
            'user' => $user
        ], 201);
    }

    // LOGIN
    public function login(Request $request)
    {
        if (!Auth::attempt($request->only('phone', 'password'))) {
            return response()->json(['message' => 'No HP atau Password salah'], 401);
        }

        $user = Auth::user();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login berhasil',
            'access_token' => $token,
            'user' => $user
        ]);
    }

    // LOGOUT
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logout berhasil']);
    }

    // RESET PASSWORD ADMIN (AMAN)
    public function registerAdmin(Request $request)
    {
        $request->validate([
            'password' => 'required|min:6'
        ]);

        $user = User::where('email', 'admin@halohealth.com')->first();

        if (!$user) {
            return response()->json(['message' => 'Admin tidak ditemukan'], 404);
        }

        $user->update([
            'password' => Hash::make($request->password),
        ]);

        return response()->json([
            'message' => 'Password admin berhasil direset'
        ]);
    }
}
