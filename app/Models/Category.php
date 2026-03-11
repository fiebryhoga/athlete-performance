<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $fillable = ['name'];

    // Relasi: Satu Kategori punya banyak Item Tes (di berbagai cabor)
    public function testItems()
    {
        return $this->hasMany(TestItem::class);
    }
}