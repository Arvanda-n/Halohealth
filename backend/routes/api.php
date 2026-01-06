<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Controllers UTAMA
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\MedicineController;
use App\Http\Controllers\Api\DoctorController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ConsultationController;
use App\Http\Controllers\Api\CartController; 
use App\Http\Controllers\Api\ArticleController; 
use App\Http\Controllers\Api\DashboardController;

// Controllers ADMIN
use App\Http\Controllers\Api\Admin\UserController;
use App\Http\Controllers\Api\Admin\OrderController;

/*
|--------------------------------------------------------------------------
| 1. PUBLIC ROUTES (Akses Terbuka)
|--------------------------------------------------------------------------
*/

// Auth
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login'])->name('login');

// 🔥 OBAT (UPDATE: Pakai apiResource agar POST/PUT/DELETE tersedia)
Route::apiResource('/medicines', MedicineController::class);

// 🔥 DOKTER (Sudah benar pakai apiResource)
Route::apiResource('/doctors', DoctorController::class);

// 🔥 ARTIKEL (Sudah benar pakai apiResource)
Route::apiResource('/articles', ArticleController::class); 

// Kategori
Route::apiResource('/categories', CategoryController::class);

/*
|--------------------------------------------------------------------------
| 2. PROTECTED ROUTES (auth:sanctum)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {

    // Cek User Login
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Logout
    Route::post('/logout', [AuthController::class, 'logout']);

    // --- 🛒 KERANJANG ---
    Route::apiResource('/carts', CartController::class);

    // --- 💬 KONSULTASI ---
    Route::post('/consultations', [ConsultationController::class, 'store']);
    Route::get('/consultations', [ConsultationController::class, 'index']);
    Route::put('/consultations/{id}', [ConsultationController::class, 'update']);

    // --- 🔐 ADMIN ONLY AREA ---
    Route::middleware('admin')->group(function () {
        
        // Admin Dashboard Stats
        Route::get('/admin/dashboard', [DashboardController::class, 'index']);

        // Register Admin Baru
        Route::post('/admin/register', [AuthController::class, 'registerAdmin']);

        // Management User
        Route::apiResource('/admin/users', UserController::class);

            // Management Order
        Route::apiResource('/admin/orders', OrderController::class);
        Route::get('/admin/orders', [OrderController::class, 'index']);
        Route::put('/admin/orders/{id}', [OrderController::class, 'update']);

        // Catatan: Route Master Data (Medicines/Doctors) sudah di-handle 
        // di atas oleh apiResource publik agar React gampang memanggilnya.
    });

});