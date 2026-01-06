<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// =====================
// CONTROLLERS (SEMUA DI ATAS)
// =====================

// Auth & Public
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\MedicineController;
use App\Http\Controllers\Api\DoctorController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ConsultationController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\TransactionController;
use App\Http\Controllers\Api\ChatController;
use App\Http\Controllers\Api\HealthCategoryController;
use App\Http\Controllers\Api\HealthServiceController;

// Admin
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

// (sementara untuk testing create dokter)
Route::post('/doctors', [DoctorController::class, 'store']);

// Kategori
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{id}', [CategoryController::class, 'show']);

/*
|--------------------------------------------------------------------------
| 2. PROTECTED ROUTES (auth:sanctum)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {

    // Cek user login
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Logout
    Route::post('/logout', [AuthController::class, 'logout']);

    // =====================
    // TRANSAKSI
    // =====================
    Route::post('/transactions', [TransactionController::class, 'store']);

    // =====================
    // CHAT DOKTER
    // =====================
    Route::post('/chat/send', [ChatController::class, 'send']);
    Route::get('/chat/{userId}', [ChatController::class, 'conversation']);

    // =====================
    // CART
    // =====================
    Route::get('/carts', [CartController::class, 'index']);
    Route::post('/carts', [CartController::class, 'store']);
    Route::put('/carts/{id}', [CartController::class, 'update']);
    Route::delete('/carts/{id}', [CartController::class, 'destroy']);

    // =====================
    // CONSULTATION
    // =====================
    Route::post('/consultations', [ConsultationController::class, 'store']);
    Route::get('/consultations', [ConsultationController::class, 'index']);
    Route::put('/consultations/{id}', [ConsultationController::class, 'update']);

    // =====================
    // DOKTER (EDIT SENDIRI)
    // =====================
    Route::put('/doctors/{id}', [DoctorController::class, 'update']);
    Route::delete('/doctors/{id}', [DoctorController::class, 'destroy']);

    /*
    |--------------------------------------------------------------------------
    | 3. ADMIN ONLY
    |--------------------------------------------------------------------------
    */
    Route::middleware('admin')->group(function () {

        // Dashboard
        Route::get('/admin/dashboard', function () {
            return response()->json([
                'doctors' => \App\Models\Doctor::count(),
                'medicines' => \App\Models\Medicine::count(),
                'users' => \App\Models\User::count(),
            ]);
        });

        // Admin Transactions
        Route::get('/admin/transactions', [TransactionController::class, 'index']);

        // Register admin baru
        Route::post('/admin/register', [AuthController::class, 'registerAdmin']);

        // CRUD Admin
        Route::apiResource('/admin/users', UserController::class);
        Route::apiResource('/admin/doctors', AdminDoctorController::class);
        Route::apiResource('/admin/medicines', AdminMedicineController::class);
        Route::apiResource('/admin/categories', CategoryController::class);
    });

});
Route::middleware(['auth:sanctum', 'admin'])->post(
    '/admin/create',
    [AuthController::class, 'createAdmin']
);
Route::post('/admin/login', [App\Http\Controllers\Api\AdminController::class, 'login']);

//fitur beranda
Route::get('/health-categories', [HealthCategoryController::class, 'index']);
Route::post('/health-categories', [HealthCategoryController::class, 'store']);
Route::get('/health-services', [HealthServiceController::class, 'index']);
Route::post('/health-services', [HealthServiceController::class, 'store']);
