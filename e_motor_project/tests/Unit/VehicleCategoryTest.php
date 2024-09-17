<?php

namespace Tests\Unit;

use Tests\TestCase; 
use Illuminate\Http\Request;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\vehicle_category_tbl;
use Illuminate\Support\Facades\Validator;

class VehicleCategoryTest extends TestCase
{
    //use RefreshDatabase;
    public function test_VehicleCategoryStore()
    {
        $this->artisan('migrate');

        $data = [
            'user_id' => 8,
            'category_id' => 32,
            'category_name' => strtoupper(trim('Motor Car')),
        ];

        $validator = Validator::make($data, [
            'user_id' => 'required|numeric',
            'category_id' => 'required|numeric',
            'category_name' => 'required|max:50',
        ]);

        $this->assertFalse($validator->fails());

        $add_category = new vehicle_category_tbl();
        $add_category->vehicle_category_id = $data['category_id'];
        $add_category->user_id = $data['user_id'];
        $add_category->vehicle_category_name = $data['category_name'];
        $add_category->save();


        $this->assertDatabaseHas('vehicle_category_tbls', [
            'vehicle_category_id' => $data['category_id'],
        ]);

    }

    public function test_VehicleCategoryUpdate()
    {
        $this->artisan('migrate');
        $id = 32;
        $data = [
            'category_name' => strtoupper(trim('Dual Purpose')),
        ];
    
        $validator = Validator::make($data, [
            'category_name' => 'required|max:50'
        ]);
    
        $this->assertFalse($validator->fails());

        $update_category = vehicle_category_tbl::find($id);
        $update_category->vehicle_category_name = $data['category_name'];
        $update_category->save();
    
        $this->assertDatabaseHas('vehicle_category_tbls', [
            'vehicle_category_id' => $id,
            'vehicle_category_name' => $data['category_name']
        ]);
    }

    public function test_VehicleCategoryDelete()
    {
        $this->artisan('migrate');

        $id = '32';

        $delete_category = vehicle_category_tbl::find($id);
        $delete_category->status = '0';
        $delete_category->save();


        $this->assertDatabaseHas('vehicle_category_tbls', [
            'vehicle_category_id' => $id,
            'status' => '0',
        ]);

    }

}
