<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PersonMember extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = ["user_id", "person_id"];

    public function person(){
        return $this->belongsTo(Person::class);
    }

    public function user(){
        return $this->belongsTo(User::class);
    }
}
