<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('reviews', function (Blueprint $table) {
            // Drop the foreign key and unique constraint
            $table->dropForeign(['medicine_id']);
            $table->dropUnique(['order_id', 'medicine_id']);
            $table->dropColumn('medicine_id');

            // Add a unique constraint for order_id so that an order can only be reviewed once
            $table->unique('order_id');
        });
    }

    public function down(): void
    {
        Schema::table('reviews', function (Blueprint $table) {
            $table->foreignUuid('medicine_id')->nullable()->constrained('medicines')->cascadeOnDelete();
            $table->dropUnique(['order_id']);
            $table->unique(['order_id', 'medicine_id']);
        });
    }
};
