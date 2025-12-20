<?php

namespace App\Http\Controllers\APIs\Dashboard\Children;

use App\Http\Controllers\Controller;
use App\Models\ChildCheckIn;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ChildrenCheckinAPIController extends Controller
{
    public function __construct(){
        $this->middleware('auth:sanctum');
    } 
    public function index(Request $request){
        
        $child_checkins = ChildCheckIn::with("child.user", "child_event")->orderBy('created_at', 'DESC')->paginate(20);
        return response()->json(['child_checkins'=>$child_checkins]);
    }
    
    public function addChildCheckin(Request $request){
        //if(auth()->user()->can('Add Queue Statuses') || auth()->user()->can('Add Queue Statuses')){
            $validator = Validator::make($request->all(), [
                'id'=>'required|integer|min:0',
                'child' => 'required|integer|exists:children,id',
                'child_event' => 'required|integer|exists:child_events,id',
                'check_in_time' => 'required|date',
                'check_out_time' => 'nullable|date|after:check_in_time',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->messages()], 400);
            }
            $childCheckIn = new ChildCheckIn();
            if($request->id > 0){
                $childCheckIn = ChildCheckIn::findOrFail($request->id);
            }
            $childCheckIn->child_id = $request->child;
            $childCheckIn->child_event_id = $request->child_event;
            $childCheckIn->check_in_time = Carbon::parse($request->check_in_time);
            if($request->check_out_time)
                $childCheckIn->check_out_time = Carbon::parse($request->check_out_time);
            
            if($childCheckIn->save()){
                return response()->json(['success'=>"Child Check In updated successfully!"]);
            }else{
                return response()->json(['error'=>'Unable to update child check in'], 401);
            }
       /* }else{
            return response()->json(['error'=>'You do not have permission to Add/Edit Queue Statuses']);
        }*/
    }

    public function childCheckIn(Request $request){
        $childCheckIn = ChildCheckIn::with("child", "child_event")
            ->find($request->id);
        if($childCheckIn){
            return response()->json(['child_check_in'=>$childCheckIn]);
        }else{
            return response()->json(['error'=>'Child Check In not found'], 404);
        }
    }
}
