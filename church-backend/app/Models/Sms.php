<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Sms extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = [
        'user_id',
        'message',
        'sent',
        'people_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function recipients(){
        return $this->hasMany(SmsRecipient::class);
    }
    public function people()
    {
        return $this->belongsTo(People::class);
    }
}
