<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    use HasFactory;

    protected $guarded = [];

    // Relasi ke User
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relasi ke Medicine (PENTING BIAR BISA TAMPIL GAMBAR & HARGA)
    public function medicine()
    {
        return $this->belongsTo(Medicine::class);
    }
}