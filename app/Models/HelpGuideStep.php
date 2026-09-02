<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HelpGuideStep extends Model
{
    use HasFactory;

    protected $fillable = [
        'help_guide_id',
        'step_number',
        'title',
        'description',
        'image_path',
        'tip',
    ];

    protected $casts = [
        'step_number' => 'integer',
    ];

    public function guide()
    {
        return $this->belongsTo(HelpGuide::class, 'help_guide_id');
    }
}
