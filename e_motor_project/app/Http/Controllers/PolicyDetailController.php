<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\vehicle_category_tbl;
use App\Models\vehicle_fuel_tbl;
use App\Models\policy_cover_model;
use App\Models\vehicle_rate_dis_tbl;
use App\Models\policy_tbl;
use App\Models\vehicle_detail_tbl;
use App\Models\vehicle_document_tbl;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Response;

class PolicyDetailController extends Controller
{
    function GetVehicleData(Request $request) {

        $validator = Validator::make($request->all(), [
            'vehicle_category' => 'required|max:50',
            'registration_no' => 'required|max:50',
            'engine_no' => 'required|max:100|unique:vehicle_detail_tbls,engine_no',
            'chassis_no' => 'required|max:100}unique:vehicle_detail_tbls,chassis_no',
            'vehicle_fuel' => 'required|max:50',
            'makeModel' => 'required|max:100',
            'yearOfMake' => 'required|numeric',
            'seatingcapacity' => 'required|numeric',
            'marketValue' => 'required|numeric',
            'vehiclebook' => 'nullable|image|mimes:jpeg,png,jpg|max:5120'
        ]);

        if ($validator->fails()) {
            return response()->json([
                    'status' => 'error',
                    'errors' => $validator->errors()
            ], 422);
        }

        $category_name = $request->vehicle_category;
        $vehicle_fuel = $request->vehicle_fuel;
        $seatingcapacity = $request->seatingcapacity;

        $registration_no = $request->registration_no;
        $engine_no = $request->engine_no;
        $chassis_no = $request->chassis_no;
        $makeModel = $request->makeModel;
        $sum_insured = $request->marketValue;
        $yearOfMake = $request->yearOfMake;
        $fuel_id = vehicle_fuel_tbl::where('fuel_type', $vehicle_fuel)->value('fuel_id');
        $category_id = vehicle_category_tbl::where('vehicle_category_name', $category_name)->value('vehicle_category_id');
        $usage_id = $request->vehicle_usage;

        $pass_parameeter_data = [
            'POL_SI' => $sum_insured,
            'POL_MAKE_YEAR' => $yearOfMake,
            'POL_FUEL' => $fuel_id,
            'POL_VEH_CAT' => $category_id,
            'POL_VEH_USAGE' => $usage_id
        ];

        $predicted_covers = $this->cover_prediction($pass_parameeter_data);
        $insurance_Premium_covers = $this->premium_calculation($predicted_covers, $seatingcapacity, $sum_insured, $category_id);

        $responseData = $insurance_Premium_covers->getData(true);

        $motorgurd_premium = $responseData["motorgurd_premium"];
        $motorgurd_xtra_premium = $responseData["motorgurd_xtra_premium"];
        $third_party_premium = $responseData["third_party_premium"];
        $cover_discription = $responseData["cover_discription"];

        $startdate = date('Y-m-d H:i:s');
        $enddate = date('Y-m-d H:i:s', strtotime('+1 year'));

        //data insert policy data
        $add_policy = new policy_tbl();
        $add_policy->policy_sum_insured  = $sum_insured;
        $add_policy->policy_start_date = $startdate;
        $add_policy->policy_end_date = $enddate;
        $add_policy->insurance_premium = 0;
        $add_policy->save();

        //policy id
        $policy_id = policy_tbl::latest('policy_id')->value('policy_id');

        //insert vehicle details
        $add_vehicle_detail = new vehicle_detail_tbl();
        $add_vehicle_detail->policy_id  = $policy_id;
        $add_vehicle_detail->vehicle_category_id  = $category_id;
        $add_vehicle_detail->fuel_id  = $fuel_id;
        $add_vehicle_detail->usage_id  = $usage_id;
        $add_vehicle_detail->vehicle_reg_no  = $registration_no;
        $add_vehicle_detail->vehicle_make  = $makeModel;
        $add_vehicle_detail->vehicle_year  = $yearOfMake;
        $add_vehicle_detail->engine_no  = $engine_no;
        $add_vehicle_detail->chassis_no  = $chassis_no;
        $add_vehicle_detail->vehicle_seat_capacity  = $seatingcapacity;
        $add_vehicle_detail->save();


        if ($request->hasFile('vehiclebook')) {
            $file = $request->file('vehiclebook');

            $filename = $policy_id.'_vehiclebook_'.time(). '.' . $file->getClientOriginalExtension();
            $destinationPath = public_path('uploads/vehicle_documents/'.$policy_id.'/');
            $file->move($destinationPath, $filename);
        
            $doc_path = '/uploads/vehicle_documents/'.$policy_id.'/'.$filename;

            $add_doc = new vehicle_document_tbl();
            $add_doc->policy_id  = $policy_id;
            $add_doc->doc_name = 'Vehicle Book';
            $add_doc->doc_path = $doc_path;
            $add_doc->save();
        }

        
        


        return Response::json([
            'status' => 'success',
            'message' => 'Vehicle data added successfully',
            'policy_id' => $policy_id,
            'ML_output' => $predicted_covers,
            'cover_discription' => $cover_discription,
            'motorgurd_premium' => $motorgurd_premium,
            'motorgurd_xtra_premium' => $motorgurd_xtra_premium,
            'third_party_premium' => $third_party_premium,
        ], 200);

    }

