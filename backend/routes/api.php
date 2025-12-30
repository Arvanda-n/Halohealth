<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Controllers UTAMA
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\MedicineController;
use App\Http\Controllers\Api\DoctorController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ConsultationController;
use App\Http\Controllers\Api\CartController; // 👈 JANGAN LUPA INI!

// Controllers ADMIN (Punya Temanmu)
use App\Http\Controllers\Api\Admin\UserController;
use App\Http\Controllers\Api\Admin\AdminDoctorController;
use App\Http\Controllers\Api\Admin\AdminMedicineController;

/*
|--------------------------------------------------------------------------
| 1. PUBLIC ROUTES (Tanpa Login)
|--------------------------------------------------------------------------
*/

// Auth
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login'])->name('login');

// Katalog Obat
Route::get('/medicines', [MedicineController::class, 'index']);
Route::get('/medicines/{id}', [MedicineController::class, 'show']);

// Daftar Dokter
Route::get('/doctors', [DoctorController::class, 'index']);
Route::get('/doctors/{id}', [DoctorController::class, 'show']);

// 👇👇👇 PINDAHAN SEMENTARA (Biar Thunder Client lancar create dokter) 👇👇👇
Route::post('/doctors', [DoctorController::class, 'store']); 
// 👆👆👆

// Kategori
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{id}', [CategoryController::class, 'show']);

/*
|--------------------------------------------------------------------------
| 2. PROTECTED ROUTES (Harus Login / auth:sanctum)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {

    // Cek User Login
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Logout
    Route::post('/logout', [AuthController::class, 'logout']);

    // --- 🛒 FITUR KERANJANG (PUNYA KAMU) ---
    // (Ini yang tadi hilang pas merge)
    Route::get('/carts', [CartController::class, 'index']);
    Route::post('/carts', [CartController::class, 'store']);
    Route::put('/carts/{id}', [CartController::class, 'update']);
    Route::delete('/carts/{id}', [CartController::class, 'destroy']);

    // --- 💬 FITUR KONSULTASI ---
    Route::post('/consultations', [ConsultationController::class, 'store']);
    Route::get('/consultations', [ConsultationController::class, 'index']);
    Route::put('/consultations/{id}', [ConsultationController::class, 'update']);

    // --- 👨‍⚕️ DOKTER MANAGEMENT (Edit/Hapus Sendiri) ---
    Route::put('/doctors/{id}', [DoctorController::class, 'update']); 
    Route::delete('/doctors/{id}', [DoctorController::class, 'destroy']);

    // --- 🔐 ADMIN ONLY AREA (PUNYA TEMANMU) ---
    Route::middleware('admin')->group(function () {
        
        // Admin Dashboard Stats
        Route::get('/admin/dashboard', function () {
            return response()->json([
                'doctors' => \App\Models\Doctor::count(),
                'medicines' => \App\Models\Medicine::count(),
                'users' => \App\Models\User::count(),
            ]);
        });

        // Register Admin Baru
        Route::post('/admin/register', [AuthController::class, 'registerAdmin']);

        // Management Resources (CRUD Otomatis)
        Route::apiResource('/admin/users', UserController::class);
        Route::apiResource('/admin/doctors', AdminDoctorController::class);
        Route::apiResource('/admin/medicines', AdminMedicineController::class);
        Route::apiResource('/admin/categories', CategoryController::class);
    });

});