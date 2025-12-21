<?php

class Category extends Model
{
    protected $fillable = ['name', 'description'];
    public function doctors() {
        return $this->hasMany(Doctor::class);
    }
}
