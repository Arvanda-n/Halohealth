<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory; // Tambah ini biar factory jalan
use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    use HasFactory;
    protected $guarded = []; 
}