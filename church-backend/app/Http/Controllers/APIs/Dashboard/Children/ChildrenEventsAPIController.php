<?php

namespace App\Http\Controllers\APIs\Dashboard\Children;

use App\Http\Controllers\Controller;
use App\Models\Child;
use App\Models\ChildEvent;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ChildrenEventsAPIController extends Controller
{
    public function __construct(){
        $this->middleware('auth:sanctum');
    }
    public function index(Request $request){

        $events = ChildEvent::orderBy('created_at', 'DESC');
        if(!auth()->user()->can('View Children')){
            $events = $events->where('user_id', Auth::user()->id);
        }
        $events = $events->paginate(20);
        return response()->json(['events'=>$events]);
    }

    public function addChildEvent(Request $request)
    {
        //if (auth()->user()->can('Add Queues') || auth()->user()->can('Edit Queues')) {
            $validator = Validator::make($request->all(), [
                'id' => 'required|integer|min:0',
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'event_date' => 'nullable|date',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->messages()], 400);
            }
            $child = new ChildEvent();
            if ($request->id > 0) {
                $child = ChildEvent::findOrFail($request->id);
            } 
                $child->name = $request->name;
                $child->description = $request->description;
                if($request->event_date)
                    $child->event_date = Carbon::parse($request->event_date);
                else
                    $child->event_date = null;
                $child->user_id = Auth::user()->id;
                if ($child->save()) {
                    return response()->json(['success' => "Child event added successfully!"]);
                } else {
                    return response()->json(['error' => 'Unable to add child event'], 401);
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
