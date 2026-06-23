<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->boolean('is_reviewed')->default(false);
        });

        // Set is_reviewed to true for already reviewed orders and revert their status to COMPLETED
        DB::table('orders')
            ->whereExists(function ($query) {
                $query->select(DB::raw(1))
                    ->from('reviews')
                    ->whereColumn('reviews.order_id', 'orders.id');
            })
            ->update([
                'is_reviewed' => true,
                'order_status' => 'COMPLETED'
            ]);

        // Change any residual REVIEWED statuses back to COMPLETED
        DB::table('orders')
            ->where('order_status', 'REVIEWED')
            ->update([
                'order_status' => 'COMPLETED'
            ]);
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn('is_reviewed');
        });
    }
};
