<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Doctor extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'specialty',
        'license_number',
        'address',
        'gender',
        'birth_date',
        'photo',
        'active',
    ];

    protected $casts = [
        'birth_date' => 'date',
        'active' => 'boolean',
    ];
}
