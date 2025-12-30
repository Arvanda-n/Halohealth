<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Medicine;

class AdminMedicineController extends Controller
{
    public function index()
    {
        return Medicine::all();
    }
    // Tambahkan store, show, update, destroy sesuai kebutuhan
}
