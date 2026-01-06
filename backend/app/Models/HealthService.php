<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HealthService extends Model
{
    use HasFactory;

    /**
     * Nama tabel
     */
    protected $table = 'health_services';

    /**
     * Kolom yang boleh diisi
     */
    protected $fillable = [
        'title',
        'subtitle',
        'icon',
        'route'
    ];

    /**
     * Casting tipe data
     */
    protected $casts = [
        'id' => 'integer',
    ];
}
