<?php
namespace App\Http\Controllers\APIs\Dashboard\Communication;

use App\Http\Controllers\Controller;
use App\Models\SeatBooking;
use App\Models\Sms;
use App\Models\SmsRecipient;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SmsApiController extends Controller
{
    public function __construct(){
        $this->middleware('auth:sanctum');
    }
    
    public function index(Request $request){
        $smses = Sms::with("user")->withCount(['recipients']);
        if(!auth()->user()->can('View Sms')){
            $smses = $smses->where(function($query){
                $query->where('user_id', auth()->user()->id)
                ->orWhereHas('recipients', function($q){
                    $q->where('user_id', auth()->user()->id);
                });
            });
        }
        $smses = $smses->orderBy('created_at', 'DESC')->paginate(20);
        return response()->json(['smses'=>$smses]);
    }
    
    public function addSms(Request $request)
    {
            $validator = Validator::make($request->all(), [
                'id' => 'required|integer|min:0',
                'recipients.*'=>'integer|exists:users,id',
                'message' => 'required|string|max:255',
            ]);
            if ($validator->fails()) {
                return response()->json(['errors' => $validator->messages()], 400);
            }
            $sms = new Sms();
            if($request->id > 0){
                $sms = Sms::find($request->id);
            }
            $sms->message = $request->message;
            $sms->user_id = auth()->user()->id;
            if ($sms->save()) {
                //save recipients
                if(!empty($request->recipients)){
                    //$sms->recipients()->sync($request->recipients);
                    //send emails
                    foreach($request->recipients as $user_id){
                        $user = User::find($user_id);
                        if($user != null){
                            $recipient = SmsRecipient::where('sms_id', $sms->id)->where('user_id', $user->id)->first();
                            if($recipient== null){
                                $recipient = new SmsRecipient();
                            }
                            $recipient->sms_id = $sms->id;
                            $recipient->user_id = $user->id;
                            $recipient->save();
                            $this->send($user->phone, $request->message);
                        }
                    }
                }
                return response()->json(['success' => 'Sms saved successfully!']);
            } else {
                return response()->json(['error' => 'Unable to save sms!'], 400);
            }
    }

    public function getSms(Request $request)
    {
        $sms = Sms::find($request->id);
        if ($sms) {
            return response()->json(['sms' => $sms], 200);
        } else {
            return response()->json(['error' => 'Sms not found'], 404);
        }
    }

    public function send($number, $message){
        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_URL => env('SMS_URL'),
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => '',
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => 'GET',
            CURLOPT_POSTFIELDS => 'apikey='.env('SMS_API_KEY').'&partnerID='.env('SMS_PARTNER_ID').'&message=' . urlencode($message) . '&shortcode='.env('SMS_SHORT_CODE').'&mobile='.$number,
            CURLOPT_HTTPHEADER => array(
                'Content-Type: application/x-www-form-urlencoded'
            ),
        )
        );

        $curl_response = curl_exec($curl);

        curl_close($curl);
        $response = json_decode($curl_response, true);
        //\Log::info(json_encode($response).'NUMBER: '.$number);
        return $response;
    }
}
