<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HealthCategory extends Model
{
    use HasFactory;

    /**
     * Nama tabel (opsional, tapi aman ditulis)
     */
    protected $table = 'health_categories';

    /**
     * Kolom yang boleh diisi (mass assignment)
     */
    protected $fillable = [
        'name',
        'icon'
    ];

    /**
     * Kolom yang disembunyikan (opsional)
     */
    protected $hidden = [];

    /**
     * Casting tipe data (opsional)
     */
    protected $casts = [
        'id' => 'integer',
    ];
}
