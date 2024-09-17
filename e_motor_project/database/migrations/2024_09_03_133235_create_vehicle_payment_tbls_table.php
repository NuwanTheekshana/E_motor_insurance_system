<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateVehiclePaymentTblsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('vehicle_payment_tbls', function (Blueprint $table) {
            $table->id('payment_id');
            $table->integer('policy_id');
            $table->string('receipt_no');
            $table->decimal('payment_amount', 18, 2);
            $table->datetime('transaction_date');
            $table->string('payment_type');
            $table->string('status')->default('0');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('vehicle_payment_tbls');
    }
}
