<?php

namespace App\Http\Controllers\APIs\Dashboard\Settings;

use App\Http\Controllers\Controller;
use App\Models\PaymentMode;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PaymentModeSettingsController extends Controller
{
     public function __construct()
    {
        $this->middleware('auth:sanctum');
    }
    public function index(Request $request){
        $payment_modes = PaymentMode::where("name", "LIKE", "%".$request->search)->paginate(20);
        return response()->json(['payment_modes'=>$payment_modes]);
    }

    public function addPaymentMode(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|integer|min:0',
            'name' => 'required|string|unique:payment_modes,name,'.$request->id,
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->messages()], 400);
        }
        $paymentMode = new PaymentMode();
        if ($request->id > 0) {
            $paymentMode = PaymentMode::find($request->id);
        }
        $paymentMode->name = $request->name;
        $paymentMode->description = $request->description;
        if ($paymentMode->save()) {
            return response()->json(['success' => 'Payment Mode updated successfully!']);
        } else {
            return response()->json(['error' => 'Unable to update payment mode'], 401);
        }
    }
}
