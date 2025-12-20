<?php

namespace App\Http\Controllers\APIs\Dashboard\Settings;

use App\Http\Controllers\Controller;
use App\Models\AgeGroup;
use App\Models\FundSource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AgeGroupSettingsController extends Controller
{
     public function __construct()
    {
        $this->middleware('auth:sanctum');
    }
    public function index(Request $request){
        $age_groups = AgeGroup::where("name", "LIKE", "%".$request->search)->paginate(20);
        return response()->json(['age_groups'=>$age_groups]);
    }

    public function addAgeGroup(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|integer|min:0',
            'name' => 'required|string|unique:age_groups,name,'.$request->id,
            'description'=>'nullable|string',
            'age_from' => 'nullable|integer|min:0',
            'age_to'=>'nullable|integer|gte:age_from'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->messages()], 400);
        }
        $ageGroup = new AgeGroup();
        if ($request->id > 0) {
            $ageGroup = AgeGroup::find($request->id);
        }
        $ageGroup->name = $request->name;
        $ageGroup->description = $request->description;
        $ageGroup->age_from = $request->age_from;
        $ageGroup->age_to = $request->age_to;
        if ($ageGroup->save()) {
            return response()->json(['success' => 'Age Group updated successfully!']);
        } else {
            return response()->json(['error' => 'Unable to update age group'], 401);
        }
    }
}
