<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\vehicle_totalloss_backlist_tbl;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Response;

class BlacklistVehicleController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $blacklist_data = vehicle_totalloss_backlist_tbl::where('status', '1')->get();

        return Response::json([
            'status' => 'success',
            'message' => 'Vehicle Blacklist & Total Loss List',
            'blacklist_vehicle' => $blacklist_data,
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
            'vehicle_reg_no' => 'required|max:100',
            'vehicle_chassis_no' => 'required|max:255',
            'vehicle_engine_no' => 'required|max:255',
            'blacklist_type' => 'required|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json([
                    'status' => 'error',
                    'errors' => $validator->errors()
            ], 422);
        }

        $add_blacklist_vehicle = new vehicle_totalloss_backlist_tbl();
        $add_blacklist_vehicle->user_id = $request->user_id;
        $add_blacklist_vehicle->vehicle_reg_no = $request->vehicle_reg_no;
        $add_blacklist_vehicle->vehicle_chassis_no = $request->vehicle_chassis_no;
        $add_blacklist_vehicle->vehicle_engine_no = $request->vehicle_engine_no;
        $add_blacklist_vehicle->blacklist_type = $request->blacklist_type;
        $add_blacklist_vehicle->save();

        return Response::json([
            'status' => 'success',
            'message' => 'Add vehicle blacklist details successfully'
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
            'vehicle_reg_no' => 'required|max:100',
            'vehicle_chassis_no' => 'required|max:255',
            'vehicle_engine_no' => 'required|max:255',
            'blacklist_type' => 'required|max:50',
        ]);

        $update_blacklist_vehicle = vehicle_totalloss_backlist_tbl::find($id);
        $update_blacklist_vehicle->vehicle_reg_no = $request->vehicle_reg_no;
        $update_blacklist_vehicle->vehicle_chassis_no = $request->vehicle_chassis_no;
        $update_blacklist_vehicle->vehicle_engine_no = $request->vehicle_engine_no;
        $update_blacklist_vehicle->blacklist_type = $request->blacklist_type;
        $update_blacklist_vehicle->save();

        return Response::json([
            'status' => 'success',
            'message' => 'Update vehicle black list and total loss details successfully..!',
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
        $delete_fuel = vehicle_totalloss_backlist_tbl::find($id);
        $delete_fuel->status = '0';
        $delete_fuel->save();

        return Response::json([
            'status' => 'success',
            'message' => 'Black list and total loss detail delete successfully..!',
        ], 200);
    }
}
