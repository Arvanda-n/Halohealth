<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
// Import semua Model yang mau dihitung
use App\Models\Doctor;
use App\Models\Medicine;
use App\Models\Article;
use App\Models\User;

class DashboardController extends Controller
{
    public function index()
    {
        // Hitung total data langsung dari Database
        $totalDoctors   = Doctor::count();
        $totalMedicines = Medicine::count();
        $totalArticles  = Article::count();
        $totalUsers     = User::count(); // Termasuk admin & user biasa

        return response()->json([
            'status' => true,
            'message' => 'Data Dashboard Admin',
            'data' => [
                'doctors'   => $totalDoctors,
                'medicines' => $totalMedicines,
                'articles'  => $totalArticles,
                'users'     => $totalUsers
            ]
        ], 200);
    }
}