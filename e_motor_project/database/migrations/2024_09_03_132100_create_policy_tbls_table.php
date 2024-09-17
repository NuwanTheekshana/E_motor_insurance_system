<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePolicyTblsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('policy_tbls', function (Blueprint $table) {
            $table->id('policy_id');
            $table->string('policy_no')->nullable();
            $table->string('product')->nullable();
            $table->decimal('policy_sum_insured', 18, 2);
            $table->datetime('policy_start_date');
            $table->datetime('policy_end_date');
            $table->decimal('insurance_premium', 18, 2);
            $table->integer('policy_status')->default('1')->comment('1=initial, 2=insurance plan, 3=customer data, 4=document and image upload, 5=verification, 6=payment, 7=active');
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
        Schema::dropIfExists('policy_tbls');
    }
}
