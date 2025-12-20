<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Email extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = [
        'user_id',
        'subject',
        'message',
        'sent',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function recipients(){
        return $this->hasMany(EmailRecipient::class);
    }
}
