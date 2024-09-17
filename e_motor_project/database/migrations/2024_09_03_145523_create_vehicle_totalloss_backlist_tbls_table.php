<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateVehicleTotallossBacklistTblsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('vehicle_totalloss_backlist_tbls', function (Blueprint $table) {
            $table->id('totalloss_blacklist_id');
            $table->integer('user_id');
            $table->string('vehicle_reg_no');
            $table->string('vehicle_chassis_no');
            $table->string('vehicle_engine_no');
            $table->string('blacklist_type');
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
        Schema::dropIfExists('vehicle_totalloss_backlist_tbls');
    }
}
