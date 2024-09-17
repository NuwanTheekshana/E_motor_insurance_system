<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\policy_cover_model;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Response;

class PolicyCoverController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $covers_data = policy_cover_model::where('status', '1')->get();

        return Response::json([
            'status' => 'success',
            'message' => 'Policy Cover List',
            'cover' => $covers_data,
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
            'cover_name' => 'required|max:50',
            'cover_amount' => 'required|numeric',
            'cover_sys_amount' => 'required|numeric'
        ]);

        if ($validator->fails()) {
            return response()->json([
                    'status' => 'error',
                    'errors' => $validator->errors()
            ], 422);
        }

        $add_policy_cover = new policy_cover_model();
        $add_policy_cover->user_id = $request->user_id; 
        $add_policy_cover->cover_name = $request->cover_name;
        $add_policy_cover->cover_amount = $request->cover_amount;
        $add_policy_cover->cover_sys_amount = $request->cover_sys_amount;
        $add_policy_cover->save();

        return Response::json([
            'status' => 'success',
            'message' => 'Add policy covers successfully'
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
            'cover_id' => 'required|numeric',
            'cover_name' => 'required|max:50',
            'cover_amount' => 'required|numeric',
            'cover_sys_amount' => 'required|numeric'
        ]);

        if ($validator->fails()) {
            return response()->json([
                    'status' => 'error',
                    'errors' => $validator->errors()
            ], 422);
        }

        $update_policy_cover = policy_cover_model::find($id);
        $update_policy_cover->cover_name = $request->cover_name;
        $update_policy_cover->cover_amount = $request->cover_amount;
        $update_policy_cover->cover_sys_amount = $request->cover_sys_amount;
        $update_policy_cover->save();

        return Response::json([
            'status' => 'success',
            'message' => 'Policy cover update successfully..!',
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
        $delete_policy_cover = policy_cover_model::find($id);
        $delete_policy_cover->status = '0';
        $delete_policy_cover->save();

        return Response::json([
            'status' => 'success',
            'message' => 'Policy cover delete successfully..!',
        ], 200);
    }
}
