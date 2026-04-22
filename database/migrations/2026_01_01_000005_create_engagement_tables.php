<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('title', 200);
            $table->text('message');
            $table->string('type', 30)->nullable();
            $table->string('reference_type', 30)->nullable();
            $table->uuid('reference_id')->nullable();
            $table->boolean('is_read')->default(false);
            $table->timestamp('read_at')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->index(['user_id', 'is_read']);
        });

        Schema::create('reviews', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained('users');
            $table->foreignUuid('pharmacy_id')->constrained('pharmacies');
            $table->foreignUuid('order_id')->unique()->constrained('orders');
            $table->integer('rating'); // 1-5
            $table->text('comment')->nullable();
            $table->boolean('is_visible')->default(true);
            $table->timestamp('created_at')->useCurrent();

            $table->index(['pharmacy_id', 'rating']);
        });

        DB::statement('ALTER TABLE reviews ADD CONSTRAINT chk_rating_range CHECK (rating >= 1 AND rating <= 5)');
    }

    public function down(): void
    {
        Schema::dropIfExists('reviews');
        Schema::dropIfExists('notifications');
    }
};
