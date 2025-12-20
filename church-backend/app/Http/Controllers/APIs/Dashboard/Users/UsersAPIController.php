<?php

namespace App\Http\Controllers\APIs\Dashboard\Users;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Spatie\Permission\Models\Role;

class UsersAPIController extends Controller
{
    public function __construct(){
        $this->middleware('auth:sanctum');
    }
    
    public function index(Request $request){

        $users = User::with(['roles']);
        if ($request->sacco > 0) {
            $users = $users->where('sacco_id', $request->sacco);
        }
        if ($request->role > 0) {
            $users = $users->whereHas('roles', function ($query) use ($request) {
                $query->where('id', $request->role);
            });
        }
        if ($request->gender > 0) {
            $users = $users->where('gender_id', $request->gender);
        }
        $users = $users->where(function($query)use($request){
            $query->where('firstname', 'LIKE', '%'.$request->search.'%')
            ->where('lastname', 'LIKE', '%'.$request->search.'%')
            ->where('phone', 'LIKE', '%'.$request->search.'%')
            ->where('email', 'LIKE', '%'.$request->search.'%');
        })->orderBy('created_at', 'DESC')->paginate(20);
        return response()->json(['users'=>$users]);
    }


    public function addUser(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|integer|min:0',
            'firstname' => 'required|string',
            'lastname' => 'required|string',
            'phone' => 'required|string|unique:users,phone,' . $request->id,
            'email' => 'nullable|email|unique:users,email,' . $request->id,
            'role' => 'required|exists:roles,id',
            'status' => 'required|integer|min:0|max:1'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->messages()], 400);
        }

        $role = Role::find($request->role);
        if($role->name != "Super Admin"){
        $user = new User();
        if ($request->id > 0) {
            $user = User::find($request->id);
        } else {
            $user->password = Hash::make("12345678");
        }
        $user->firstname = $request->firstname;
        $user->lastname = $request->lastname;
        $user->email = $request->email;
        $user->phone = $request->phone;
        $user->status = $request->status;
        if ($user->save()) {
            //$user->assignRole($role);
            $user->syncRoles([$role]);
            return response()->json(['success' => 'User updated successfully']);
        } else {
            return response()->json(['error' => 'Unable to update user'], 401);
        }
    }else{
        return response()->json(['error'=>'This account cannot be edited'],401);
    }
    }
/*
    public function user(Request $request){
        $user = User::with('roles', 'banned')->where('id', $request->id)->first();
        return response()->json(['user'=>$user]);
    }

    public function addBan(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|integer|min:0',
            'user_id'=>'required|exists:users,id',
            'message' => 'required|string',
            'status' => 'required|integer|min:0|max:1'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->messages()], 400);
        }

        $banned = new Banned();
        if ($request->id > 0) {
            $banned = Banned::find($request->id);
        }
        $banned->user_id = $request->user_id;
        $banned->message = $request->message;
        $banned->status = $request->status;
        if ($banned->save()) {
            $user = User::find($request->user_id);
            if($banned->status){
                //ban user
                $user->status = false;
            }else{
                $user->status = true;
            }
            $user->save();
            return response()->json(['success' => 'Ban updated successfully']);
        } else {
            return response()->json(['error' => 'Unable to update ban'], 401);
        }
    }*/
}
