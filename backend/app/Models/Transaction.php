<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'patient_id',
        'doctor_id',
        'amount',
        'status',
        'payment_method' // Opsional: kalau abang mau simpan metode bayarnya juga
    ];

    /**
     * Relasi ke User sebagai Pasien (Pembeli)
     */
    public function patient()
    {
        return $this->belongsTo(User::class, 'patient_id');
    }

    /**
     * Relasi ke User sebagai Dokter (Penerima)
     * Penting: Ini merujuk ke tabel 'users', karena doctor_id di transaksi = user_id dokter
     */
    public function doctor()
    {
        return $this->belongsTo(User::class, 'doctor_id');
    }
}