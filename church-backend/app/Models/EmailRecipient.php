<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class EmailRecipient extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = [
        'email_id',
        'user_id',
    ];

    public function email()
    {
        return $this->belongsTo(Email::class, 'email_id');
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
