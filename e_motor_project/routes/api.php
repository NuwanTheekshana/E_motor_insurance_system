<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\VehicleCategoryController;
use App\Http\Controllers\VehicleUsageController;
use App\Http\Controllers\VehicleFuelController;
use App\Http\Controllers\PolicyCoverController;
use App\Http\Controllers\VehicleRateDiscountController;
use App\Http\Controllers\BlacklistVehicleController;
use App\Http\Controllers\BlacklistCustomerController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\PolicyDetailController;
use App\Http\Controllers\PolicyCoverPlanController;
use App\Http\Controllers\PolicyCustomerController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\ValidationController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ReportController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


//admin
Route::POST('/admin/registration', [App\Http\Controllers\RegisterController::class, 'UserRegistration']);
Route::POST('/admin/login', [App\Http\Controllers\RegisterController::class, 'UserLogin']);
Route::GET('/admin/users', [App\Http\Controllers\RegisterController::class, 'Users']);
Route::PUT('/admin/users/{id}', [App\Http\Controllers\RegisterController::class, 'UpdateUser']);
Route::DELETE('/admin/users/{id}', [App\Http\Controllers\RegisterController::class, 'DeleteUser']);

Route::apiResource('/admin/vehiclecategories', VehicleCategoryController::class);
Route::apiResource('/admin/vehicleusage', VehicleUsageController::class);
Route::apiResource('/admin/vehiclefuel', VehicleFuelController::class);
Route::apiResource('/admin/policycovers', PolicyCoverController::class);
Route::apiResource('/admin/policyvehiclerates', VehicleRateDiscountController::class);

Route::apiResource('/admin/vehicleblacklist', BlacklistVehicleController::class);
Route::apiResource('/admin/blacklistcustomers', BlacklistCustomerController::class);


//frontend
Route::POST('/extractimagetotext', [ImageController::class, 'extractImagetoText']);
Route::POST('/vehicledata', [PolicyDetailController::class, 'GetVehicleData']);
Route::POST('/selectcoverplan', [PolicyCoverPlanController::class, 'PolicyCoverPlan']);
Route::POST('/policycustomers', [PolicyCustomerController::class, 'PolicyCustomers']);
Route::POST('/documentupload', [DocumentController::class, 'DocumentUpload']);
Route::GET('/vehiclebookcheck/{id}', [DocumentController::class, 'VehicleBookCheck']);
Route::GET('/validatepolicy/{id}', [ValidationController::class, 'ValidatePolicy']);
Route::GET('/getinsurancepremium/{id}', [PaymentController::class, 'GetInsurancePremium']);
Route::POST('/updatepayment', [PaymentController::class, 'UpdatePayment']);
Route::POST('/paymentverification', [PaymentController::class, 'PaymentVerification']);
Route::POST('/resendverificationcode', [PaymentController::class, 'ResendVerificationCode']);
Route::GET('/policycheck/{id}', [PaymentController::class, 'PolicyCheck']);

Route::get('/admin/dashboaddetails', [DashboardController::class, 'GetDashboadData']);
Route::get('/admin/policylistreport', [ReportController::class, 'GetPolicyListReport']);

