<?php

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
        Schema::table('pharmacy_staffs', function (Blueprint $table) {
            $table->index('user_id');
            $table->index(['pharmacy_id', 'is_active']);
        });

        Schema::table('audit_logs', function (Blueprint $table) {
            $table->index(['user_id', 'created_at']);
            $table->index(['action', 'status']);
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->index(['pharmacy_id', 'order_status', 'created_at']);
        });

        Schema::table('medicines', function (Blueprint $table) {
            $table->index(['pharmacy_id', 'is_active', 'deleted_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pharmacy_staffs', function (Blueprint $table) {
            $table->dropIndex(['user_id']);
            $table->dropIndex(['pharmacy_id', 'is_active']);
        });

        Schema::table('audit_logs', function (Blueprint $table) {
            $table->dropIndex(['user_id', 'created_at']);
            $table->dropIndex(['action', 'status']);
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->dropIndex(['pharmacy_id', 'order_status', 'created_at']);
        });

        Schema::table('medicines', function (Blueprint $table) {
            $table->dropIndex(['pharmacy_id', 'is_active', 'deleted_at']);
        });
    }
};
