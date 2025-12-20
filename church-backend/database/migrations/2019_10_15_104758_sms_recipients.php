<?php

use App\Models\Sms;
use App\Models\User;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sms_recipients', function(Blueprint $table){
            $table->id();
            $table->foreignIdFor(User::class);
            $table->foreignIdFor(Sms::class);
            $table->datetime("sent")->useCurrent();
            $table->softDeletes();
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
        Schema::dropIfExists("sms_recipients");
    }
};
