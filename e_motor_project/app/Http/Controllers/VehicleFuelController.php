<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\vehicle_fuel_tbl;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Response;

class VehicleFuelController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $fuel_data = vehicle_fuel_tbl::where('status', '1')->get();

        return Response::json([
            'status' => 'success',
            'message' => 'Fuel Type List',
            'fuel' => $fuel_data,
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
            'fuel_id' => 'required|numeric',
            'user_id' => 'required|numeric',
            'fuel_type' => 'required|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json([
                    'status' => 'error',
                    'errors' => $validator->errors()
            ], 422);
        }

        $add_fuel = new vehicle_fuel_tbl();
        $add_fuel->fuel_id  = $request->fuel_id;
        $add_fuel->user_id = $request->user_id;
        $add_fuel->fuel_type = trim($request->fuel_type);
        $add_fuel->save();

        return Response::json([
            'status' => 'success',
            'message' => 'Add fuel details successfully'
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
            'fuel_type' => 'required|max:50'
        ]);

        if ($validator->fails()) {
            return response()->json([
                    'status' => 'error',
                    'errors' => $validator->errors()
            ], 422);
        }

        $update_fuel_type = vehicle_fuel_tbl::find($id);
        $update_fuel_type->fuel_type = trim($request->fuel_type);
        $update_fuel_type->save();

        return Response::json([
            'status' => 'success',
            'message' => 'Update vehicle fuel type successfully..!',
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
        $delete_fuel = vehicle_fuel_tbl::find($id);
        $delete_fuel->status = '0';
        $delete_fuel->save();

        return Response::json([
            'status' => 'success',
            'message' => 'Fuel type delete successfully..!',
        ], 200);
    }
}
