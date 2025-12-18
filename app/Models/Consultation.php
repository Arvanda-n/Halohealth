<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Consultation extends Model
{
    protected $fillable = ['user_id','doctor_id','question','answer','status'];
    public function doctor() {
        return $this->belongsTo(Doctor::class);
    }
    public function user() {
        return $this->belongsTo(User::class);
    }
}
