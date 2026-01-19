<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    // 🔥 [WAJIB ADA] UNTUK ADMIN USER LIST
    // Ini dipanggil oleh Route::get('/admin/users')
    public function indexAdmin()
    {
        // Ambil semua user urut dari yang terbaru
        $users = User::latest()->get();

        return response()->json([
            'success' => true,
            'data' => $users
        ]);
    }

    // 🔍 LIST SEMUA USER (Standar Resource)
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => User::all()
        ]);
    }

    // ➕ TAMBAH USER (Admin Create)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'email' => 'nullable|email|unique:users',
            'phone' => 'required|string|unique:users', // Pastikan tabel users punya kolom phone
            'password' => 'required|min:6',
            'role' => 'required|in:admin,patient,doctor'
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'] ?? null,
            'phone' => $validated['phone'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'User berhasil dibuat',
            'data' => $user
        ], 201);
    }

    // 👁️ DETAIL USER
    public function show($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User tidak ditemukan'], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $user
        ]);
    }

    // ✏️ UPDATE USER
    public function update(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User tidak ditemukan'], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'phone' => 'sometimes|string|unique:users,phone,' . $user->id,
            'password' => 'sometimes|min:6',
            'role' => 'sometimes|in:admin,patient,doctor'
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $user->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'User berhasil diupdate',
            'data' => $user
        ]);
    }

    // ❌ HAPUS USER
    public function destroy($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User tidak ditemukan'], 404);
        }

        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'User berhasil dihapus'
        ]);
    }
}