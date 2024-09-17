<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\vehicle_category_tbl;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Response;


class VehicleCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $category_data = vehicle_category_tbl::where('status', '1')->get();

        return Response::json([
            'status' => 'success',
            'message' => 'Vehicle Category List',
            'category' => $category_data,
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
            'category_id' => 'required|numeric',
            'category_name' => 'required|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json([
                    'status' => 'error',
                    'errors' => $validator->errors()
            ], 422);
        }

        $add_category = new vehicle_category_tbl();
        $add_category->vehicle_category_id = $request->category_id;
        $add_category->user_id = $request->user_id;
        $add_category->vehicle_category_name = strtoupper(trim($request->category_name));
        $add_category->save();

        return Response::json([
            'status' => 'success',
            'message' => 'Add vehicle category details successfully'
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
            'category_name' => 'required|max:50'
        ]);

        if ($validator->fails()) {
            return response()->json([
                    'status' => 'error',
                    'errors' => $validator->errors()
            ], 422);
        }

        $update_category = vehicle_category_tbl::find($id);
        $update_category->vehicle_category_name = strtoupper(trim($request->category_name));
        $update_category->save();

        return Response::json([
            'status' => 'success',
            'message' => 'Update vehicle category details successfully..!',
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
        $delete_category = vehicle_category_tbl::find($id);
        $delete_category->status = '0';
        $delete_category->save();

        return Response::json([
            'status' => 'success',
            'message' => 'Category delete successfully..!',
        ], 200);
    }
}
