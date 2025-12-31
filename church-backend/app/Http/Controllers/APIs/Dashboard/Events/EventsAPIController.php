<?php

namespace App\Http\Controllers\APIs\Dashboard\Events;

use App\Http\Controllers\Controller;
use App\Models\MyEvent;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class EventsAPIController extends Controller
{
    public function __construct(){
        $this->middleware('auth:sanctum');
    }
    
    public function index(Request $request){
        $events = MyEvent::with("user")->where('name', 'LIKE', '%'.$request->search.'%')
        ->orderBy('name', 'ASC')->paginate(20);
        return response()->json(['events'=>$events]);
    }

    public function addEvent(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|integer|min:0',
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'banner' => 'nullable|image|max:2048',
            'location' => 'nullable|string|max:255',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'from_date' => 'required|date',
            'to_date' => 'required|date',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->messages()], 400);
        }
        $event = new MyEvent;
        if ($request->id > 0) {
            $event = MyEvent::find($request->id);
        }
        $event->name = $request->name;
        $event->description = $request->description;
        //$event->banner = $request->banner;
        $event->from_date = Carbon::parse($request->from_date);
        $event->to_date = Carbon::parse($request->to_date);
        $event->location = $request->location;
        $event->longitude = $request->longitude;
        $event->latitude = $request->latitude;
        $event->user_id = auth()->user()->id;
        if ($event->save()) {
            if ($request->hasFile('banner')) {
                if ($event->banner) {
                    Storage::disk('public')->delete($event->banner);
                }
                $path = $request->file('banner')->storeAs(
                    'events',
                    uniqid() . '.' . $request->banner->extension(),
                    'public'
                );
                /*$path = $request->file('banner')->store(
                        'spiritual/sermons',
                        'public'
                    );*/

                $event->banner = $path; // store path in DB
                $event->save();
            }
            return response()->json(['success' => 'Event saved successfully!'], 200);
        } else {
            return response()->json(['error' => 'Unable to save event!'], 400);
        }
    }

    public function getEvent(Request $request)
    {
        $event = MyEvent::find($request->id);
        if ($event) {
            return response()->json(['event' => $event], 200);
        } else {
            return response()->json(['error' => 'Event not found'], 404);
        }
    }
}
