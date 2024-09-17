<?php

namespace Tests\Unit;

use Tests\TestCase; 
use Illuminate\Http\Request;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\vehicle_totalloss_backlist_tbl;
use Illuminate\Support\Facades\Validator;


class Vehicl_Blacklist_TotallossTest extends TestCase
{
    public function test_BlacklistTotallossStore()
    {
        $this->artisan('migrate');

        $data = [
            'user_id' => 8,
            'vehicle_reg_no' => trim('WPCAS-1225'),
            'vehicle_chassis_no' => strtoupper(trim('HFHDFHFD64BFGDGH')),
            'vehicle_engine_no' => strtoupper(trim('HNGRF64GG6')),
            'blacklist_type' => trim('Blacklist')
        ];

        $validator = Validator::make($data, [
            'user_id' => 'required|numeric',
            'vehicle_reg_no' => 'required|max:100',
            'vehicle_chassis_no' => 'required|max:255',
            'vehicle_engine_no' => 'required|max:255',
            'blacklist_type' => 'required|max:50',
        ]);

        $this->assertFalse($validator->fails());

        $add_blacklist_vehicle = new vehicle_totalloss_backlist_tbl();
        $add_blacklist_vehicle->user_id = $data['user_id'];
        $add_blacklist_vehicle->vehicle_reg_no = $data['vehicle_reg_no'];
        $add_blacklist_vehicle->vehicle_chassis_no = $data['vehicle_chassis_no'];
        $add_blacklist_vehicle->vehicle_engine_no = $data['vehicle_engine_no'];
        $add_blacklist_vehicle->blacklist_type = $data['blacklist_type'];
        $add_blacklist_vehicle->save();


        $this->assertDatabaseHas('vehicle_totalloss_backlist_tbls', [
            'user_id' => $data['user_id'],
            'vehicle_reg_no' => $data['vehicle_reg_no'],
            'vehicle_chassis_no' => $data['vehicle_chassis_no'],
            'vehicle_engine_no' => $data['vehicle_engine_no'],
            'blacklist_type' => $data['blacklist_type'],
        ]);

    }

    public function test_BlacklistTotallossShow()
    {
        $blacklist_data = vehicle_totalloss_backlist_tbl::where('status', '1')->get();

        $this->assertTrue(true);
    }

    public function test_BlacklistTotallossUpdate()
    {
        $this->artisan('migrate');
        $id = 4;
        $data = [
            'vehicle_reg_no' => trim('WPKS-1216'),
            'vehicle_chassis_no' => strtoupper(trim('RGDVVD5KGNJFA4WEL')),
            'vehicle_engine_no' => strtoupper(trim('MH5VDJNGJE4D')),
            'blacklist_type' => trim('Blacklist')
        ];

        $validator = Validator::make($data, [
            'vehicle_reg_no' => 'required|max:100',
            'vehicle_chassis_no' => 'required|max:255',
            'vehicle_engine_no' => 'required|max:255',
            'blacklist_type' => 'required|max:50',
        ]);
    
        $this->assertFalse($validator->fails());

        $update_blacklist_vehicle = vehicle_totalloss_backlist_tbl::find($id);
        $update_blacklist_vehicle->vehicle_reg_no = $data['vehicle_reg_no'];
        $update_blacklist_vehicle->vehicle_chassis_no = $data['vehicle_chassis_no'];
        $update_blacklist_vehicle->vehicle_engine_no = $data['vehicle_engine_no'];
        $update_blacklist_vehicle->blacklist_type = $data['blacklist_type'];
        $update_blacklist_vehicle->save();
    
        $this->assertDatabaseHas('vehicle_totalloss_backlist_tbls', [
            'totalloss_blacklist_id' => $id
        ]);
    }
    
    public function test_BlacklistTotallossDelete()
    {
        $this->artisan('migrate');

        $id = '4';

        $delete_fuel = vehicle_totalloss_backlist_tbl::find($id);
        $delete_fuel->status = '0';
        $delete_fuel->save();


        $this->assertDatabaseHas('vehicle_totalloss_backlist_tbls', [
            'totalloss_blacklist_id' => $id,
            'status' => '0',
        ]);

    }
    
}
