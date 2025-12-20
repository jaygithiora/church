<?php

namespace App\Http\Controllers\APIs\Dashboard\Children;

use App\Http\Controllers\Controller;
use App\Models\Child;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ChildrenAPIController extends Controller
{
    public function __construct(){
        $this->middleware('auth:sanctum');
    }
    public function index(Request $request){

        $children = Child::with(['user', 'gender']);
        if(!auth()->user()->can('View Children')){
            $children = $children->where('user_id', Auth::user()->id);
        }
        $children = $children->orderBy('created_at', 'DESC')->paginate(20);
        return response()->json(['children'=>$children]);
    }

    public function addChild(Request $request)
    {
        //if (auth()->user()->can('Add Queues') || auth()->user()->can('Edit Queues')) {
            $validator = Validator::make($request->all(), [
                'id' => 'required|integer|min:0',
                'firstname' => 'required|string|max:255',
                'lastname' => 'required|string|max:255',
                'user'=>'required|integer|exists:users,id',
                'date_of_birth' => 'required|date',
                'gender' => 'required|integer|exists:genders,id',
                'location' => 'nullable|string|max:255',
                'longitude' => 'nullable|numeric|min:-180|max:180',
                'latitude' => 'nullable|numeric|min:-90|max:90',
                'status' => 'required|integer|in:0,1',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->messages()], 400);
            }
            $child = new Child();
            if ($request->id > 0) {
                $child = Child::findOrFail($request->id);
            } 
                $child->first_name = $request->firstname;
                $child->last_name = $request->lastname;
                $child->date_of_birth = Carbon::parse($request->date_of_birth);
                $child->gender_id = $request->gender;
                $child->location = $request->location;
                $child->longitude = $request->longitude;
                $child->latitude = $request->latitude;
                $child->status = $request->status;
                $child->user_id = $request->user;
                if ($child->save()) {
                    return response()->json(['success' => "Child added successfully!"]);
                } else {
                    return response()->json(['error' => 'Unable to add child'], 401);
                }
        /*} else {
            return response()->json(['error' => 'You do not have permissione to Add/Edit Queues'], 401);
        }*/
    }

    public function getChild(Request $request){
        $child = Child::where('id', $request->id)->with(['user', 'gender'])->first();
        if($child == null){
            return response()->json(['error'=>'Invalid child ID'], 401);
        }
        return response()->json(['child'=>$child]);
    }
}
