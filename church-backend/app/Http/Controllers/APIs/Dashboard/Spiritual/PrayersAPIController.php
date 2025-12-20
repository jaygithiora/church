<?php

namespace App\Http\Controllers\APIs\Dashboard\Spiritual;

use App\Http\Controllers\Controller;
use App\Models\Prayer;
use App\Models\Testimonial;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class PrayersAPIController extends Controller
{
    
    public function __construct(){
        $this->middleware('auth:sanctum');
    }
    public function index(Request $request){
        $prayers = Prayer::with("user");
        if(!auth()->user()->can('View Spiritual')){
            $prayers = $prayers->where('user_id', Auth::user()->id);
        }
        $prayers = $prayers->orderBy('created_at', 'DESC')->paginate(20);
        return response()->json(['prayers'=>$prayers]);
    }

    public function addPrayer(Request $request)
    {
            $validator = Validator::make($request->all(), [
                'id' => 'required|integer|min:0',
                'title' => 'required|string|max:255',
                'prayer' => 'required|string',
                'status' => 'required|in:draft,published,archived',
            ]);
            if ($validator->fails()) {
                return response()->json(['errors' => $validator->messages()], 400);
            }
            $prayer = new Prayer;
            if($request->id > 0){
                $prayer = Prayer::find($request->id);
            }
            $prayer->title = $request->title;
            $prayer->description = $request->prayer;
            $prayer->status = $request->status;
            $prayer->user_id = auth()->user()->id;
            if ($prayer->save()) {
                return response()->json(['success' => 'Prayer saved successfully!'], 200);
            } else {
                return response()->json(['error' => 'Unable to save prayer!'], 400);
            }
    }

    public function getPrayer(Request $request)
    {
        $prayer = Prayer::find($request->id);
        if ($prayer) {
            return response()->json(['prayer' => $prayer], 200);
        } else {
            return response()->json(['error' => 'Prayer not found'], 404);
        }
    }
}
