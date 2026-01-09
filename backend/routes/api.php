<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// =====================
// CONTROLLERS
// =====================

// Auth & Public
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\MedicineController;
use App\Http\Controllers\Api\DoctorController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ConsultationController;
use App\Http\Controllers\Api\CartController; 
use App\Http\Controllers\Api\ArticleController; 
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\TransactionController;
use App\Http\Controllers\Api\ChatController;
use App\Http\Controllers\Api\HealthCategoryController;
use App\Http\Controllers\Api\HealthServiceController;

// Admin Namespace
use App\Http\Controllers\Api\Admin\UserController;
use App\Http\Controllers\Api\Admin\OrderController;

/*
|--------------------------------------------------------------------------
| 1. PUBLIC ROUTES
|--------------------------------------------------------------------------
*/

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login'])->name('login');

// Resources Master Data
Route::apiResource('/medicines', MedicineController::class);
Route::apiResource('/doctors', DoctorController::class);
Route::apiResource('/articles', ArticleController::class); 
Route::apiResource('/categories', CategoryController::class);

// Fitur Beranda Public
Route::get('/health-categories', [HealthCategoryController::class, 'index']);
Route::get('/health-services', [HealthServiceController::class, 'index']);

/*
|--------------------------------------------------------------------------
| 2. PROTECTED ROUTES (auth:sanctum)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {

    // User Profile & Logout
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/logout', [AuthController::class, 'logout']);

    // --- 🛒 KERANJANG ---
    Route::apiResource('/carts', CartController::class);

    // --- 💬 KONSULTASI & CHAT ---
    Route::post('/consultations', [ConsultationController::class, 'store']);
    Route::get('/consultations', [ConsultationController::class, 'index']);
    Route::put('/consultations/{id}', [ConsultationController::class, 'update']);
    
    Route::post('/chat/send', [ChatController::class, 'send']);
    Route::get('/chat/{userId}', [ChatController::class, 'conversation']);

    // --- 💳 TRANSAKSI (USER) ---
    Route::post('/transactions', [TransactionController::class, 'store']);
    Route::get('/transactions/history', [TransactionController::class, 'history']); // Fitur History User

    /*
    |--------------------------------------------------------------------------
    | 3. ADMIN ONLY AREA
    |--------------------------------------------------------------------------
    */
    Route::middleware('admin')->group(function () {
        
        // Dashboard Stats
        Route::get('/admin/dashboard', [DashboardController::class, 'index']);

        // --- MANAGEMENT USER ---
        // Override index user agar bisa filter admin vs patient
        // (Pastikan method indexAdmin ada di UserController)
        Route::get('/admin/users', [UserController::class, 'indexAdmin']); 
        Route::apiResource('/admin/users', UserController::class); // Fallback resource
        
        Route::post('/admin/register', [AuthController::class, 'registerAdmin']);
        Route::post('/admin/create', [AuthController::class, 'createAdmin']);

        // --- TRANSAKSI & BOOKING (PENTING!) ---
        
        // 1. Verifikasi Pembayaran (Update Status: Pending -> Success)
        Route::put('/admin/transactions/{id}', [TransactionController::class, 'update']);
        
        // 2. Booking Dokter (Ambil dari transaksi yang sudah sukses)
        Route::get('/admin/bookings', [TransactionController::class, 'bookings']);
        
        // 3. List Semua Transaksi
        Route::get('/admin/transactions', [TransactionController::class, 'index']);

        // --- MANAGEMENT LAINNYA ---
        Route::apiResource('/admin/orders', OrderController::class);

        // Health Management (Admin Access)
        Route::post('/health-categories', [HealthCategoryController::class, 'store']);
        Route::post('/health-services', [HealthServiceController::class, 'store']);
    });
});

// Admin Login Manual (Jika tidak via AuthController)
Route::post('/admin/login', [App\Http\Controllers\Api\AdminController::class, 'login']);