<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// =====================
// CONTROLLERS
// =====================

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
use App\Http\Controllers\Api\AdminController; 

/*
|--------------------------------------------------------------------------
| 1. PUBLIC ROUTES (Bisa diakses tanpa login)
|--------------------------------------------------------------------------
*/

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login'])->name('login');
Route::post('/admin/login', [AdminController::class, 'login']);

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
| 2. PROTECTED ROUTES (Butuh Login / auth:sanctum)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {

    // 🔥 PERBAIKAN: User Profile & Logout (Memuat relasi doctor)
    Route::get('/user', function (Request $request) {
        // Mengambil data user sekaligus data detail dari tabel doctors
        return $request->user()->load('doctor');
    });
    Route::get('/users/{id}', [UserController::class, 'show']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);

    // --- 🛒 KERANJANG ---
    Route::apiResource('/carts', CartController::class);

    // --- 💬 KONSULTASI ---
    Route::post('/consultations', [ConsultationController::class, 'store']);
    Route::get('/consultations', [ConsultationController::class, 'index']);
    Route::put('/consultations/{id}', [ConsultationController::class, 'update']);
    
    // --- 💬 CHAT ---
    // 1. History Chat (Dashboard)
    Route::get('/chat/history', [ChatController::class, 'getChatHistory']);
    
    // 2. Kirim Pesan
    Route::post('/chat/send', [ChatController::class, 'sendMessage']);
    
    // 3. Ambil Pesan Detail (Wildcard di bawah)
    Route::get('/chat/{user_id}', [ChatController::class, 'getMessages']);


    // --- 💳 TRANSAKSI ---
    Route::post('/transactions', [TransactionController::class, 'store']);
    Route::get('/transactions/history', [TransactionController::class, 'history']); 
    Route::get('/transactions', [TransactionController::class, 'index']); 
    Route::put('/transactions/{id}', [TransactionController::class, 'update']);

    /*
    |--------------------------------------------------------------------------
    | 3. ADMIN ONLY AREA
    |--------------------------------------------------------------------------
    */
    Route::middleware('admin')->group(function () {
        
        // Dashboard Stats
        Route::get('/admin/dashboard', [DashboardController::class, 'index']);

        // --- MANAGEMENT USER ---
        Route::get('/admin/users', [UserController::class, 'indexAdmin']); 
        Route::apiResource('/admin/users', UserController::class); 
        
        Route::post('/admin/register', [AuthController::class, 'registerAdmin']);
        Route::post('/admin/create', [AuthController::class, 'createAdmin']);
        
        // 🔥 TAMBAHAN: Route khusus untuk Admin mendaftarkan Dokter agar role otomatis sesuai
        Route::post('/admin/doctors', [AuthController::class, 'registerDoctor']);

        // --- BOOKING DOKTER ---
        Route::get('/admin/bookings', [TransactionController::class, 'bookings']);
        
        // --- MANAGEMENT LAINNYA ---
        Route::apiResource('/admin/orders', OrderController::class);

        // Health Management
        Route::post('/health-categories', [HealthCategoryController::class, 'store']);
        Route::post('/health-services', [HealthServiceController::class, 'store']);
    });

});