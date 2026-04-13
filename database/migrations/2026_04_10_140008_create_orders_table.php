<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->uuid("id")->primary();
            $table->foreignUuid("user_id")->constrained()->cascadeOnDelete();
            $table->foreignUuid("pharmacy_id")->constrained();
            $table->foreignUuid("address_id")->constrained("user_addresses");
            $table->string("service_type")->nullable();
            $table->string("payment_method")->nullable();
            $table->string("order_status");
            $table->string("payment_status");
            $table->decimal("total_price", 12, 2);
            $table->string("verification_code")->nullable();
            $table->text("notes")->nullable();
            $table->timestamp("paid_at")->nullable();
            $table->timestamp("expired_at")->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
