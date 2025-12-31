<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Permission\Models\Role;

class Notice extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = ['title','description','notice_date',"user_id","age_group_id","role_id", "banner"];

    public function user(){
        return $this->belongsTo(User::class);
    }

    public function age_group(){
        return $this->belongsTo(AgeGroup::class);
    }

    public function role(){
        return $this->belongsTo(Role::class);
    }
}
