<?php

namespace App\Http\Controllers\APIs\Dashboard\Spiritual;

use App\Http\Controllers\Controller;
use App\Models\Prayer;
use App\Models\Sermon;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class SermonsAPIController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }
    public function index(Request $request)
    {
        $sermons = Sermon::with("user");
        if (!auth()->user()->can('View Spiritual')) {
            $sermons = $sermons->where('user_id', Auth::user()->id);
        }
        $sermons = $sermons->orderBy('created_at', 'DESC')->paginate(20);
        return response()->json(['sermons' => $sermons]);
    }

    public function addSermon(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|integer|min:0',
            'title' => 'required|string|max:255',
            'sermon' => 'required|string',
            'banner' => 'nullable|image|max:2048',
            'sermondate' => 'required|date',
            'status' => 'required|in:draft,published,archived',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->messages()], 400);
        }
        $sermon = new Sermon;
        if ($request->id > 0) {
            $sermon = Sermon::find($request->id);
        }
        $sermon->title = $request->title;
        $sermon->description = $request->sermon;
        //$sermon->banner = $request->banner;
        $sermon->sermondate = Carbon::parse($request->sermondate);
        $sermon->status = $request->status;
        $sermon->user_id = auth()->user()->id;
        if ($sermon->save()) {
            if ($request->hasFile('banner')) {
                if ($sermon->banner) {
                    Storage::disk('public')->delete($sermon->banner);
                }
                $path = $request->file('banner')->storeAs(
                    'spiritual/sermons',
                    uniqid() . '.' . $request->banner->extension(),
                    'public'
                );
                /*$path = $request->file('banner')->store(
                        'spiritual/sermons',
                        'public'
                    );*/

                $sermon->banner = $path; // store path in DB
                $sermon->save();
            }
            return response()->json(['success' => 'Sermon saved successfully!'], 200);
        } else {
            return response()->json(['error' => 'Unable to save sermon!'], 400);
        }
    }

    public function getSermon(Request $request)
    {
        $sermon = Sermon::find($request->id);
        if ($sermon) {
            return response()->json(['sermon' => $sermon], 200);
        } else {
            return response()->json(['error' => 'Sermon not found'], 404);
        }
    }
}
