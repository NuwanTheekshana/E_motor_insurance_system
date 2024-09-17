<?php

namespace Tests\Unit;

use Tests\TestCase; 
use Illuminate\Http\Request;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\policy_cover_model;
use Illuminate\Support\Facades\Validator;

class PolicyCoverTest extends TestCase
{
    //use RefreshDatabase;
    public function test_PolicyCoverStore()
    {
        $this->artisan('migrate');

        $data = [
            'user_id' => 8,
            'cover_name' => trim('THIRD PARTY PROPERTY DAMAGE'),
            'cover_amount' => '500000',
            'cover_sys_amount' => '600'
        ];

        $validator = Validator::make($data, [
            'user_id' => 'required|numeric',
            'cover_name' => 'required|max:50',
            'cover_amount' => 'required|numeric',
            'cover_sys_amount' => 'required|numeric'
        ]);

        $this->assertFalse($validator->fails());

        $add_policy_cover = new policy_cover_model();
        $add_policy_cover->user_id = $data['user_id'];
        $add_policy_cover->cover_name = $data['cover_name'];
        $add_policy_cover->cover_amount = $data['cover_amount'];
        $add_policy_cover->cover_sys_amount = $data['cover_sys_amount'];
        $add_policy_cover->save();


        $this->assertDatabaseHas('policy_cover_models', [
            'user_id' => $data['user_id'],
            'cover_name' => $data['cover_name'],
        ]);

    }

    public function test_PolicyCoverUpdate()
    {
        $this->artisan('migrate');
        $id = 13;
        $data = [
            'cover_id' => $id,
            'cover_name' => trim('THIRD PARTY PROPERTY DAMAGE'),
            'cover_amount' => '500000',
            'cover_sys_amount' => '700'
        ];
    
        $validator = Validator::make($data, [
            'cover_id' => 'required|numeric',
            'cover_name' => 'required|max:50',
            'cover_amount' => 'required|numeric',
            'cover_sys_amount' => 'required|numeric'
        ]);
    
        $this->assertFalse($validator->fails());
    
        $update_policy_cover = policy_cover_model::find($id);
        $update_policy_cover->cover_name = $data['cover_name'];
        $update_policy_cover->cover_amount = $data['cover_amount'];
        $update_policy_cover->cover_sys_amount = $data['cover_sys_amount'];
        $update_policy_cover->save();
    
        $this->assertDatabaseHas('policy_cover_models', [
            'cover_id' => $id,
            'cover_name' => $data['cover_name'],
            'cover_amount' => $data['cover_amount'],
            'cover_sys_amount' => $data['cover_sys_amount'],
        ]);
    }
    
    
    public function test_PolicyCoverDelete()
    {
        $this->artisan('migrate');

        $id = '13';

        $delete_policy_cover = policy_cover_model::find($id);
        $delete_policy_cover->status = '0';
        $delete_policy_cover->save();


        $this->assertDatabaseHas('policy_cover_models', [
            'cover_id' => $id,
            'status' => '0',
        ]);

    }
}
