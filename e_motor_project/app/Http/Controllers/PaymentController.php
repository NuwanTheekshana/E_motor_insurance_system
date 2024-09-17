<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\policy_tbl;
use App\Models\vehicle_payment_tbl;
use App\Models\customer_detail_tbl;
use App\Models\vehicle_detail_tbl;
use App\Models\verification_tbl;
use App\Models\vehicle_document_tbl;
use App\Models\vehicle_img_tbl;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Response;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use Illuminate\Support\Facades\Crypt;
use Mail;
use Mpdf\Mpdf;

class PaymentController extends Controller
{
    function GetInsurancePremium($id){
        
        $premium = policy_tbl::where('policy_id', $id)->value('insurance_premium');


        return Response::json([
            'status' => 'success',
            'message' => 'Insurance Premium Success',
            'policy_id' => $id,
            'insurance_premium' => $premium
        ], 200);

    }

    function UpdatePayment(Request $request) {
        
        $validator = Validator::make($request->all(), [
            'policy_id' => 'required|numeric',
            'cardType' => 'required|max:50',
            'cardholdername' => 'required|max:100',
            'policypremium' => 'required|numeric'
        ]);

        if ($validator->fails()) {
            return response()->json([
                    'status' => 'error',
                    'errors' => $validator->errors()
            ], 422);
        }

        $receipt_no = "RV-" . date('Y') . "-" . time();
        $transaction_date = date('Y-m-d H:i:s');

        $add_payment = new vehicle_payment_tbl();
        $add_payment->policy_id = $request->policy_id;
        $add_payment->receipt_no = $receipt_no;
        $add_payment->payment_amount = $request->policypremium;
        $add_payment->transaction_date = $transaction_date;
        $add_payment->payment_type = $request->cardType;
        $add_payment->cardholder_name = $request->cardholdername;
        $add_payment->save();

        $customer_data = customer_detail_tbl::where('policy_id', $request->policy_id)->first();
        $customerfname = $customer_data->fname;
        $customeremail = $customer_data->email;
        

        $randomNumber = $this->verification_code($request->policy_id);

        if ($randomNumber) {
            $data = [
                'name' => $customerfname,
                'verification_code' => $randomNumber
            ];
    
            Mail::send('Mail.payment_verification', $data, function($message) use ($customeremail){
                $message->to($customeremail, 'E-Motor Insurance')
                    ->from('apekama.online@gmail.com', 'E-Motor Insurance')
                    ->subject('Verify Your Email Address to Complete Your e-Motor Insurance Payment');
            });
        }
    

        return Response::json([
            'status' => 'success',
            'message' => 'Insurance Premium Update Succesfully..!',
            'policy_id' => $request->policy_id,
        ], 200);

    }

    function PaymentVerification(Request $request) {
        
        // $check_code = verification_tbl::where('policy_id', $request->policy_id)->where('verification_code', $request->otp)->count();
        //     if ($check_code == 0) {
        //         return response()->json([
        //             'status' => 'error',
        //             'errors' => 'Varification Failed.'
        //     ], 422);
        // }

        $policy_id = $request->policy_id;
        $policy_no = "POL".date('Y').time();

        $update_payment = vehicle_payment_tbl::where('policy_id', $policy_id)->where('status', 0)->first();
        $update_payment->status = 1;
        $update_payment->save();

        $update_policy = policy_tbl::find($policy_id);
        $update_policy->policy_no = $policy_no;
        $update_policy->policy_status = 6;
        $update_policy->save();

        $policy_data = policy_tbl::where('policy_id', $policy_id)->first();
        $customer_data = customer_detail_tbl::where('policy_id', $policy_id)->where('status', 1)->first();
        $vehicle_data = vehicle_detail_tbl::where('policy_id', $policy_id)->where('status', 1)->first();
        $policy_period = date('Y-m-d', strtotime($policy_data->policy_start_date)) . ' to ' . date('Y-m-d', strtotime($policy_data->policy_end_date));

        //check cetificate status
        $document_count = vehicle_document_tbl::where('policy_id', $policy_id)->where('status', 1)->count();
        $vehicle_img_count = vehicle_img_tbl::where('policy_id', $policy_id)->where('status', 1)->count();

        $cetificate_score = $document_count + $vehicle_img_count;
        $cetificate_status = ($cetificate_score > 7) ? true : false;

        $data = [
            'policy_holder_name' => $customer_data->fname.' '.$customer_data->lname,
            'vehicle_no' => $vehicle_data->vehicle_reg_no,
            'engine_no' => $vehicle_data->engine_no,
            'chassis_no' => $vehicle_data->chassis_no,
            'policy_no' => $policy_no,
            'policy_period' => $policy_period,
            'issue_date' => date('Y-m-d'),
            'expiration_date' => $policy_data->policy_end_date,
            'nic' => $customer_data->NIC,
            'email' => $customer_data->email,
            'status' => 'Active',
            'cetificate_status' => $cetificate_status
        ];

        $sendEmail = $this->sendEmail($data);


        return Response::json([
            'status' => 'success',
            'message' => 'Payment Verification Completed..!',
            'policy_id' => $request->policy_id,
        ], 200);
    }

