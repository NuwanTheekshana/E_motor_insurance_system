<?php

namespace Tests\Unit;

use Tests\TestCase; 
use Illuminate\Http\Request;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\vehicle_rate_dis_tbl;
use Illuminate\Support\Facades\Validator;

class VehicleRateDiscountTest extends TestCase
{
     //use RefreshDatabase;
     public function test_VehicleRateDiscountStore()
     {
         $this->artisan('migrate');
 
         $data = [
             'user_id' => 8,
             'vehicle_category' => 6,
             'vehicle_rate' => 2.25,
             'vehicle_discount' => 45,
         ];
 
         $validator = Validator::make($data, [
            'user_id' => 'required|numeric',
            'vehicle_category' => 'required|numeric',
            'vehicle_rate' => 'required|numeric',
            'vehicle_discount' => 'required|numeric'
        ]);
 
         $this->assertFalse($validator->fails());
 
         $add_vehicle_rate = new vehicle_rate_dis_tbl();
         $add_vehicle_rate->user_id = $data['user_id']; 
         $add_vehicle_rate->vehicle_category_id = $data['vehicle_category']; 
         $add_vehicle_rate->vehicle_rate = $data['vehicle_rate']; 
         $add_vehicle_rate->vehicle_discount = $data['vehicle_discount']; 
         $add_vehicle_rate->save();
 
         $this->assertDatabaseHas('vehicle_rate_dis_tbls', [
             'vehicle_category_id' => $data['vehicle_category'],
         ]);

     }

     public function test_VehicleRateDiscountUpdate()
    {
        $this->artisan('migrate');
        $id = 33;
        $data = [
            'vehicle_rate' => 2.25,
            'vehicle_discount' => 55,
        ];
    
        $validator = Validator::make($data, [
            'vehicle_rate' => 'required|numeric',
            'vehicle_discount' => 'required|numeric'
        ]);
    
        $this->assertFalse($validator->fails());

        $update_vehicle_rate = vehicle_rate_dis_tbl::find($id);
        $update_vehicle_rate->vehicle_rate = $data['vehicle_rate'];
        $update_vehicle_rate->vehicle_discount = $data['vehicle_discount'];
        $update_vehicle_rate->save();
    
        $this->assertDatabaseHas('vehicle_rate_dis_tbls', [
            'vehicle_rate_dis_id' => $id
        ]);
    }

    public function test_VehicleRateDiscountDelete()
    {
        $this->artisan('migrate');

        $id = '33';

        $delete_vehicle_rate = vehicle_rate_dis_tbl::find($id);
        $delete_vehicle_rate->status = '0';
        $delete_vehicle_rate->save();

        $this->assertDatabaseHas('vehicle_rate_dis_tbls', [
            'vehicle_rate_dis_id' => $id,
            'status' => '0',
        ]);

    }
}
