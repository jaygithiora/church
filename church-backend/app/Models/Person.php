<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Permission\Models\Role;

class Person extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = ["name", "description","age_group_id", "user_id", "role_id"];

    public function age_group(){
        return $this->belongsTo(AgeGroup::class);
    }

    public function user(){
        return $this->belongsTo(User::class);
    }

    public function role(){
        return $this->belongsTo(Role::class);
    }
}
