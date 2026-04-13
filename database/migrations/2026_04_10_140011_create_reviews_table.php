<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->uuid("id")->primary();
            $table->foreignUuid("user_id")->constrained();
            $table->foreignUuid("pharmacy_id")->constrained();
            $table->foreignUuid("order_id")->unique();
            $table->integer("rating");
            $table->text("comment")->nullable();
            $table->timestamp("created_at")->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
