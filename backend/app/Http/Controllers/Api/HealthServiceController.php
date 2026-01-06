<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HealthService;
use Illuminate\Http\Request;

class HealthServiceController extends Controller
{
    // GET /api/health-services
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => HealthService::all()
        ]);
    }

    // POST /api/health-services
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'subtitle' => 'required|string',
            'icon' => 'nullable|string',
            'route' => 'required|string',
        ]);

        $service = HealthService::create([
            'title' => $request->title,
            'subtitle' => $request->subtitle,
            'icon' => $request->icon,
            'route' => $request->route,
        ]);

        return response()->json([
            'success' => true,
            'data' => $service
        ], 201);
    }
}
