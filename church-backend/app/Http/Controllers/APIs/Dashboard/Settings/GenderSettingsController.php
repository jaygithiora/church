<?php

namespace App\Http\Controllers\APIs\Dashboard\Settings;

use App\Http\Controllers\Controller;
use App\Models\Gender;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class GenderSettingsController extends Controller
{
    
     public function __construct()
    {
        $this->middleware('auth:sanctum');
    }
    public function index(Request $request){
        $genders = Gender::where("name", "LIKE", "%".$request->search)->paginate(20);
        return response()->json(['genders'=>$genders]);
    }

    public function addGender(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|integer|min:0',
            'name' => 'required|string|unique:genders,name,'.$request->id,
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->messages()], 400);
        }
        $gender = new Gender();
        if ($request->id > 0) {
            $gender = Gender::find($request->id);
        }
        $gender->name = $request->name;
        if ($gender->save()) {
            return response()->json(['success' => 'Gender updated successfully!']);
        } else {
            return response()->json(['error' => 'Unable to update gender'], 401);
        }
    }
}
