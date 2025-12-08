<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\MedicineController;
use App\Http\Controllers\Api\DoctorController;


// === PUBLIC ROUTES (Bisa diakses siapa saja) ===
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Orang belum login boleh lihat daftar obat (kebutuhan Toko Kesehatan)
Route::get('/medicines', [MedicineController::class, 'index']);
Route::get('/medicines/{id}', [MedicineController::class, 'show']);

//doctor controler
Route::get('/doctors', [DoctorController::class, 'index']);
Route::get('/doctors/{id}', [DoctorController::class, 'show']);


// === PROTECTED ROUTES (Harus Login / Punya Token) ===
Route::middleware('auth:sanctum')->group(function () {
    
    // Cek user yang sedang login
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Logout
    Route::post('/logout', [AuthController::class, 'logout']);

    // === ADMIN ONLY ROUTES ===
    // Grup ini diproteksi oleh middleware 'admin' yang kita buat tadi
    Route::middleware('admin')->group(function () {
        Route::post('/medicines', [MedicineController::class, 'store']);       // Tambah Obat
        Route::put('/medicines/{id}', [MedicineController::class, 'update']);  // Edit Obat
        Route::delete('/medicines/{id}', [MedicineController::class, 'destroy']); // Hapus Obat
    });
});