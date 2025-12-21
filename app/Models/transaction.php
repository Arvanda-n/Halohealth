<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $fillable = [
        'user_nid',
        'type',
        'item_id',
        'total_price',
        'status'
    ];
}
