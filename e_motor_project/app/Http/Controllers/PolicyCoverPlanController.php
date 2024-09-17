<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\policy_tbl;
use App\Models\policy_cover_model;
use App\Models\policy_cover_details_tbl;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Response;


class PolicyCoverPlanController extends Controller
{
    function PolicyCoverPlan(Request $request) {

        $validator = Validator::make($request->all(), [
            'policy_id' => 'required|numeric',
            'insurance_premium' => 'required|numeric',
            'product' => 'required|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json([
                    'status' => 'error',
                    'errors' => $validator->errors()
            ], 422);
        }

        $policy_id = $request->policy_id;
        $insurance_premium = $request->insurance_premium;
        $product = $request->product;
        $selected_covers = $request->selected_covers;

        $update_policy = policy_tbl::find($policy_id);
        $update_policy->insurance_premium = $insurance_premium;
        $update_policy->product = $product;
        $update_policy->policy_status = 2;
        $update_policy->save();

        if ($request->product != "ThirdParty") {
            foreach ($selected_covers as $key => $value) {
                $findid = policy_cover_model::where('cover_name', $value)->value('cover_id');

                $add_policy_covers = new policy_cover_details_tbl();
                $add_policy_covers->policy_id = $policy_id;
                $add_policy_covers->cover_id = $findid;
                $add_policy_covers->save();
            }
        }

        return Response::json([
            'status' => 'success',
            'message' => 'Vehicle cover plan selected successfully',
            'policy_id' => $policy_id
        ], 200);
    }
}
