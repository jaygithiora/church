<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SmsRecipient extends Model
{
    use HasFactory,SoftDeletes;
    
    protected $fillable = [
        'user_id',
        'sms_id',
        'sent',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function sms(){
        return $this->belongsTo(Sms::class);
    }
}
