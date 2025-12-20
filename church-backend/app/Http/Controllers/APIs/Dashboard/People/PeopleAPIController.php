<?php

namespace App\Http\Controllers\APIs\Dashboard\People;

use App\Http\Controllers\Controller;
use App\Models\Person;
use App\Models\PersonMember;
use App\Models\Place;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PeopleAPIController extends Controller
{
    public function __construct(){
        $this->middleware('auth:sanctum');
    }
    
    public function index(Request $request){
        $people = Person::with("age_group", "user", "role")->where('name', 'LIKE', '%'.$request->search.'%')
        ->orderBy('name', 'ASC')->paginate(20);
        return response()->json(['people'=>$people]);
    }

    public function addPerson(Request $request){
        $validator = Validator::make($request->all(), [
            "id"=>"required|integer|min:0",
            "name"=>"required|string|unique:people,name,".$request->id,
            "description"=>"nullable|string",
            "age_group"=>"nullable|exists:age_groups,id",
            "role"=>"nullable|exists:roles,id",
            "user"=>"nullable|exists:users,id",
        ]);

        if($validator->fails()){
            return response()->json(['errors'=>$validator->messages()], 400);
        }

        $person = new Person();
        if($request->id){
            $person = Person::find($request->id);
        }
        $person->name = $request->name;
        $person->description = $request->description;
        $person->age_group_id = $request->age_group;
        $person->role_id = $request->role;
        $person->user_id = $request->user;
        if($person->save()){
            $personMember = PersonMember::where("user_id", $request->user)->where("person_id", $person->id)->first();
            if(!$personMember){
                 $personMember = new PersonMember();
                $personMember->user_id = $request->user;
                $personMember->person_id = $person->id;
                $personMember->save();
            }
            return response()->json(['success'=>"Person added successfully"], 200);
        }else{
            return response()->json(['error'=>"Unable to add person"], 401);
        }
    }


    public function addMembers(Request $request){
        $validator = Validator::make($request->all(), [
            "id"=>"required|integer|exists:people,id",
            "users.*"=>"required|integer|exists:users,id",
        ]);

        if($validator->fails()){
            return response()->json(['errors'=>$validator->messages()], 400);
        }

        foreach($request->users as $user){
            $personMember = PersonMember::where("user_id", $user)->where("person_id", $request->id)->first();
            if(!$personMember){
                 $personMember = new PersonMember();
                $personMember->user_id = $user;
                $personMember->person_id = $request->id;
                $personMember->save();
            }
        }
        return response()->json(['success'=>"Member added successfully"], 200);
    }

    public function getPerson(Request $request){
        $person = Person::with("role","user", "age_group")->find($request->id);
        if(!$person){
            return response()->json(['error'=>"Person not found!"], 400);
        }
        return response()->json(['person'=>$person]);
    }
    
    public function getMembers(Request $request){
        $members = PersonMember::with("user", "person")/*->where('name', 'LIKE', '%'.$request->search.'%')
        ->orderBy('name', 'ASC')*/->paginate(20);
        return response()->json(['members'=>$members]);
    }
    
    public function getPersonMembers(Request $request){
        $members = PersonMember::with("user")/*->where('name', 'LIKE', '%'.$request->search.'%')
        ->orderBy('name', 'ASC')*/->where("person_id", $request->id)->paginate(20);
        return response()->json(['members'=>$members]);
    }

    public function deleteMember(Request $request){
        $validator = Validator::make($request->all(), [
            "id"=>"required|integer|exists:person_members,id",
        ]);

        if($validator->fails()){
            return response()->json(['errors'=>$validator->messages()], 400);
        }
        if(PersonMember::where('id', $request->id)->delete()){
            return response()->json(['success'=>'Member removed successfully'], 200);
        }
        return response()->json(['error'=>'Unable to remove member'], 400);
    }
}
