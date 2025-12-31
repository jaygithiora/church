<?php

namespace App\Http\Controllers\APIs\Dashboard\OrderOfServices;

use App\Http\Controllers\Controller;
use App\Models\OrderOfService;
use App\Models\Seat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class OrderOfServicesAPIController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function index(Request $request)
    {
        $order_of_services = OrderOfService::with("user")->where('name', 'LIKE', '%' . $request->search . '%')
            ->orderBy('created_at', 'DESC')->paginate(20);
        return response()->json(['order_of_services' => $order_of_services]);
    }

 public function addOrderOfService(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|integer|min:0',
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'banner' => 'nullable|image|max:2048',
            'location' => 'nullable|string|max:255',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'start_time' => 'required|date_format:H:i',
            'end_time'   => 'nullable|date_format:H:i|after:start_time',
            'day'=>'required|integer|between:1,7'
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->messages()], 400);
        }
        $orderOfService = new OrderOfService();
        if ($request->id > 0) {
            $orderOfService = OrderOfService::find($request->id);
        }
        $orderOfService->name = $request->name;
        $orderOfService->description = $request->description;
        //$event->banner = $request->banner;
        $orderOfService->start_time = $request->start_time;
        $orderOfService->end_time = $request->end_time;
        $orderOfService->location = $request->location;
        $orderOfService->longitude = $request->longitude;
        $orderOfService->latitude = $request->latitude;
        $orderOfService->day = $request->day;
        $orderOfService->user_id = auth()->user()->id;
        if ($orderOfService->save()) {
            if ($request->hasFile('banner')) {
                if ($orderOfService->banner) {
                    Storage::disk('public')->delete($orderOfService->banner);
                }
                $path = $request->file('banner')->storeAs(
                    'order-of-services',
                    uniqid() . '.' . $request->banner->extension(),
                    'public'
                );
                /*$path = $request->file('banner')->store(
                        'spiritual/sermons',
                        'public'
                    );*/

                $orderOfService->banner = $path; // store path in DB
                $orderOfService->save();
            }
            return response()->json(['success' => 'Order Of Service saved successfully!'], 200);
        } else {
            return response()->json(['error' => 'Unable to save Order Of Service!'], 400);
        }
    }

    public function getOrderOfService(Request $request){
        $order_of_service = OrderOfService::find($request->id);
        if(!$order_of_service){
            return response()->json(['error'=>'Invalid order id']);
        }
        return response()->json(['order_of_service'=>$order_of_service]);
    }

}