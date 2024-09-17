<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\policy_tbl;
use App\Models\vehicle_document_tbl;
use App\Models\vehicle_img_tbl;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Response;


class DocumentController extends Controller
{
    function VehicleBookCheck($id) {
        
        $count = vehicle_document_tbl::where('policy_id', $id)->where('doc_name', 'Vehicle Book')->count();

        $vehiclebook_status = ($count > 0) ? true : false;

        return Response::json([
            'status' => 'success',
            'message' => 'Policy customer details added successfully',
            'vehicleBookUploaded' => $vehiclebook_status
        ], 200);
    }

    function DocumentUpload(Request $request) {

        $validator = Validator::make($request->all(), [
            'policy_id' => 'required|numeric',
            'vehicleBook' => 'nullable|image|mimes:jpeg,png,jpg|max:5120',
            'inspectionReport' => 'nullable|image|mimes:jpeg,png,jpg|max:5120',
            'nicFront' => 'nullable|image|mimes:jpeg,png,jpg|max:5120',
            'nicBack' => 'nullable|image|mimes:jpeg,png,jpg|max:5120',
            'passport' => 'nullable|image|mimes:jpeg,png,jpg|max:5120',
            'vehicleFront' => 'nullable|image|mimes:jpeg,png,jpg|max:5120',
            'vehicleLeft' => 'nullable|image|mimes:jpeg,png,jpg|max:5120',
            'vehicleRear' => 'nullable|image|mimes:jpeg,png,jpg|max:5120',
            'vehicleRight' => 'nullable|image|mimes:jpeg,png,jpg|max:5120',
        ]);

        if ($validator->fails()) {
            return response()->json([
                    'status' => 'error',
                    'errors' => $validator->errors()
            ], 422);
        }

        $policy_id = $request->policy_id;

        $update_policy = policy_tbl::find($policy_id);
        $update_policy->policy_status = 4;
        $update_policy->save();
        

        // document upload
       
        if ($request->hasFile('vehicleBook')) {
            $file = $request->file('vehicleBook');

            $filename = $policy_id.'_vehiclebook_'.time(). '.' . $file->getClientOriginalExtension();
            $destinationPath = public_path('uploads/vehicle_documents/'.$policy_id.'/');
            $file->move($destinationPath, $filename);
            $doc_path = '/uploads/vehicle_documents/'.$policy_id.'/'.$filename;

            $add_vehiclebook = new vehicle_document_tbl();
            $add_vehiclebook->policy_id  = $policy_id;
            $add_vehiclebook->doc_name = 'Vehicle Book';
            $add_vehiclebook->doc_path = $doc_path;
            $add_vehiclebook->save();
        }
        


        if ($request->hasFile('inspectionReport')) {
            $file = $request->file('inspectionReport');

            $filename = $policy_id.'_inspectionReport_'.time(). '.' . $file->getClientOriginalExtension();
            $destinationPath = public_path('uploads/vehicle_documents/'.$policy_id.'/');
            $file->move($destinationPath, $filename);
            $doc_path = '/uploads/vehicle_documents/'.$policy_id.'/'.$filename;

            $add_inspectionReport = new vehicle_document_tbl();
            $add_inspectionReport->policy_id  = $policy_id;
            $add_inspectionReport->doc_name = 'Inspection Report';
            $add_inspectionReport->doc_path = $doc_path;
            $add_inspectionReport->save();
        }
        

        if ($request->hasFile('nicFront')) {
            $file = $request->file('nicFront');

            $filename = $policy_id.'_nicFront_'.time(). '.' . $file->getClientOriginalExtension();
            $destinationPath = public_path('uploads/vehicle_documents/'.$policy_id.'/');
            $file->move($destinationPath, $filename);
            $doc_path = '/uploads/vehicle_documents/'.$policy_id.'/'.$filename;

            $add_nicFront = new vehicle_document_tbl();
            $add_nicFront->policy_id  = $policy_id;
            $add_nicFront->doc_name = 'NIC Front';
            $add_nicFront->doc_path = $doc_path;
            $add_nicFront->save();
        }

        if ($request->hasFile('nicBack')) {
            $file = $request->file('nicBack');

            $filename = $policy_id.'_nicBack_'.time(). '.' . $file->getClientOriginalExtension();
            $destinationPath = public_path('uploads/vehicle_documents/'.$policy_id.'/');
            $file->move($destinationPath, $filename);
            $doc_path = '/uploads/vehicle_documents/'.$policy_id.'/'.$filename;

            $add_nicBack = new vehicle_document_tbl();
            $add_nicBack->policy_id  = $policy_id;
            $add_nicBack->doc_name = 'NIC Back';
            $add_nicBack->doc_path = $doc_path;
            $add_nicBack->save();
        }

        if ($request->hasFile('passport')) {
            $file = $request->file('passport');

            $filename = $policy_id.'_passport_'.time(). '.' . $file->getClientOriginalExtension();
            $destinationPath = public_path('uploads/vehicle_documents/'.$policy_id.'/');
            $file->move($destinationPath, $filename);
            $doc_path = '/uploads/vehicle_documents/'.$policy_id.'/'.$filename;

            $add_passport = new vehicle_document_tbl();
            $add_passport->policy_id  = $policy_id;
            $add_passport->doc_name = 'Passport';
            $add_passport->doc_path = $doc_path;
            $add_passport->save();
        }


        // vehicle image upload

        if ($request->hasFile('vehicleFront')) {
            $file = $request->file('vehicleFront');

            $filename = $policy_id.'_vehicleFront_'.time(). '.' . $file->getClientOriginalExtension();
            $destinationPath = public_path('uploads/vehicle_image/'.$policy_id.'/');
            $file->move($destinationPath, $filename);
            $img_path = '/uploads/vehicle_image/'.$policy_id.'/'.$filename;

            $add_front = new vehicle_img_tbl();
            $add_front->policy_id  = $policy_id;
            $add_front->image_type = 'Front';
            $add_front->img_path = $img_path;
            $add_front->save();
        }

        if ($request->hasFile('vehicleLeft')) {
            $file = $request->file('vehicleLeft');

            $filename = $policy_id.'_vehicleLeft_'.time(). '.' . $file->getClientOriginalExtension();
            $destinationPath = public_path('uploads/vehicle_image/'.$policy_id.'/');
            $file->move($destinationPath, $filename);
            $img_path = '/uploads/vehicle_image/'.$policy_id.'/'.$filename;

            $add_left = new vehicle_img_tbl();
            $add_left->policy_id  = $policy_id;
            $add_left->image_type = 'Left';
            $add_left->img_path = $img_path;
            $add_left->save();
        }

        if ($request->hasFile('vehicleRear')) {
            $file = $request->file('vehicleRear');

            $filename = $policy_id.'_vehicleRear_'.time(). '.' . $file->getClientOriginalExtension();
            $destinationPath = public_path('uploads/vehicle_image/'.$policy_id.'/');
            $file->move($destinationPath, $filename);
            $img_path = '/uploads/vehicle_image/'.$policy_id.'/'.$filename;

            $add_rear = new vehicle_img_tbl();
            $add_rear->policy_id  = $policy_id;
            $add_rear->image_type = 'Rear';
            $add_rear->img_path = $img_path;
            $add_rear->save();
        }

        if ($request->hasFile('vehicleRight')) {
            $file = $request->file('vehicleRight');

            $filename = $policy_id.'_vehicleRight_'.time(). '.' . $file->getClientOriginalExtension();
            $destinationPath = public_path('uploads/vehicle_image/'.$policy_id.'/');
            $file->move($destinationPath, $filename);
            $img_path = '/uploads/vehicle_image/'.$policy_id.'/'.$filename;

            $add_right = new vehicle_img_tbl();
            $add_right->policy_id  = $policy_id;
            $add_right->image_type = 'Right';
            $add_right->img_path = $img_path;
            $add_right->save();
        }

        return Response::json([
            'status' => 'success',
            'message' => 'Vehicle document upload successfully.',
            'policy_id' => $request->policy_id
        ], 200);
    }
}
