<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class EventAttendance extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = ["user_id", "created_by", "checkin_time", "checkout_time", "my_event_id"];

    public function user(){
        return $this->belongsTo(User::class);
    }

    public function creator(){
        return $this->belongsTo(User::class, "created_by");
    }
    public function myEvent(){
        return $this->belongsTo(MyEvent::class);
    }

}
