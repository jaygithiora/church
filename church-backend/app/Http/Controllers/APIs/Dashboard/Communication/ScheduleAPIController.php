<?php

namespace App\Http\Controllers\APIs\Dashboard\Communication;

use App\Http\Controllers\Controller;
use App\Models\Schedule;
use App\Models\ScheduleRecipient;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ScheduleAPIController extends Controller
{
    
    public function __construct(){
        $this->middleware('auth:sanctum');
    }

    public function index(Request $request){
        $schedules = Schedule::with(['user', 'group'])->withCount('recipients')->paginate(20);
        return response()->json(['schedules'=>$schedules]);
    }

    public function getSchedule(Request $request, $id){
        $schedule = Schedule::with(['user', 'group', 'recipients.user'])->find($id);
        return response()->json(['schedule'=>$schedule]);
    }

    public function addSchedule(Request $request){
        $validator = Validator::make($request->all(), [
            'id'=> 'required|integer|min:0',
            "title"=>"nullable|string",
            "message"=>"required|string",
            "recipients"=>"required|array",
            "type"=>"required|in:sms,email",
            "schedule"=>"required|date",
        ]);
        if($validator->fails()){
            return response()->json(['errors'=>$validator->errors()], 422);
        }
        $schedule = new Schedule();
        if($request->id > 0){
            $schedule = Schedule::find($request->id);
            if(!$schedule){
                return response()->json(['message'=>"Schedule not found"], 404);
            }
        }
        $schedule->title = $request->title;
        $schedule->message = $request->message;
        $schedule->user_id = $request->user()->id;
        $schedule->schedule = Carbon::parse($request->schedule);
        $schedule->type = $request->type;
        if($schedule->save()){//save recipients
                if(!empty($request->recipients)){
                    //$email->recipients()->sync($request->recipients);
                    //send emails
                    foreach($request->recipients as $user_id){
                        $user = User::find($user_id);
                        if($user != null){
                            $recipient = ScheduleRecipient::where('schedule_id', $schedule->id)->where('user_id', $user->id)->first();
                            if($recipient== null){
                                $recipient = new ScheduleRecipient();
                            }
                            $recipient->schedule_id = $schedule->id;
                            $recipient->user_id = $user->id;
                            $recipient->save();
                        }
                    }
                }
            return response()->json(['message'=>"Schedule saved successfully", 'schedule'=>$schedule]);
        }
        return response()->json(['message'=>"Failed to save schedule"], 500);
    }
}
