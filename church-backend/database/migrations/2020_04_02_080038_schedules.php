<?php

use App\Models\Group;
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
        Schema::create("schedules", function (Blueprint $table){
            $table->id();
            $table->string("title")->nullable();
            $table->text("message");
            $table->foreignIdFor(User::class);
            $table->foreignIdFor(Group::class)->nullable();
            $table->datetime("schedule")->useCurrent();
            $table->boolean("status")->default(false);
            $table->boolean("send_to_all")->default(false);
            $table->enum("type", ["sms", "email"]);
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
        Schema::dropIfExists("schedules");
    }
};
