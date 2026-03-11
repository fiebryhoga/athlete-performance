<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sport extends Model
{
    protected $fillable = ['name', 'description'];

    // Relasi: Satu Cabor punya banyak Atlet
    public function athletes()
    {
        return $this->hasMany(User::class);
    }

    public function users()
    {
        return $this->hasMany(User::class);
    }

    // Relasi: Satu Cabor punya banyak Item Tes
    public function testItems()
    {
        return $this->hasMany(TestItem::class);
    }
}