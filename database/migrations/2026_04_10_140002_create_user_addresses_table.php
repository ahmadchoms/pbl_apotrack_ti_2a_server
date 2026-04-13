<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('user_addresses', function (Blueprint $table) {

            $table->uuid("id")->primary();
            $table->foreignUuid("user_id")->constrained()->cascadeOnDelete();
            $table->string("label");
            $table->text("address_detail");
            $table->float("latitude");
            $table->float("longitude");
            $table->boolean("is_primary")->default(false);
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('user_addresses');
    }
};
