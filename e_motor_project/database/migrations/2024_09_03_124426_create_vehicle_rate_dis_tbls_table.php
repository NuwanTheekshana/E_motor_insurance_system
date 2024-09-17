<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateVehicleRateDisTblsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('vehicle_rate_dis_tbls', function (Blueprint $table) {
            $table->id('vehicle_rate_dis_id');
            $table->integer('user_id');
            $table->integer('vehicle_category_id');
            $table->decimal('vehicle_rate', 18, 2);
            $table->decimal('vehicle_discount', 18, 2);
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
        Schema::dropIfExists('vehicle_rate_dis_tbls');
    }
}
