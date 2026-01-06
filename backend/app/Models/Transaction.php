<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $fillable = [
        'patient_id',
        'doctor_id',
        'amount',
        'status',
        'payment_method'
    ];
}
