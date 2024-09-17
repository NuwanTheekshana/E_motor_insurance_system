<?php

namespace Tests\Unit;

use Tests\TestCase; 
use Illuminate\Http\Request;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\vehicle_fuel_tbl;
use Illuminate\Support\Facades\Validator;

class VehicleFuelTest extends TestCase
{
    //use RefreshDatabase;
    public function test_VehicleFuelStore()
    {
        $this->artisan('migrate');

        $data = [
            'user_id' => 8,
            'fuel_id' => 10,
            'fuel_type' => trim('Diesel'),
        ];

        $validator = Validator::make($data, [
            'user_id' => 'required|numeric',
            'fuel_id' => 'required|numeric',
            'fuel_type' => 'required|max:50',
        ]);

        $this->assertFalse($validator->fails());

        $add_fuel = new vehicle_fuel_tbl();
        $add_fuel->fuel_id = $data['fuel_id'];
        $add_fuel->user_id = $data['user_id'];
        $add_fuel->fuel_type = $data['fuel_type'];
        $add_fuel->save();


        $this->assertDatabaseHas('vehicle_fuel_tbls', [
            'fuel_id' => $data['fuel_id'],
        ]);

    }

    public function test_VehicleFuelUpdate()
    {
        $this->artisan('migrate');
        $id = 10;
        $data = [
            'fuel_type' => trim('Bio'),
        ];
    
        $validator = Validator::make($data, [
            'fuel_type' => 'required|max:50'
        ]);
    
        $this->assertFalse($validator->fails());

        $update_fuel_type = vehicle_fuel_tbl::find($id);
        $update_fuel_type->fuel_type = trim($data['fuel_type']);
        $update_fuel_type->save();
    
        $this->assertDatabaseHas('vehicle_fuel_tbls', [
            'fuel_id' => $id,
            'fuel_type' => $data['fuel_type']
        ]);
    }
    
    public function test_VehicleFuelDelete()
    {
        $this->artisan('migrate');

        $id = '10';

        $delete_fuel = vehicle_fuel_tbl::find($id);
        $delete_fuel->status = '0';
        $delete_fuel->save();


        $this->assertDatabaseHas('vehicle_fuel_tbls', [
            'fuel_id' => $id,
            'status' => '0',
        ]);

    }
}
