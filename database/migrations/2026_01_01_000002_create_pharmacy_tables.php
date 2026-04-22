<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pharmacies', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name', 150);
            $table->text('address');
            $table->string('phone', 20)->nullable();
            $table->float('latitude', 10, 6);
            $table->float('longitude', 10, 6);
            $table->float('rating', 8, 2)->default(0.0);
            $table->integer('total_reviews')->default(0);
            $table->boolean('is_active')->default(true);
            $table->boolean('is_force_closed')->default(false);
            $table->softDeletes();
            $table->timestamps();

            $table->index(['latitude', 'longitude']);
            $table->index('is_active');
        });

        DB::statement('ALTER TABLE pharmacies ADD CONSTRAINT chk_pharmacy_rating CHECK (rating >= 0 AND rating <= 5)');

        Schema::create('pharmacy_images', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('pharmacy_id')->constrained('pharmacies')->cascadeOnDelete();
            $table->string('image_url');
            $table->boolean('is_primary')->default(false);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('pharmacy_staffs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('pharmacy_id')->constrained('pharmacies');
            $table->foreignUuid('user_id')->constrained('users');
            $table->string('role', 20); // APOTEKER | STAFF
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->unique(['pharmacy_id', 'user_id']);
        });

        Schema::create('pharmacy_operating_hours', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('pharmacy_id')->constrained('pharmacies')->cascadeOnDelete();
            $table->integer('day_of_week'); // 0-6
            $table->time('open_time')->nullable();
            $table->time('close_time')->nullable();
            $table->boolean('is_closed')->default(false);
            $table->boolean('is_24_hours')->default(false);

            $table->unique(['pharmacy_id', 'day_of_week']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pharmacy_operating_hours');
        Schema::dropIfExists('pharmacy_staffs');
        Schema::dropIfExists('pharmacy_images');
        Schema::dropIfExists('pharmacies');
    }
};
