<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Child extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = [
        'first_name',
        'last_name',
        'date_of_birth',
        'user_id',
        'gender_id',
        'status',
        'location',
        'longitude',
        'latitude'
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function gender()
    {
        return $this->belongsTo(Gender::class);
    }
}
