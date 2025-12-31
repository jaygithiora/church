<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class OrderOfService extends Model
{
    use HasFactory, SoftDeletes;public const DAYS = [
    1 => 'Monday',
    2 => 'Tuesday',
    3 => 'Wednesday',
    4 => 'Thursday',
    5 => 'Friday',
    6 => 'Saturday',
    7 => 'Sunday',
];
    protected $fillable = ["name", 'description', 'location', 'longitude', 'latitude', 'day', 'start_time', 'end_time', 'banner', 'user_id'];

    protected $casts = [
        'start_time' => 'datetime:H:i',
        'end_time'   => 'datetime:H:i',
    ];

    protected $appends = ['day_name'];


public function getDayNameAttribute()
{
    return self::DAYS[$this->day];
}

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
