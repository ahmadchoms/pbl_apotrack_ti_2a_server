<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('pharmacies', function (Blueprint $table) {
            $table->uuid("id")->primary();
            $table->foreignUuid("admin_id")->constrained("users")->cascadeOnDelete();
            $table->string("name");
            $table->text("address");
            $table->float("latitude");
            $table->float("longitude");
            $table->float("rating")->default(0);
            $table->boolean("is_open")->default(true);
            $table->boolean("is_active")->default(true);
            $table->timestamp("created_at")->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pharmacies');
    }
};
