<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\blacklist_customer_tbl;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Response;

class BlacklistCustomerController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $blacklist_customer_data = blacklist_customer_tbl::where('status', '1')->get();

        return Response::json([
            'status' => 'success',
            'message' => 'Blacklist Customer List',
            'blacklist_customers' => $blacklist_customer_data,
        ], 200);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|numeric',
            'nic' => 'required|max:20',
            'name' => 'required|max:255'
        ]);

        if ($validator->fails()) {
            return response()->json([
                    'status' => 'error',
                    'errors' => $validator->errors()
            ], 422);
        }

        $add_blacklist_customer = new blacklist_customer_tbl();
        $add_blacklist_customer->user_id = $request->user_id;
        $add_blacklist_customer->nic = $request->nic;
        $add_blacklist_customer->name = $request->name;
        $add_blacklist_customer->save();

        return Response::json([
            'status' => 'success',
            'message' => 'Add blacklist customer details successfully'
        ], 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'nic' => 'required|max:20',
            'name' => 'required|max:255'
        ]);

        if ($validator->fails()) {
            return response()->json([
                    'status' => 'error',
                    'errors' => $validator->errors()
            ], 422);
        }

        $update_blacklist_customer = blacklist_customer_tbl::find($id);
        $update_blacklist_customer->nic = $request->nic;
        $update_blacklist_customer->name = $request->name;
        $update_blacklist_customer->save();

        return Response::json([
            'status' => 'success',
            'message' => 'Update blacklist customer details successfully'
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $delete_blacklist_customer = blacklist_customer_tbl::find($id);
        $delete_blacklist_customer->status = '0';
        $delete_blacklist_customer->save();

        return Response::json([
            'status' => 'success',
            'message' => 'Blacklist customer delete successfully'
        ], 200);
    }
}
