<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class TrainingSession extends Model
{
    protected $guarded = ['id'];

    public function user() { return $this->belongsTo(User::class, 'user_id'); }
    public function coach() { return $this->belongsTo(User::class, 'coach_id'); }
    public function exercises() { return $this->hasMany(TrainingSessionExercise::class)->orderBy('order'); }
}