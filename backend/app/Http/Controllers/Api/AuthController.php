<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    // 1. REGISTER ADMIN
    public function createAdmin(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|unique:users,phone',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'phone' => $validated['phone'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'admin',
        ]);

        return response()->json([
            'message' => 'Admin berhasil dibuat',
            'user' => $user
        ], 201);
    }

    // 2. REGISTER PASIEN (Sudah ada Email)
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email', // Wajib Email
            'phone' => 'required|string|unique:users,phone',
            'password' => 'required|string|min:6',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
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

    // 3. LOGIN (Tetap pakai No HP)
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

    // 4. LOGOUT
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logout berhasil']);
    }

    // 5. RESET PASSWORD ADMIN
    public function registerAdmin(Request $request)
    {
        $request->validate(['password' => 'required|min:6']);
        $user = User::where('email', 'admin@halohealth.com')->first();
        
        if (!$user) {
            return response()->json(['message' => 'Admin tidak ditemukan'], 404);
        }
        
        $user->update(['password' => Hash::make($request->password)]);
        return response()->json(['message' => 'Password admin berhasil direset']);
    }

    // 🔥 6. UPDATE PROFILE (INI PENTING BUAT HALAMAN PROFILE)
  public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,'.$user->id,
            'phone' => 'required|string|unique:users,phone,'.$user->id,
            // Password baru opsional
            'password' => 'nullable|min:6', 
            // Password lama wajib ada KALO password baru diisi
            'current_password' => 'nullable|required_with:password', 
            
            'height' => 'nullable|numeric|min:0',
            'weight' => 'nullable|numeric|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', 
        ]);

        // 1. Update Data Diri Biasa
        $user->name = $validated['name'];
        $user->email = $validated['email'];
        $user->phone = $validated['phone'];
        $user->height = $validated['height'] ?? $user->height;
        $user->weight = $validated['weight'] ?? $user->weight;

        // 2. 🔥 LOGIC GANTI PASSWORD (AMAN)
        if ($request->filled('password')) {
            // Cek apakah password lama cocok dengan database?
            if (!Hash::check($request->current_password, $user->password)) {
                return response()->json([
                    'message' => 'Password lama salah! Tidak bisa ganti password.'
                ], 400);
            }
            // Kalau cocok, baru simpan password baru
            $user->password = Hash::make($validated['password']);
        }

        // 3. Logic Upload Foto
        if ($request->hasFile('image')) {
            if ($user->image && \Illuminate\Support\Facades\Storage::exists('public/' . $user->image)) {
                \Illuminate\Support\Facades\Storage::delete('public/' . $user->image);
            }
            $path = $request->file('image')->store('profiles', 'public');
            $user->image = $path;
        }

        // 4. 🔥 LOGIC UPLOAD FOTO (VERSI KEBAL ERROR)
        if ($request->hasFile('image')) {
            // Cek kalau user punya foto lama
            if ($user->image) {
                try {
                    // Coba hapus file lama dari disk 'public'
                    \Illuminate\Support\Facades\Storage::disk('public')->delete($user->image);
                } catch (\Exception $e) {
                    // Kalau gagal hapus (misal file gak ada), BIARKAN SAJA.
                    // Jangan bikin aplikasi crash. Lanjut upload yang baru.
                }
            }
            
            // Simpan foto baru
            $path = $request->file('image')->store('profiles', 'public');
            $user->image = $path;
        }

        $user->save();

        return response()->json([
            'message' => 'Profil berhasil diperbarui',
            'user' => $user
        ]);
    }
}