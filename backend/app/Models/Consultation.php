<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Consultation extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 
        'doctor_id', 
        'question', 
        'answer', 
        'status'
    ];

    public function doctor() {
        return $this->belongsTo(Doctor::class);
    }

    // Relasi ke User (Pasien)
    public function user() {
        return $this->belongsTo(User::class);
    }
}