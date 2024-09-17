<?php

namespace Tests\Unit;

use Tests\TestCase; 
use Illuminate\Http\Request;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\vehicle_usage_tbl;
use Illuminate\Support\Facades\Validator;

class VehicleUsageTest extends TestCase
{
    //use RefreshDatabase;
    public function test_VehicleUsageStore()
    {
        $this->artisan('migrate');

        $data = [
            'user_id' => 8,
            'usage_id' => 6,
            'usage_type' => trim('Private'),
        ];

        $validator = Validator::make($data, [
            'user_id' => 'required|numeric',
            'usage_id' => 'required|numeric',
            'usage_type' => 'required|max:50',
        ]);

        $this->assertFalse($validator->fails());

        $add_usage = new vehicle_usage_tbl();
        $add_usage->usage_id = $data['usage_id'];
        $add_usage->user_id = $data['user_id'];
        $add_usage->usage_type = $data['usage_type'];
        $add_usage->save();


        $this->assertDatabaseHas('vehicle_usage_tbls', [
            'usage_id' => $data['usage_id'],
        ]);

    }

    public function test_VehicleUsageUpdate()
    {
        $this->artisan('migrate');
        $id = 6;
        $data = [
            'usage_type' => trim('Hiring'),
        ];
    
        $validator = Validator::make($data, [
            'usage_type' => 'required|max:50'
        ]);
    
        $this->assertFalse($validator->fails());

        $update_usage = vehicle_usage_tbl::find($id);
        $update_usage->usage_type = $data['usage_type'];
        $update_usage->save();
    
        $this->assertDatabaseHas('vehicle_usage_tbls', [
            'usage_id' => $id,
            'usage_type' => $data['usage_type']
        ]);
    }

    public function test_VehicleUsageDelete()
    {
        $this->artisan('migrate');

        $id = '6';

        $delete_usage = vehicle_usage_tbl::find($id);
        $delete_usage->status = '0';
        $delete_usage->save();


        $this->assertDatabaseHas('vehicle_usage_tbls', [
            'usage_id' => $id,
            'status' => '0',
        ]);

    }
}
