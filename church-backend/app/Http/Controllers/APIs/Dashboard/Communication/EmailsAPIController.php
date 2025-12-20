<?php

namespace App\Http\Controllers\APIs\Dashboard\Communication;

use App\Http\Controllers\Controller;
use App\Models\Email;
use App\Models\EmailRecipient;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class EmailsAPIController extends Controller
{
    
    public function __construct(){
        $this->middleware('auth:sanctum');
    }

    public function index(Request $request){
        $emails = Email::with("user")->withCount(['recipients']);
        if(!auth()->user()->can('View Emails')){
            $emails = $emails->where(function($query){
                $query->where('user_id', auth()->user()->id)
                ->orWhereHas('recipients', function($q){
                    $q->where('user_id', auth()->user()->id);
                });
            });
        }
        $emails = $emails->orderBy('created_at', 'DESC')->paginate(20);
        return response()->json(['emails'=>$emails]);
    }
    
    public function addEmail(Request $request)
    {
            $validator = Validator::make($request->all(), [
                'id' => 'required|integer|min:0',
                'recipients.*'=>'integer|exists:users,id',
                'subject' => 'required|string',
                'content' => 'nullable',
            ]);
            if ($validator->fails()) {
                return response()->json(['errors' => $validator->messages()], 400);
            }
            $email = new Email;
            if($request->id > 0){
                $email = Email::find($request->id);
            }
            $email->subject = $request->subject;
            $email->message = $request->content;
            $email->user_id = auth()->user()->id;
            if ($email->save()) {
                //save recipients
                if(!empty($request->recipients)){
                    //$email->recipients()->sync($request->recipients);
                    //send emails
                    foreach($request->recipients as $user_id){
                        $user = User::find($user_id);
                        if($user != null){
                            $recipient = EmailRecipient::where('email_id', $email->id)->where('user_id', $user->id)->first();
                            if($recipient== null){
                                $recipient = new EmailRecipient();
                            }
                            $recipient->email_id = $email->id;
                            $recipient->user_id = $user->id;
                            $recipient->save();
                            $this->sendEmail($user->email, $request->subject, $user->firstname, $user->lastname, $request->content);
                        }
                    }
                }
                return response()->json(['success' => 'Email saved successfully!', "email_id" => $email->id]);
            } else {
                return response()->json(['error' => 'Unable to save email!'], 400);
            }
    }

    public function getEmail(Request $request)
    {
        $email = Email::find($request->id);
        if ($email) {
            return response()->json(['email' => $email], 200);
        } else {
            return response()->json(['error' => 'Email not found'], 404);
        }
    }


    public function sendEmail($email, $subject, $firstname, $lastname, $mess)
    {
        $data = array('name' => $firstname . " " . $lastname, 'mes' => $mess);
        //$site_settings = $this->site_settings;
        $church_name = /*$site_settings != null ? "" . $site_settings->name :*/ "CHURCH APP";
        Mail::send('dashboard.communication.mail', $data, function ($message) use ($email, $subject, $firstname, $lastname, $church_name) {
            $message->to($email, $firstname . " " . $lastname)->subject
            ($subject);
            $message->from('info@happychurchruiru.org', $church_name);
        });
    }
}