    private function cover_prediction($inputdata) 
    {
        $jsonData = json_encode($inputdata);

        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_URL => 'http://127.0.0.1:8002/predict_covers/',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => '',
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => 'POST',
            CURLOPT_POSTFIELDS => $jsonData,
            CURLOPT_HTTPHEADER => array(
                'Content-Type: application/json'
            ),
        ));

        $response = curl_exec($curl);

        curl_close($curl);
        $responseData = json_decode($response, true);
        return $responseData;
        //return response()->json($responseData);
        
    }

    private function premium_calculation($predicted_covers, $seatingcapacity, $sum_insured, $category_id)
    {
        $selected_covers = $predicted_covers['selected_covers'] ?? [];
        
        $get_cover_details = policy_cover_model::whereIn('cover_name', $selected_covers)->get();
        $nonzero_covers_total_sys_amount = $get_cover_details->where('cover_sys_amount', '!=', '0.00')->sum('cover_sys_amount');

        $get_basic_rate = vehicle_rate_dis_tbl::where('vehicle_category_id', $category_id)->value('vehicle_rate') ?? 0;
        $get_discount_rate = vehicle_rate_dis_tbl::where('vehicle_category_id', $category_id)->value('vehicle_discount') ?? 0;

        $basic_amount = $sum_insured * $get_basic_rate / 100;
        $basic_with_discount = $basic_amount - ($basic_amount * $get_discount_rate / 100);

        $count_amount = 0;
        $SRCC_status = "";
        $TC_status = "";
        $cover_discription = [];
        
        foreach ($selected_covers as $cover) {
            if ($cover == "FLOOD") {
                $count_amount += $basic_amount * 10 / 100;
                $cover_discription[] = "Flood Cover with Natural Perils (Limit - Sum Insured)";
            }
            if ($cover == "PAB") {
                $pab_sys_amount = policy_cover_model::where('cover_name', 'PAB')->value('cover_sys_amount');
                $pab_cover_amount = policy_cover_model::where('cover_name', 'PAB')->value('cover_amount');
                $count_amount += $pab_sys_amount * $seatingcapacity;
                $cover_discription[] = "Personal Accident Benefit for a Driver and Passengers up to Rs.".$pab_cover_amount."per person";
            }
            if ($cover == "EXCLUDED ITEMS") {
                $exclude_sys_amount = policy_cover_model::where('cover_name', 'EXCLUDED ITEMS')->value('cover_sys_amount');
                $count_amount += $basic_amount * $exclude_sys_amount / 100;
                $cover_discription[] = "Inclusion of Excluded Items (Compulsory Excess - All claims Rs.1,000.00)";
            }
            if ($cover == "HIRE VEHICLES") {
                $hire_sys_amount = policy_cover_model::where('cover_name', 'HIRE VEHICLES')->value('cover_sys_amount');
                $count_amount += $basic_amount * $hire_sys_amount / 100;
                $cover_discription[] = "Hire Vehicle / Hire Driver (Compulsory Excess - All claims Rs.1,000.00)";
            }
            if ($cover == "TOWING CHARGES") {
                $towing_sys_amount = policy_cover_model::where('cover_name', 'TOWING CHARGES')->value('cover_sys_amount');
                $towing_cover_amount = policy_cover_model::where('cover_name', 'TOWING CHARGES')->value('cover_amount');
                $count_amount += $towing_sys_amount;
                $cover_discription[] = "Towing Charges up to Rs. ".$towing_cover_amount;
            }
            if ($cover == "DRIVING TUTION") {
                $tution_sys_amount = policy_cover_model::where('cover_name', 'DRIVING TUTION')->value('cover_sys_amount');
                $count_amount += $tution_sys_amount;
                $cover_discription[] = "Driving Tution -compulsory Excess -All claims Rs. 2,000.00";
            }
            if ($cover == "OMINI BUSES") {
                $omini_sys_amount = policy_cover_model::where('cover_name', 'OMINI BUSES')->value('cover_sys_amount');
                $count_amount += $omini_sys_amount;
                $cover_discription[] = "CTB cover (Compulsory Excess-All claims Rs.1,000.00)";
            }
            if ($cover == "BREAKAGE GLASS") {
                $glass_sys_amount = policy_cover_model::where('cover_name', 'BREAKAGE GLASS')->value('cover_sys_amount');
                $glass_cover_amount = policy_cover_model::where('cover_name', 'BREAKAGE GLASS')->value('cover_amount');
                $count_amount += $glass_sys_amount;
                $cover_discription[] = "Breakage of Windscreen/Window glasses up to Rs. ".$glass_cover_amount;
            }
            if ($cover == "LEARNER DRIVER") {
                $learner_sys_amount = policy_cover_model::where('cover_name', 'LEARNER DRIVER')->value('cover_sys_amount');
                $count_amount += $learner_sys_amount;
                $cover_discription[] = "Learner Rider/Driver Cover ( Compulsory Excess - All claims Rs.2,500.00)";
            }
            if ($cover == "THIRD PARTY PROPERTY DAMAGE") {
                $third_party_sys_amount = policy_cover_model::where('cover_name', 'THIRD PARTY PROPERTY DAMAGE')->value('cover_sys_amount');
                $third_party_cover_amount = policy_cover_model::where('cover_name', 'THIRD PARTY PROPERTY DAMAGE')->value('cover_amount');
                $count_amount += $third_party_sys_amount;
                $cover_discription[] = "Third Party Property Damage up to Rs. ".$third_party_cover_amount;
            }
            if ($cover == "STRIKE RIOT AND CIVIL COMMOTION") {
                $SRCC_status = "Yes";
                $cover_discription[] = "Strike Riot and Civil Commotion (Limit - Sum Insured)";
            }
            if ($cover == "TERRORISM") {
                $TC_status = "Yes";
                $cover_discription[] = "Terrosrism - ( Limit - Sum insured )";
            }
        }

        // Fixed Rates
        $srcc_rate = 0.20;
        $tc_rate = 0.05;
        $admin_fee_rate = 0.30; 
        $admin_fee_rate = 0.30;
        $policy_fee = 500;
        $nbt_rate = 2;
        $vat_rate = 18;
        $xtra_premium_rate = 30;

        $total_premium = $basic_with_discount + $count_amount;
        $srcc_amount = 0;
        $tc_amount = 0;

        if ($SRCC_status == "Yes") {
            $srcc_amount += $sum_insured * $srcc_rate / 100;
        }
        if ($TC_status == "Yes") {
            $tc_amount += $sum_insured * $tc_rate / 100;
        }

        $gross_premium = $total_premium + $srcc_amount + $tc_amount;
        
        $admin_fee = $gross_premium * $admin_fee_rate / 100;
        $nbt = ($gross_premium + $admin_fee + $policy_fee) * $nbt_rate / 100;
        $vat = ($gross_premium + $admin_fee + $policy_fee + $nbt) * $vat_rate / 100;
        $net_premium = $gross_premium + $admin_fee + $policy_fee + $nbt + $vat;

        // third party premium
        $third_party_gross_premium = 1150;
        $third_party_admin_fee = $third_party_gross_premium * $admin_fee_rate / 100;
        $third_party_policy_fee = $policy_fee;
        $third_party_nbt = ($third_party_gross_premium + $third_party_admin_fee + $third_party_policy_fee) * $nbt_rate / 100;
        $third_party_vat = ($third_party_gross_premium + $third_party_admin_fee + $third_party_policy_fee + $third_party_nbt) * $vat_rate / 100;
        $third_party_net_premium = $third_party_gross_premium + $third_party_admin_fee + $third_party_policy_fee + $third_party_nbt + $third_party_vat;
        

        $motorgurd_premium = $net_premium;
        $motorgurd_xtra_premium = $net_premium + ($net_premium * $xtra_premium_rate / 100);
        $third_party_premium = $third_party_net_premium;

        return response()->json([
            'motorgurd_premium' => $motorgurd_premium,
            'motorgurd_xtra_premium' => $motorgurd_xtra_premium,
            'third_party_premium' => $third_party_premium,
            'cover_discription' => $cover_discription
        ]);
    }


}
