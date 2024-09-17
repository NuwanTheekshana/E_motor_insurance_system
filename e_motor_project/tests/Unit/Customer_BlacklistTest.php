<?php

namespace Tests\Unit;

use Tests\TestCase; 
use Illuminate\Http\Request;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\blacklist_customer_tbl;
use Illuminate\Support\Facades\Validator;

class Customer_BlacklistTest extends TestCase
{
    public function test_BlacklistCustomersStore()
    {
        $this->artisan('migrate');

        $data = [
            'user_id' => 8,
            'nic' => trim('961582878V'),
            'name' => trim('Test 1'),
        ];

        $validator = Validator::make($data, [
            'user_id' => 'required|numeric',
            'nic' => 'required|max:20',
            'name' => 'required|max:255'
        ]);

        $this->assertFalse($validator->fails());

        $add_blacklist_customer = new blacklist_customer_tbl();
        $add_blacklist_customer->user_id = $data['user_id'];
        $add_blacklist_customer->NIC = $data['nic'];
        $add_blacklist_customer->name = $data['name'];
        $add_blacklist_customer->save();


        $this->assertDatabaseHas('blacklist_customer_tbls', [
            'user_id' => $data['user_id'],
            'nic' => $data['nic'],
            'name' => $data['name'],
        ]);

    }

    public function test_BlacklistCustomersShow()
    {
        $blacklist_customers = blacklist_customer_tbl::where('status', '1')->get();

        $this->assertTrue(true);
    }

    public function test_BlacklistCustomersUpdate()
    {
        $this->artisan('migrate');
        $id = 3;
        $data = [
            'nic' => trim('961581878V'),
            'name' => trim('Nuwan Theekshana Wickramarchchi'),
        ];

        $validator = Validator::make($data, [
            'nic' => 'required|max:20',
            'name' => 'required|max:255'
        ]);
    
        $this->assertFalse($validator->fails());

        $update_blacklist_customer = blacklist_customer_tbl::find($id);
        $update_blacklist_customer->nic = $data['nic'];
        $update_blacklist_customer->name = $data['name'];
        $update_blacklist_customer->save();
    
        $this->assertDatabaseHas('blacklist_customer_tbls', [
            'blacklist_cus_id' => $id
        ]);
    }
    
    public function test_BlacklistCustomersDelete()
    {
        $this->artisan('migrate');

        $id = '3';

        $delete_blacklist_customer = blacklist_customer_tbl::find($id);
        $delete_blacklist_customer->status = '0';
        $delete_blacklist_customer->save();


        $this->assertDatabaseHas('blacklist_customer_tbls', [
            'blacklist_cus_id' => $id,
            'status' => '0',
        ]);

    }
}
