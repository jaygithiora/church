<?php

namespace App\Http\Controllers\APIs\Dashboard\Spiritual;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class TestimonialsAPIController extends Controller
{
    
    public function __construct(){
        $this->middleware('auth:sanctum');
    }
    public function index(Request $request){
        $testimonials = Testimonial::with("user");
        if(!auth()->user()->can('View Spiritual')){
            $testimonials = $testimonials->where('user_id', Auth::user()->id);
        }
        $testimonials = $testimonials->orderBy('created_at', 'DESC')->paginate(20);
        return response()->json(['testimonials'=>$testimonials]);
    }
    
    public function addTestimonial(Request $request)
    {
            $validator = Validator::make($request->all(), [
                'id' => 'required|integer|min:0',
                'testimonial' => 'required|string',
                'status' => 'required|in:draft,published,archived',
            ]);
            if ($validator->fails()) {
                return response()->json(['errors' => $validator->messages()], 400);
            }
            $testimonial = new Testimonial;
            if($request->id > 0){
                $testimonial = Testimonial::find($request->id);
            }
            $testimonial->testimonial = $request->testimonial;
            $testimonial->status = $request->status;
            $testimonial->user_id = auth()->user()->id;
            if ($testimonial->save()) {
                return response()->json(['success' => 'Testimonial saved successfully!'], 200);
            } else {
                return response()->json(['error' => 'Unable to save testimonial!'], 400);
            }
    }

    public function getTestimonial(Request $request)
    {
        $testimonial = Testimonial::find($request->id);
        if ($testimonial) {
            return response()->json(['testimonial' => $testimonial], 200);
        } else {
            return response()->json(['error' => 'Testimonial not found'], 404);
        }
    }
}
