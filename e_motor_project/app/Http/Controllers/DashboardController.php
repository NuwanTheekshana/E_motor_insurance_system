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

class DashboardController extends Controller
{
    function GetDashboadData() {

        $total_policy_count = DB::select('SELECT COUNT(1) policy_count FROM policy_tbls P 
                                    WHERE P.policy_status = 6');

        $month_policy_count = DB::select('SELECT COUNT(1) policy_count FROM policy_tbls P 
                                    WHERE MONTH(P.policy_start_date) = MONTH(CURRENT_DATE())
                                    AND YEAR(P.policy_start_date) = YEAR(CURRENT_DATE())
                                    AND P.policy_status = 6');
        
        $total_income = DB::select('SELECT sum(vp.payment_amount) TOTAL_INCOME
                                    FROM 
                                    policy_tbls P,
                                    vehicle_detail_tbls D,
                                    vehicle_payment_tbls VP
                                    WHERE P.policy_id = D.policy_id
                                    AND P.policy_id = VP.policy_id
                                    AND P.policy_status = 6');

        $current_month_income = DB::select('SELECT sum(vp.payment_amount) TOTAL_INCOME
                                            FROM 
                                            policy_tbls P,
                                            vehicle_detail_tbls D,
                                            vehicle_payment_tbls VP
                                            WHERE P.policy_id = D.policy_id
                                            AND P.policy_id = VP.policy_id
                                            AND MONTH(VP.transaction_date) = MONTH(CURRENT_DATE())
                                            AND YEAR(VP.transaction_date) = YEAR(CURRENT_DATE())
                                            AND P.policy_status = 6');

        $usage_income = DB::select('SELECT U.usage_type, sum(vp.payment_amount) TOTAL_INCOME
                                    FROM 
                                    policy_tbls P,
                                    vehicle_detail_tbls D,
                                    vehicle_payment_tbls VP,
                                    vehicle_usage_tbls U
                                    WHERE P.policy_id = D.policy_id
                                    AND P.policy_id = VP.policy_id
                                    AND U.usage_id = D.usage_id
                                    AND P.policy_status = 6
                                    GROUP BY U.usage_type');

        $fuel_income = DB::select('SELECT F.fuel_type, sum(vp.payment_amount) TOTAL_INCOME
                                    FROM 
                                    policy_tbls P,
                                    vehicle_detail_tbls D,
                                    vehicle_payment_tbls VP,
                                    vehicle_fuel_tbls F
                                    WHERE P.policy_id = D.policy_id
                                    AND P.policy_id = VP.policy_id
                                    AND F.fuel_id = D.fuel_id
                                    AND P.policy_status = 6
                                    GROUP BY F.fuel_type');


        return Response::json([
            'status' => 'success',
            'message' => 'Dashboad success',
            'usage_income' => $usage_income,
            'fuel_income' => $fuel_income,
            'current_month_income' => $current_month_income,
            'total_income' => $total_income,
            'total_policy_count' => $total_policy_count,
            'month_policy_count' => $month_policy_count
        ], 200);
    }
}
