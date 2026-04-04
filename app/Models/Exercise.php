<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Exercise extends Model
{
    use HasFactory;

    // Tambahkan baris ini agar nama gerakan bisa disimpan
    protected $guarded = ['id'];
}