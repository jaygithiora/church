<?php

namespace App\Http\Controllers\APIs\Dashboard\Users;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleAPIController extends Controller
{
    public function __construct(){
        $this->middleware('auth:sanctum');
    }
    
    public function index(Request $request){
        $roles = Role::where('name', 'LIKE', '%'.$request->search.'%')
        ->orderBy('name', 'ASC')->paginate(20);
        return response()->json(['roles'=>$roles]);
    }

    public function addRole(Request $request)
    {
        //\Log::info(json_encode($request->all()));
        //if (auth()->user()->can("Edit Roles") || auth()->user()->can("Add Roles")) {
            $validator = Validator::make($request->all(), [
                'id' => 'required|integer|min:0',
                'name' => 'required|string|unique:roles,name,' . $request->id,
                'can_register'=>'required|integer|min:0|max:1',
                'can_register_business'=>'required|integer|min:0|max:1'
            ]);
            if ($validator->fails()) {
                return response()->json(['errors' => $validator->messages()], 400);
            }
            $role = new Role;
            if ($request->id > 0) {
                $role = Role::findOrFail($request->id);
            }
            $role->name = $request->name;
            //$role->display_name = $request->name;
            $role->guard_name = 'web';
            //$role->can_self_register = $request->can_register;
            //$role->can_create_company = $request->can_register_business;
            if ($role->save()) {
                return response()->json(['success' => 'Role created successfully!']);
            } else {
                return response()->json(['error' => 'Unable to create role'], 401);
            }
        /*} else {
            return response()->json(['error' => 'Permissions to Add/Edit Role Denied'], 401);
        }*/
    }

    public function role(Request $request){
        $role = Role::where('id', $request->id)->first();
        if ($role == null) {
            return redirect()->to('home');
        }
        $permissions = Permission::with([
            'roles' => function ($query) use ($request) {
                $query->where('id', $request->id);
            }
        ])->where("name", 'NOT LIKE', '%permissions%')->get();
        return response()->json(['role'=>$role, 'permissions'=>$permissions]);
    }

    public function addPermissions(Request $request)
    {
        if (Auth::user()->can("Edit Roles") || Auth::user()->can("Add Roles")) {
        //\Log::info($request->all());
            $validator = Validator::make($request->all(), [
                'id' => 'required|integer|exists:roles,id',
                'permissions.*' => 'nullable|integer|exists:permissions,id',
            ]);
            if ($validator->fails()) {
                return response()->json(['errors' => $validator->messages()], 400);
            }

            $permissions = Permission::whereIn('id', $request->permissions != "" ? $request->permissions : [$request->permissions])->pluck("name");
            $role = Role::where('id', $request->id)->first();
            if ($role->syncPermissions($permissions)) {
                return response()->json(['success' => 'Permissions updated successfully!']);
            } else {
                return response()->json(['error' => 'Unable to update permissions'], 401);
            }
        } else {
            return response()->json(['error' => 'Permissions to Add/Edit Role Denied'], 401);
        }
    }

}
