<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Response;

class RegisterController extends Controller
{
    function UserRegistration(Request $request) 
    {
        $messages=[
            'fname.required'=> 'First Name is Required.',
            'fname.max'=> 'First Name may not be greater than 25 characters.',
            'lname.required'=> 'Last Name is Required.',
            'lname.max'=> 'Last Name may not be greater than 25 characters.',
            'email.required'=> 'Email Address is Required.',
            'email.max'=> 'Email Address may not be greater than 100 characters.',
            'email.unique'=> 'Email Address already taken.'
            ];

        $rules = [
            'fname' => 'required|max:25',
            'lname' => 'required|max:25',
            'email' => 'required|email|max:100|unique:users',
            'password' => 'required|min:8|confirmed'
        ];
        
        $validator = Validator::make($request->all(), $rules, $messages);

        if ($validator->fails()) {
            return response()->json([
                    'status' => 'error',
                    'errors' => $validator->errors()
            ], 422);
        }

        
        $add_user = new User();
        $add_user->fname = $request->fname;
        $add_user->lname = $request->lname;
        $add_user->email = $request->email;
        $add_user->password = Hash::make($request->password);
        $add_user->save();

        return response()->json([
            'status' => 'success',
            'message' => 'User registered successfully.'
        ], 200);
    }

    function UserLogin(Request $request)
    {

        $user = User::where('email', $request->email)->first();

        if ($user && Hash::check($request->password, $user->password)) {
            return Response::json([
                'status' => 'success',
                'message' => 'Login successful.',
                'user' => $user,
                'token' => Hash::make($user->user_id .$user->email)
            ], 200);
        }

        return Response::json([
            'status' => 'error',
            'message' => 'Invalid credentials.',
        ], 401);
    }

    function Users()
    {
        $user = User::all();

        return Response::json([
            'status' => 'success',
            'message' => 'User List',
            'user' => $user,
        ], 200);
    }

    function UpdateUser($id, Request $request)
    {
        $update_user = User::find($id);
        $update_user->fname = $request->fname;
        $update_user->lname = $request->lname;
        $update_user->email = $request->email;
        $update_user->save();

        return Response::json([
            'status' => 'success',
            'message' => 'User update successfully..!',
        ], 200);
    }

    function DeleteUser($id)
    {
        $delete_user = User::find($id);
        $delete_user->status = '0';
        $delete_user->save();

        return Response::json([
            'status' => 'success',
            'message' => 'User delete successfully..!',
        ], 200);
    }

}
