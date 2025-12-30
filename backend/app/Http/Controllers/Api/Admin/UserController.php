<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    // 🔍 LIST SEMUA USER
    public function index()
    {
        return response()->json([
            'users' => User::all()
        ]);
    }

    // ➕ TAMBAH USER
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'email' => 'nullable|email|unique:users',
            'phone' => 'required|string|unique:users',
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
            'message' => 'User berhasil dibuat',
            'user' => $user
        ], 201);
    }

    // 👁️ DETAIL USER
    public function show($id)
    {
        $user = User::findOrFail($id);

        return response()->json([
            'user' => $user
        ]);
    }

    // ✏️ UPDATE USER
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

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
            'message' => 'User berhasil diupdate',
            'user' => $user
        ]);
    }

    // ❌ HAPUS USER
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json([
            'message' => 'User berhasil dihapus'
        ]);
    }
}
