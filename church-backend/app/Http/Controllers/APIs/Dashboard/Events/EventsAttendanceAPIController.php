<?php

namespace App\Http\Controllers\APIs\Dashboard\Events;

use App\Http\Controllers\Controller;
use App\Models\EventAttendance;
use App\Models\SaccoUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class EventsAttendanceAPIController extends Controller
{
    public function __construct(){
        $this->middleware('auth:sanctum');
    }
    
    public function index(Request $request){
        $attendances = EventAttendance::with(['user', 'myEvent', 'creator'])->whereHas('user',function($query) use($request){
            $query->where('firstname', 'LIKE', '%'.$request->search.'%')
            ->orWhere('lastname', 'LIKE', '%'.$request->search.'%')
            ->orWhere('email', 'LIKE', '%'.$request->search.'%')
            ->orWhere('phone', 'LIKE', '%'.$request->search.'%');
        })
        ->orderBy('created_at', 'DESC')->paginate(20);
        return response()->json(['attendances'=>$attendances]);
    }

    public function addAttendance(Request $request){
        $validator = Validator::make($request->all(), [
            "id"=>'required|integer|min:0',
            "user"=>'required|exists:users,id',
            "event"=>"required|exists:events,id",
            "check_in_time"=>"required|date",
            "check_out_time"=>"nullable|date|gte:check_in_time",
        ]);
        if($validator->fails()){
            return response()->json(['errors'=>$validator->messages()], 400);
        }
        if(EventAttendance::where("my_event_id", $request->event)->where("user_id", $request->user)->where("id", "<>", $request->id)->exists()){
            return response()->json(['error'=>'User already in attendance'], 401);
        }
        $eventAttendance = new EventAttendance();
        if($request->id > 0){
            $eventAttendance = EventAttendance::find($request->id);
        }
        $eventAttendance->my_event_id = $request->event;
        $eventAttendance->user_id = $request->user;
        $eventAttendance->created_by = auth()->user()->id;
        $eventAttendance->checkin_time = $request->check_in_time;
        $eventAttendance->checkout_time = $request->check_out_time;
        if($eventAttendance->save()){
            return response()->json(['success'=>'Attendance Successfully saved']);
        }else{
            return response()->json(['error'=>'Unable to add attendance'], 401);
        }
    }
}
