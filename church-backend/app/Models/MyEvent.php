<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MyEvent extends Model
{
    use HasFactory, SoftDeletes;
    protected $table = 'events';
    protected $fillable = ['name','description','location','latitude','longitude','banner','theme','from_date','to_date' , 'user_id'];

    public function user(){
        return $this->belongsTo(User::class);
    }
}
