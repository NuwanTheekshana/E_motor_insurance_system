<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCustomerDetailTblsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('customer_detail_tbls', function (Blueprint $table) {
            $table->id('customer_id');
            $table->integer('policy_id');
            $table->string('NIC');
            $table->string('fname');
            $table->string('lname');
            $table->string('address');
            $table->string('email');
            $table->integer('contact_no');
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
        Schema::dropIfExists('customer_detail_tbls');
    }
}
