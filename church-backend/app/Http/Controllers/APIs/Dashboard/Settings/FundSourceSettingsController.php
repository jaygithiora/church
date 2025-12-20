<?php

namespace App\Http\Controllers\APIs\Dashboard\Settings;

use App\Http\Controllers\Controller;
use App\Models\FundSource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class FundSourceSettingsController extends Controller
{
     public function __construct()
    {
        $this->middleware('auth:sanctum');
    }
    public function index(Request $request){
        $fund_sources = FundSource::where("name", "LIKE", "%".$request->search)->paginate(20);
        return response()->json(['fund_sources'=>$fund_sources]);
    }

    public function addFundSource(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|integer|min:0',
            'name' => 'required|string|unique:fund_sources,name,'.$request->id,
            'description' => 'nullable|string',
            'fund_type'=>'required|string|in:expense,income'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->messages()], 400);
        }
        $fundSource = new FundSource();
        if ($request->id > 0) {
            $fundSource = FundSource::find($request->id);
        }
        $fundSource->name = $request->name;
        $fundSource->description = $request->description;
        $fundSource->fund_type = $request->fund_type;
        if ($fundSource->save()) {
            return response()->json(['success' => 'Fund Source updated successfully!']);
        } else {
            return response()->json(['error' => 'Unable to update fund source'], 401);
        }
    }
}
