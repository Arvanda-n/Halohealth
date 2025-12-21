<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\MedicineController;
use App\Http\Controllers\Api\TransactionController;
use App\Http\Controllers\ArticleController;

// ================= PUBLIC ROUTES =================
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Public medicines
Route::get('/medicines', [MedicineController::class, 'index']);
Route::get('/medicines/{id}', [MedicineController::class, 'show']);

// Public articles (cukup pakai ini, tidak perlu route manual lagi)
Route::apiResource('/articles', ArticleController::class)
    ->only(['index', 'show']);


// ================= PROTECTED ROUTES =================
Route::middleware('auth:sanctum')->group(function () {

    // Cek user login
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Logout
    Route::post('/logout', [AuthController::class, 'logout']);

    // ================= TRANSACTIONS (PASIEN) =================
    // Buat transaksi / checkout
    Route::post('/transactions', [TransactionController::class, 'store']);

    // Lihat riwayat transaksi user login
    Route::get('/transactions', [TransactionController::class, 'index']);


    // ================= ADMIN ONLY =================
    Route::middleware('admin')->group(function () {

        // Medicines (Admin)
        Route::post('/medicines', [MedicineController::class, 'store']);
        Route::put('/medicines/{id}', [MedicineController::class, 'update']);
        Route::delete('/medicines/{id}', [MedicineController::class, 'destroy']);

        // Konfirmasi transaksi (simulasi pembayaran)
        Route::put(
            '/transactions/{id}/success',
            [TransactionController::class, 'updateStatus']
        );
    });
});
