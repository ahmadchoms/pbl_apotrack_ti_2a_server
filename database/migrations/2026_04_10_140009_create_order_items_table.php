<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('order_items', function (Blueprint $table) {

            $table->uuid("id")->primary();
            $table->foreignUuid("order_id")->constrained()->cascadeOnDelete();
            $table->foreignUuid("medicine_id")->constrained();
            $table->integer("quantity");
            $table->decimal("price", 12, 2);
            $table->decimal("subtotal", 12, 2);
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};
