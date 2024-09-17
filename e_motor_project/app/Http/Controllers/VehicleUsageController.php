<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\vehicle_usage_tbl;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Response;

class VehicleUsageController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $usage_data = vehicle_usage_tbl::where('status', '1')->get();

        return Response::json([
            'status' => 'success',
            'message' => 'Vehicle Usage List',
            'usage' => $usage_data,
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
            'usage_id' => 'required|numeric',
            'usage_type' => 'required|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json([
                    'status' => 'error',
                    'errors' => $validator->errors()
            ], 422);
        }

        $add_usage = new vehicle_usage_tbl();
        $add_usage->usage_id  = $request->usage_id;
        $add_usage->user_id = $request->user_id;
        $add_usage->usage_type = trim($request->usage_type);
        $add_usage->save();

        return Response::json([
            'status' => 'success',
            'message' => 'Add vehicle usage details successfully'
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
            'usage_type' => 'required|max:50'
        ]);

        if ($validator->fails()) {
            return response()->json([
                    'status' => 'error',
                    'errors' => $validator->errors()
            ], 422);
        }

        $update_usage = vehicle_usage_tbl::find($id);
        $update_usage->usage_type = trim($request->usage_type);
        $update_usage->save();

        return Response::json([
            'status' => 'success',
            'message' => 'Update vehicle usage details successfully..!',
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
        $delete_usage = vehicle_usage_tbl::find($id);
        $delete_usage->status = '0';
        $delete_usage->save();

        return Response::json([
            'status' => 'success',
            'message' => 'Usage delete successfully..!',
        ], 200);
    }
}
