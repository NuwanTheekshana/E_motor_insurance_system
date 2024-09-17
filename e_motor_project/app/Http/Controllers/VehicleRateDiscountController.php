<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\vehicle_rate_dis_tbl;
use App\Models\vehicle_category_tbl;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Response;
use DB;

class VehicleRateDiscountController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // $vehicle_rate_discount_data = vehicle_rate_dis_tbls::where('status', '1')->get();
        $vehicle_rate_discount_data = DB::select('SELECT R.*, C.vehicle_category_name FROM vehicle_rate_dis_tbls R, vehicle_category_tbls C WHERE R.vehicle_category_id = C.vehicle_category_id AND R.status = 1');

        return Response::json([
            'status' => 'success',
            'message' => 'Vehicle Rate & Discount List',
            'vehicle_rate' => $vehicle_rate_discount_data,
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
            'vehicle_category' => 'required|max:50',
            'vehicle_rate' => 'required|numeric',
            'vehicle_discount' => 'required|numeric'
        ]);

        if ($validator->fails()) {
            return response()->json([
                    'status' => 'error',
                    'errors' => $validator->errors()
            ], 422);
        }

        $add_vehicle_rate = new vehicle_rate_dis_tbl();
        $add_vehicle_rate->user_id = $request->user_id; 
        $add_vehicle_rate->vehicle_category_id = $request->vehicle_category;
        $add_vehicle_rate->vehicle_rate = $request->vehicle_rate;
        $add_vehicle_rate->vehicle_discount = $request->vehicle_discount;
        $add_vehicle_rate->save();

        return Response::json([
            'status' => 'success',
            'message' => 'Add vehicle rate & discount successfully'
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
            'vehicle_rate' => 'required|numeric',
            'vehicle_discount' => 'required|numeric'
        ]);

        if ($validator->fails()) {
            return response()->json([
                    'status' => 'error',
                    'errors' => $validator->errors()
            ], 422);
        }

        $update_vehicle_rate = vehicle_rate_dis_tbl::find($id);
        $update_vehicle_rate->vehicle_rate = $request->vehicle_rate;
        $update_vehicle_rate->vehicle_discount = $request->vehicle_discount;
        $update_vehicle_rate->save();

        return Response::json([
            'status' => 'success',
            'message' => 'Vehicle rate & discount update successfully..!',
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
        $delete_vehicle_rate = vehicle_rate_dis_tbl::find($id);
        $delete_vehicle_rate->status = '0';
        $delete_vehicle_rate->save();

        return Response::json([
            'status' => 'success',
            'message' => 'Vehicle rate & discount delete successfully..!',
        ], 200);
    }
}
