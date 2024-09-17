<?php


namespace Tests\Unit;

use Tests\TestCase; 

use Illuminate\Http\Request;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\vehicle_fuel_tbl;
use App\Models\vehicle_category_tbl;
use App\Models\policy_cover_model;
use App\Models\vehicle_rate_dis_tbl;
use App\Models\policy_tbl;
use App\Models\vehicle_detail_tbl;
use App\Models\vehicle_document_tbl;


use Illuminate\Support\Facades\Validator;

class PolicyDetailTest extends TestCase
{
    //use RefreshDatabase;
    public function test_policyDetailStore()
    {
        // Run migrations
        $this->artisan('migrate');

        $data = [
            'user_id' => 8,
            'fuel_id' => 10,
            'fuel_type' => trim('Diesel'),
            'vehicle_category' => '6',
            'registration_no' => 'ABC0123',
            'engine_no' => 'EN12543456',
            'chassis_no' => 'CH123255456',
            'vehicle_fuel' => 'Petrol',
            'makeModel' => 'Toyota Corolla',
            'yearOfMake' => 2020,
            'seatingcapacity' => 5,
            'marketValue' => 1000000,
            'vehicle_usage' => 1
        ];

        // Validate the data
        $validator = Validator::make($data, [
            'user_id' => 'required|numeric',
            'fuel_id' => 'required|numeric',
            'fuel_type' => 'required|max:50',
            'vehicle_category' => 'required|string|max:100',
            'registration_no' => 'required|string|max:20',
            'engine_no' => 'required|string|max:20',
            'chassis_no' => 'required|string|max:20',
            'vehicle_fuel' => 'required|string|max:50',
            'makeModel' => 'required|string|max:100',
            'yearOfMake' => 'required|numeric|min:1886|max:' . date('Y'),
            'seatingcapacity' => 'required|numeric|min:1|max:100',
            'marketValue' => 'required|numeric|min:0',
            'vehicle_usage' => 'required|numeric|min:0|max:5',
        ]);

        $this->assertFalse($validator->fails());

        // Assuming these values are defined somewhere or provided by the test
        $policy_id = 1; // Replace with actual value or method to get it
        $category_id = $data['vehicle_category']; // Adjust as needed
        $fuel_id = $data['fuel_id'];
        $usage_id = $data['vehicle_usage'];
        $sum_insured = $data['marketValue'];

        $startdate = date('Y-m-d H:i:s');
        $enddate = date('Y-m-d H:i:s', strtotime('+1 year'));

        // Insert policy
        $add_policy = new policy_tbl();
        $add_policy->policy_sum_insured = $sum_insured;
        $add_policy->policy_start_date = $startdate;
        $add_policy->policy_end_date = $enddate;
        $add_policy->insurance_premium = 0;
        $add_policy->save();

        // Insert vehicle details
        $add_vehicle_detail = new vehicle_detail_tbl();
        $add_vehicle_detail->policy_id = $policy_id;
        $add_vehicle_detail->vehicle_category_id = $category_id;
        $add_vehicle_detail->fuel_id = $fuel_id;
        $add_vehicle_detail->usage_id = $usage_id;
        $add_vehicle_detail->vehicle_reg_no = $data['registration_no'];
        $add_vehicle_detail->vehicle_make = $data['makeModel'];
        $add_vehicle_detail->vehicle_year = $data['yearOfMake'];
        $add_vehicle_detail->engine_no = $data['engine_no'];
        $add_vehicle_detail->chassis_no = $data['chassis_no'];
        $add_vehicle_detail->vehicle_seat_capacity = $data['seatingcapacity'];
        $add_vehicle_detail->save();

        // Assertions
        $this->assertDatabaseHas('policy_tbls', [
            'policy_sum_insured' => $sum_insured,
        ]);

        $this->assertDatabaseHas('vehicle_detail_tbls', [
            'vehicle_reg_no' => $data['registration_no'],
            'vehicle_make' => $data['makeModel'],
        ]);

        $this->assertDatabaseHas('vehicle_fuel_tbls', [
            'fuel_id' => $fuel_id,
        ]);

        $this->assertDatabaseHas('vehicle_category_tbls', [
            'vehicle_category_id' => $category_id,
        ]);
    }

    
    
    
}
