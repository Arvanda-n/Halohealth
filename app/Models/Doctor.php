<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Doctor extends Model
{
     protected $fillable = ['name','specialist','profile','photo','category_id'];
    public function category() {
        return $this->belongsTo(Category::class);
    }
    public function consultations() {
        return $this->hasMany(Consultation::class);
    }

    protected $casts = [
        'birth_date' => 'date',
        'active' => 'boolean',
    ];
}
