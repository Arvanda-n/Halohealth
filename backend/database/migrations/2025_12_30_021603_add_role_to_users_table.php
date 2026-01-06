<?php
use App\Models\User;
use Illuminate\Support\Facades\Hash;

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'role')) {
                $table->string('role')->default('user');
            }
        });
    }

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'role')) {
                $table->dropColumn('role');
            }
        });
    }

    // REGISTER ADMIN BARU
public function registerAdmin(Request $request)
{
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'phone' => 'required|string|unique:users,phone',
        'email' => 'required|email|unique:users,email',
        'password' => 'required|string|min:6',
    ]);

    $admin = User::create([
        'name' => $validated['name'],
        'phone' => $validated['phone'],
        'email' => $validated['email'],
        'password' => Hash::make($validated['password']),
        'role' => 'admin',
    ]);

    $token = $admin->createToken('admin_token')->plainTextToken;

    return response()->json([
        'message' => 'Admin berhasil dibuat',
        'access_token' => $token,
        'user' => $admin
    ], 201);
}

};
