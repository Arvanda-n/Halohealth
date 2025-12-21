<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    protected $fillable = [
        'title',
        'content',
        'image',
        'thumbnail', 
        'category',  
        'author',
        'published_at'
    ];
}
