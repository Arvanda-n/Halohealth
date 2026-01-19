<?php

namespace App\Models;

use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, HasApiTokens, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'gender',      
        'birth_date',  
        'phone',       
        'height',      
        'weight',
        'role', // 🔥 WAJIB ADA BIAR BISA REGISTER DOKTER
        'image', // 🔥 TAMBAHKAN INI JUGA BIAR FOTO BISA KESIMPAN
    ];    

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // 🔥 TAMBAHKAN RELASI INI (WAJIB BANGET)
    // Biar load('doctor') di api.php bisa jalan
    public function doctor()
    {
        return $this->hasOne(Doctor::class, 'user_id');
    }
}