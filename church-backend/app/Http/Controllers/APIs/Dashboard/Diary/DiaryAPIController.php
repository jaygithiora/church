<?php

namespace App\Http\Controllers\APIs\Dashboard\Diary;

use App\Http\Controllers\Controller;
use App\Models\Diary;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class DiaryAPIController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index(Request $request){

        $diaries = Diary::with(['user'])->where('user_id', auth()->user()->id)->where("start_time", ">=", Carbon::parse($request->from_date))
        ->where("end_time", "<=", Carbon::parse($request->to_date))->get();
        return response()->json(['diaries'=>$diaries]);
    }

    public function addDiary(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|integer|min:0',
            'name' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'start_time'=>'nullable|date',
            'end_time'=>'nullable|date|after:start_time',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->messages()], 400);
        }
        $diary = new Diary();
        if($request->id > 0){
            $diary = Diary::find($request->id);
        }
        $diary->name = $request->name;
        $diary->description = $request->description;
        if($request->has('start_time')){
            $diary->start_time = Carbon::parse($request->start_time);
        }
        if($request->has('end_time')){
            $diary->end_time = Carbon::parse($request->end_time);
        }
        $diary->user_id = Auth::user()->id;
        if ($diary->save()) {
            return response()->json(['success' => "Diary updated successfully!"]);
        } else {
            return response()->json(['error' => 'Unable to buy update diary'], 401);
        }
    }

    public function getDiary(Request $request){
        $diary = Diary::find($request->id);
        if(!$diary){
            return response()->json(['error'=>"Invalid diary id"], 401);
        }
        return response()->json(['diary'=>$diary]);
    }
}
