<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\policy_tbl;
use App\Models\customer_detail_tbl;
use App\Models\blacklist_customer_tbl;
use App\Models\vehicle_totalloss_backlist_tbl;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Response;
use DB;

class ValidationController extends Controller
{
    function ValidatePolicy($id){
        
        $blacklist_customer_check = DB::select('select count(b.blacklist_cus_id) cuscount from customer_detail_tbls c, blacklist_customer_tbls b where c.NIC = b.NIC and b.status = 1 and c.policy_id = ?', [$id]);
        
        $blacklist_vehicle_check = DB::select('select count(t.totalloss_blacklist_id) vehiclecount from vehicle_detail_tbls v, vehicle_totalloss_backlist_tbls t where (v.vehicle_reg_no = t.vehicle_reg_no or v.engine_no = t.vehicle_engine_no or v.chassis_no = t.vehicle_chassis_no) and t.status = 1  and v.policy_id = ?', [$id]);

        $cuscount = $blacklist_customer_check[0]->cuscount ?? 0;
        $vehiclecount = $blacklist_vehicle_check[0]->vehiclecount ?? 0;
        $blacklist_count = $cuscount + $vehiclecount;

        if ($blacklist_count > 0) {
            $blacklist_status = true;
            $update_policy = policy_tbl::find($id);
            $update_policy->policy_status = 5;
            $update_policy->save();
        }else {
            $blacklist_status = false;
        }

        return Response::json([
            'status' => 'success',
            'message' => 'Policy validation completed.',
            'policy_id' => $id,
            'blacklist_status' => $blacklist_status,
            'blacklist_count' => $blacklist_count
        ], 200);

    }
}
