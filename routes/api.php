<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\MedicineController;
use App\Http\Controllers\Api\DoctorController;
use App\Http\Controllers\Api\CategoryController; // Pastikan tulisannya Api atau API sesuai nama folder
use App\Http\Controllers\Api\ConsultationController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// =================================================================
// 1. PUBLIC ROUTES (Bisa diakses TANPA Login)
// =================================================================

// Auth
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Obat (Orang belum login boleh lihat katalog)
Route::get('/medicines', [MedicineController::class, 'index']);
Route::get('/medicines/{id}', [MedicineController::class, 'show']);

// Dokter (Orang boleh lihat daftar dokter)
Route::get('/doctors', [DoctorController::class, 'index']);
Route::get('/doctors/{id}', [DoctorController::class, 'show']);

// Kategori
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{id}', [CategoryController::class, 'show']);


// =================================================================
// 2. PROTECTED ROUTES (Harus Login / Punya Token Bearer)
// =================================================================
Route::middleware('auth:sanctum')->group(function () {
    
    // Cek User Login
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Logout
    Route::post('/logout', [AuthController::class, 'logout']);

    // --- FITUR KONSULTASI ---
    Route::post('/consultations', [ConsultationController::class, 'store']); // Pasien Kirim Pertanyaan
    Route::get('/consultations', [ConsultationController::class, 'index']);  // Lihat History
    Route::put('/consultations/{id}', [ConsultationController::class, 'update']); // Dokter Jawab (PENTING INI TADI KURANG)

    // --- ADMIN / DOKTER MANAGEMENT ---
    // (Sebaiknya fitur edit dokter ditaruh sini biar aman)
    Route::post('/doctors', [DoctorController::class, 'store']); 
    Route::put('/doctors/{id}', [DoctorController::class, 'update']); 
    Route::delete('/doctors/{id}', [DoctorController::class, 'destroy']);

    // --- ADMIN ONLY (Obat) ---
    Route::middleware('admin')->group(function () {
        Route::post('/medicines', [MedicineController::class, 'store']);      
        Route::put('/medicines/{id}', [MedicineController::class, 'update']);  
        Route::delete('/medicines/{id}', [MedicineController::class, 'destroy']); 
    });
});