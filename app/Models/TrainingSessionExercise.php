<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class TrainingSessionExercise extends Model
{
    protected $guarded = ['id'];
    public function trainingSession() { return $this->belongsTo(TrainingSession::class); }
}