    function ResendVerificationCode(Request $request) {
        
        $randomNumber = $this->verification_code($request->policy_id);

        $customer_data = customer_detail_tbl::where('policy_id', $request->policy_id)->first();
        $customerfname = $customer_data->fname;
        $customeremail = $customer_data->email;

        $data = [
            'name' => $customerfname,
            'verification_code' => $randomNumber
        ];

        Mail::send('Mail.payment_verification', $data, function($message) use ($customeremail){
            $message->to($customeremail, 'E-Motor Insurance')
                ->from('apekama.online@gmail.com', 'E-Motor Insurance')
                ->subject('Resend: Your Verification Code for payment Verification');
        });

        return Response::json([
            'status' => 'success',
            'message' => 'Resend Payment Verification Code..!',
            'policy_id' => $request->policy_id
        ], 200);
    }

    function PolicyCheck($id){
        
        $decryptedPolicyNo = Crypt::decrypt($id);


        $policy_data = policy_tbl::where('policy_no', $decryptedPolicyNo)->first();
        $policy_id = $policy_data->policy_id;
        $customer_data = customer_detail_tbl::where('policy_id', $policy_id)->where('status', 1)->first();
        $vehicle_data = vehicle_detail_tbl::where('policy_id', $policy_id)->where('status', 1)->first();
        $policy_period = date('Y-m-d', strtotime($policy_data->policy_start_date)) . ' to ' . date('Y-m-d', strtotime($policy_data->policy_end_date));

        //check cetificate status
        $document_count = vehicle_document_tbl::where('policy_id', $policy_id)->where('status', 1)->count();
        $vehicle_img_count = vehicle_img_tbl::where('policy_id', $policy_id)->where('status', 1)->count();

        $cetificate_score = $document_count + $vehicle_img_count;
        $cetificate_status = ($cetificate_score > 7) ? true : false;

        $data = [
            'policy_holder_name' => $customer_data->fname.' '.$customer_data->lname,
            'vehicle_no' => $vehicle_data->vehicle_reg_no,
            'engine_no' => $vehicle_data->engine_no,
            'chassis_no' => $vehicle_data->chassis_no,
            'policy_no' => $decryptedPolicyNo,
            'policy_period' => $policy_period,
            'issue_date' => date('Y-m-d'),
            'expiration_date' => $policy_data->policy_end_date,
            'nic' => $customer_data->NIC,
            'email' => $customer_data->email,
            'status' => 'Active',
            'cetificate_status' => $cetificate_status
        ];


        return Response::json([
            'status' => 'success',
            'message' => 'Policy check success',
            'policy_details' => $data
        ], 200);
    }


    private function verification_code($id) 
    {
        verification_tbl::where('policy_id', $id)->delete();
        $randomNumber = rand(1000, 9999);
        $add_verification = new verification_tbl();
        $add_verification->policy_id = $id;
        $add_verification->verification_code = $randomNumber;
        $add_verification->save();

        return $randomNumber;
        
    }



    public function sendEmail($data)
    {
        if ($data['cetificate_status']) {

            $encrypt_code = Crypt::encrypt($data['policy_no']);
            $qr_link = 'http://192.168.1.101:3000/checkpolicy/'.$encrypt_code;
            $qrCode = QrCode::format('png')
                ->size(150)
                ->generate($qr_link);
        
            $data['qr_code'] = base64_encode($qrCode);
            $html = view('pdf.cetificate', $data)->render();
            $mpdf = new Mpdf();
            $mpdf->WriteHTML($html);
            $mpdf->SetProtection(['copy', 'print'], $data['nic'], $data['nic']);
            $pdfContent = $mpdf->Output('', 'S');

            Mail::send('Mail.certificate_mail', $data, function ($message) use ($data, $pdfContent) {
                $message->to($data['email'], 'E-Motor Insurance')
                        ->from('apekama.online@gmail.com', 'E-Motor Insurance')
                        ->subject('E-Motor Vehicle Insurance Certificate')
                        ->attachData($pdfContent, 'E-Motor Vehicle Insurance Certificate.pdf', [
                            'mime' => 'application/pdf',
                        ]);
            });
        }else {

            
            $encrypt_code = Crypt::encrypt($data['policy_no']);
            $qr_link = 'http://192.168.1.101:3000/checkpolicy/'.$encrypt_code;
            $qrCode = QrCode::format('png')
                ->size(150)
                ->generate($qr_link);
        
            $data['qr_code'] = base64_encode($qrCode);
            $html = view('pdf.cover_note', $data)->render();
            $mpdf = new Mpdf();
            $mpdf->WriteHTML($html);
            $mpdf->SetProtection(['copy', 'print'], $data['nic'], $data['nic']);
            $pdfContent = $mpdf->Output('', 'S');

            Mail::send('Mail.covernote_mail', $data, function ($message) use ($data, $pdfContent) {
                $message->to($data['email'], 'E-Motor Insurance')
                        ->from('apekama.online@gmail.com', 'E-Motor Insurance')
                        ->subject('E-Motor Vehicle Insurance Cover Note')
                        ->attachData($pdfContent, 'E-Motor Vehicle Insurance Covernote.pdf', [
                            'mime' => 'application/pdf',
                        ]);
            });
        }

       return true;
    }



}
