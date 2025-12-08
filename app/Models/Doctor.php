<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Doctor extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'specialization',
        'experience_years',
        'consultation_fee',
        'is_online'
    ];

    // Relasi: Dokter itu punya data User (Nama, No HP)
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

