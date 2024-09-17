<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateVehicleDetailTblsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('vehicle_detail_tbls', function (Blueprint $table) {
            $table->id('vehicle_detail_id');
            $table->integer('policy_id');
            $table->integer('vehicle_category_id');
            $table->integer('fuel_id');
            $table->integer('usage_id');
            $table->string('vehicle_reg_no');
            $table->string('vehicle_make');
            $table->integer('vehicle_year');
            $table->string('engine_no');
            $table->string('chassis_no');
            $table->integer('vehicle_seat_capacity');
            $table->string('status')->default('1');
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
        Schema::dropIfExists('vehicle_detail_tbls');
    }
}
