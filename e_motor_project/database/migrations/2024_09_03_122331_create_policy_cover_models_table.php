<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePolicyCoverModelsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('policy_cover_models', function (Blueprint $table) {
            $table->id('cover_id');
            $table->integer('user_id');
            $table->string('cover_name');
            $table->decimal('cover_amount', 18, 2);
            $table->decimal('cover_sys_amount', 18, 2);
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
        Schema::dropIfExists('policy_cover_models');
    }
}
