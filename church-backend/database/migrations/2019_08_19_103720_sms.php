<?php

use App\Models\People;
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
        Schema::create("sms", function(Blueprint $table){
            $table->id();
            $table->text("message");
            $table->foreignIdFor(People::class)->nullable();
            $table->foreignIdFor(User::class)->nullable();
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
        Schema::dropIfExists("sms");
    }
};
