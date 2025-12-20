<?php

use App\Models\Child;
use App\Models\ChildEvent;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('child_check_ins', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Child::class);
            $table->foreignIdFor(ChildEvent::class);
            $table->datetime("check_in_time");
            $table->datetime("check_out_time")->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('child_check_ins');
    }
};
