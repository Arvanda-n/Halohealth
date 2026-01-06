<?php

namespace App\Http\Controllers\Api;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class AdminController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'login' => 'required',      // email atau no_hp
            'password' => 'required',
        ]);

        // Cek apakah login berupa email atau no_hp
        $login_field = filter_var($request->login, FILTER_VALIDATE_EMAIL) ? 'email' : 'no_hp';
        $credentials = [
            $login_field => $request->login,
            'password' => $request->password
        ];

        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            $token = $user->createToken('API Token')->plainTextToken;

            return response()->json([
                'token' => $token,
                'user' => $user
            ]);
        }

        return response()->json(['message' => 'Email/No HP atau Password salah'], 401);
    }
}
