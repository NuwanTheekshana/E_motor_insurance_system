<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\policy_tbl;
use App\Models\customer_detail_tbl;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Response;

class PolicyCustomerController extends Controller
{
    function PolicyCustomers(Request $request) {

        $validator = Validator::make($request->all(), [
            'policy_id' => 'required|numeric',
            'fname' => 'required|max:50',
            'lname' => 'required|max:50',
            'nic' => 'required|max:20',
            'address' => 'required|max:255',
            'email' => 'required|email|max:100|unique:customer_detail_tbls',
            'contact_no' => 'required|max:10',
        ]);

        if ($validator->fails()) {
            return response()->json([
                    'status' => 'error',
                    'errors' => $validator->errors()
            ], 422);
        }

        $policy_id = $request->policy_id;

        $update_policy = policy_tbl::find($policy_id);
        $update_policy->policy_status = 3;
        $update_policy->save();
        
        $add_customer = new customer_detail_tbl();
        $add_customer->policy_id = $policy_id;
        $add_customer->NIC = $request->nic;
        $add_customer->fname = $request->fname;
        $add_customer->lname = $request->lname;
        $add_customer->address = $request->address;
        $add_customer->email = $request->email;
        $add_customer->contact_no = $request->contact_no;
        $add_customer->save();

        return Response::json([
            'status' => 'success',
            'message' => 'Policy customer details added successfully',
            'policy_id' => $request->policy_id
        ], 200);
    }
}
