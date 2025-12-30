<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\MedicineController;
use App\Http\Controllers\Api\DoctorController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ConsultationController;

use App\Http\Controllers\Api\Admin\UserController;
use App\Http\Controllers\Api\Admin\AdminDoctorController;
use App\Http\Controllers\Api\Admin\AdminMedicineController;

/*
|--------------------------------------------------------------------------
| PUBLIC ROUTES
|--------------------------------------------------------------------------
*/
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/medicines', [MedicineController::class, 'index']);
Route::get('/medicines/{id}', [MedicineController::class, 'show']);

Route::get('/doctors', [DoctorController::class, 'index']);
Route::get('/doctors/{id}', [DoctorController::class, 'show']);

Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{id}', [CategoryController::class, 'show']);

/*
|--------------------------------------------------------------------------
| PROTECTED ROUTES (auth:sanctum)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {

    // User info
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Logout
    Route::post('/logout', [AuthController::class, 'logout']);

    // Konsultasi
    Route::post('/consultations', [ConsultationController::class, 'store']);
    Route::get('/consultations', [ConsultationController::class, 'index']);
    Route::put('/consultations/{id}', [ConsultationController::class, 'update']);

    // Dokter CRUD (non-admin) - opsional, jika dokter update sendiri
    Route::middleware('admin')->group(function () {
        // Admin Dashboard
        Route::get('/admin/dashboard', function () {
            return response()->json([
                'doctors' => \App\Models\Doctor::count(),
                'medicines' => \App\Models\Medicine::count(),
                'users' => \App\Models\User::count(),
            ]);
        });

        // Admin User Management
        Route::apiResource('/admin/users', UserController::class);

        // Admin Doctor Management
        Route::apiResource('/admin/doctors', AdminDoctorController::class);

        // Admin Medicine Management
        Route::apiResource('/admin/medicines', AdminMedicineController::class);

        // Admin Category Management
        Route::apiResource('/admin/categories', CategoryController::class);
    });
});

// Admin register (buat admin baru)
Route::post('/admin/register', [AuthController::class, 'registerAdmin']);
