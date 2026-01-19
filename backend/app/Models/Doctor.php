<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Doctor extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'specialization',
        'sip',
        'hospital',
        'experience_years', // Sesuai dengan kolom di database Anda
        'image',
        'consultation_fee', // Sesuai dengan kolom di database Anda
    ];

    /**
     * Relasi ke model User.
     * Nama dokter dan data login diambil dari tabel users.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}