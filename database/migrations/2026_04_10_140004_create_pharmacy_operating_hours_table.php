<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('pharmacy_operating_hours', function (Blueprint $table) {
            $table->uuid("id")->primary();
            $table->foreignUuid("pharmacy_id")->constrained()->cascadeOnDelete();
            $table->integer("day_of_week"); // 0=Minggu, 1=Senin, ..., 6=Sabtu
            $table->time("open_time");
            $table->time("close_time");
            $table->boolean("is_closed")->default(false);
            $table->boolean("is_24_hours")->default(false);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pharmacy_operating_hours');
    }
};
