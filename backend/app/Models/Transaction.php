<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'doctor_id', 'amount', 'status', 
        'payment_method', 'type', 'note'
    ];

    // Relasi ke Pasien (User)
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Relasi ke Dokter (User - Cuma Nama)
    public function doctor()
    {
        return $this->belongsTo(User::class, 'doctor_id');
    }

    // 🔥 TAMBAHAN BARU: Relasi ke Profile Dokter (Foto & Spesialis)
    public function doctorData()
    {
        // Menghubungkan doctor_id (user_id di tabel doctors)
        return $this->hasOne(Doctor::class, 'user_id', 'doctor_id');
    }
}