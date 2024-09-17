<?php

namespace Tests\Unit;

use Tests\TestCase; 
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;

class AdminRegistrationTest extends TestCase
{
    //use RefreshDatabase;

    public function test_UserRegistration()
    {
        $this->artisan('migrate');

        $id = trim('99');
        $fname = trim('Nuwan');
        $lname = trim('Athukorala');
        $email = trim('nuwan.athukorala@example.com');
        $password = 'test@12345';

        $data = [
            'user_id' => $id,
            'fname' => $fname,
            'lname' => $lname,
            'email' => $email,
            'password' => $password,
            'password_confirmation' => $password,
        ];

        $validator = Validator::make($data, [
            'fname' => 'required|max:25',
            'lname' => 'required|max:25',
            'email' => 'required|email|max:100|unique:users',
            'password' => 'required|min:8|confirmed',
        ]);

        $this->assertFalse($validator->fails());

        $add_user = new User();
        $add_user->user_id = $id;
        $add_user->fname = $fname;
        $add_user->lname = $lname;
        $add_user->email = $email;
        $add_user->password = Hash::make($password);
        $add_user->save();


        $this->assertDatabaseHas('users', [
            'email' => $email,
        ]);

        $user = User::where('email', $email)->first();
        $this->assertTrue(Hash::check($password, $user->password));
    }

    public function test_UserLogin()
    {
        $this->artisan('migrate');

        $email = trim('nuwan.athukorala@example.com');
        $password = 'test@12345';


        $user = User::where('email', $email)->first();
        $this->assertTrue(Hash::check($password, $user->password));
    }


    public function test_Update_User()
    {
        $this->artisan('migrate');

        $id = '99';
        $fname = trim('Nuwan');
        $lname = trim('Athukorala');
        $email = trim('nuwan.athukorala@example.com');

        $data = [
            'fname' => $fname,
            'lname' => $lname,
            'email' => $email
        ];

        $validator = Validator::make($data, [
            'fname' => 'required|max:25',
            'lname' => 'required|max:25',
            'email' => 'required|email|max:100|unique:users,email,' . $id . ',user_id'
        ]);

        $this->assertFalse($validator->fails());

        $update_user = User::find($id);
        $update_user->fname = $data['fname'];
        $update_user->lname = $data['lname'];
        $update_user->email = $data['email'];
        $update_user->save();


        $this->assertDatabaseHas('users', [
            'user_id' => $id,
            'email' => $email,
        ]);
    }

    public function test_Delete_User()
    {
        $this->artisan('migrate');

        $id = '99';

        $delete_user = User::find($id);
        $delete_user->status = '0';
        $delete_user->save();


        $this->assertDatabaseHas('users', [
            'user_id' => $id,
            'status' => '0',
        ]);
    }

}
