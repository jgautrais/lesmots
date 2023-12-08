<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WordsPool extends Model
{
    use HasFactory;

    protected $fillable = [
        'letters',
        'pool',
        'maxLengthWords',
        'day',
    ];
}
