<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property array $letters
 * @property array $pool
 * @property string $maxLengthWords
 * @property Carbon $day
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class WordsPool extends Model
{
    use HasFactory;

    protected $fillable = [
        'letters',
        'pool',
        'maxLengthWords',
        'day',
    ];

    protected $casts = [
        'letters' => 'json',
        'pool' => 'json',
    ];
}
