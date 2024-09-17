<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\policy_tbl;
use App\Models\vehicle_payment_tbl;
use App\Models\customer_detail_tbl;
use App\Models\vehicle_detail_tbl;
use App\Models\verification_tbl;
use App\Models\vehicle_document_tbl;
use App\Models\vehicle_img_tbl;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Response;
use DB;

class ReportController extends Controller
{
    function GetPolicyListReport() {
        $policy_list = DB::select("SELECT P.policy_no,
                                    P.product,
                                    P.policy_sum_insured,
                                    P.policy_start_date,
                                    P.policy_end_date,
                                    CASE P.policy_status
                                        WHEN 1 THEN 'Initial'
                                        WHEN 2 THEN 'Insurance Plan'
                                        WHEN 3 THEN 'Customer Data'
                                        WHEN 4 THEN 'Document and Image Upload'
                                        WHEN 5 THEN 'Verification'
                                        WHEN 6 THEN 'Payment'
                                        WHEN 7 THEN 'Active'
                                        ELSE 'Unknown Status'
                                    END AS policy_status
                                FROM policy_tbls P");
    
        return Response::json([
            'status' => 'success',
            'message' => 'Report success',
            'policy_list' => $policy_list,
        ], 200);
    }
    
}
