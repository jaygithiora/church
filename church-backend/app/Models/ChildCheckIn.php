<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ChildCheckIn extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = [
        'child_id',
        'child_event_id',
        'check_in_time',
        'check_out_time'
    ];

    public function child()
    {
        return $this->belongsTo(Child::class);
    }
    public function child_event()
    {
        return $this->belongsTo(ChildEvent::class);
    }
}
