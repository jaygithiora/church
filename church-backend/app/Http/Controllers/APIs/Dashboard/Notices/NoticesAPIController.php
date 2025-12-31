<?php

namespace App\Http\Controllers\APIs\Dashboard\Notices;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Notice;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class NoticesAPIController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index(Request $request){

        $notices = Notice::with(['user']);
        if (!Auth::user()->can('View Notices')) {
            $notices = $notices->where('user_id', auth()->user()->id);
        }
        if ($request->date != "") {
            $notices = $notices->where('created_at', $request->date);
        }

        $notices = $notices->paginate(20);
        return response()->json(['notices'=>$notices]);
    }

    public function addNotice(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|integer|min:0',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'notice_date'=>'nullable|date',
            'role'=>'nullable|exists:roles,id',
            'age_group'=>'nullable|exists:age_groups',
            'banner' => 'nullable|image|max:2048',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->messages()], 400);
        }
        $notice = new Notice;
        if($request->id > 0){
            $notice = Notice::find($request->id);
        }
        $notice->title = $request->name;
        $notice->description = $request->description;
        if($request->has('notice_date')){
            $notice->notice_date = Carbon::parse($request->notice_date);
        }
        $notice->user_id = Auth::user()->id;
        $notice->age_group_id = $request->age_group;
        $notice->role_id = $request->role;
        if ($notice->save()) {if ($request->hasFile('banner')) {
                if ($notice->banner) {
                    Storage::disk('public')->delete($notice->banner);
                }
                $path = $request->file('banner')->storeAs(
                    'notices',
                    uniqid() . '.' . $request->banner->extension(),
                    'public'
                );
                /*$path = $request->file('banner')->store(
                        'spiritual/sermons',
                        'public'
                    );*/

                $notice->banner = $path; // store path in DB
                $notice->save();
            }
            return response()->json(['success' => "Notice updated successfully!"]);
        } else {
            return response()->json(['error' => 'Unable to buy update notice'], 401);
        }
    }

    public function getNotice(Request $request){
        $notice = Notice::find($request->id);
        if(!$notice){
            return response()->json(['error'=>"Invalid notice id"], 401);
        }
        return response()->json(['notice'=>$notice]);
    }
}
