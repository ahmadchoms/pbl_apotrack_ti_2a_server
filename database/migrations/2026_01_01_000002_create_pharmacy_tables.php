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
            $table->string('logo_url')->nullable();
            $table->float('latitude', 10, 6);
            $table->float('longitude', 10, 6);
            $table->float('rating', 8, 2)->default(0.0);
            $table->string('verification_status', 20)->default('PENDING');
            $table->integer('total_reviews')->default(0);
            $table->boolean('is_active')->default(true);
            $table->boolean('is_force_closed')->default(false);
            $table->foreignUuid('verified_by')->nullable()->constrained('users');
            $table->timestamp('verified_at')->nullable();
            $table->text('rejection_reason')->nullable();
            $table->softDeletes();
            $table->timestamps();

            $table->index(['latitude', 'longitude']);
            $table->index('is_active');
            $table->index('verification_status');
        });

        if (DB::getDriverName() !== 'sqlite') {
            DB::statement('ALTER TABLE pharmacies ADD CONSTRAINT chk_pharmacy_rating CHECK (rating >= 0 AND rating <= 5)');
        }

        Schema::create('pharmacy_staffs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('pharmacy_id')->constrained('pharmacies');
            $table->foreignUuid('user_id')->constrained('users');
            $table->string('role', 20); // APOTEKER | STAFF
            $table->boolean('is_active')->default(true);
            $table->softDeletes();
            $table->timestamps();

            $table->unique(['pharmacy_id', 'user_id']);
            $table->index('user_id');
            $table->index(['pharmacy_id', 'is_active']);
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

        Schema::create('pharmacy_legalities', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('pharmacy_id')->unique()->constrained('pharmacies')->cascadeOnDelete();
            $table->string('sia_number', 100);
            $table->string('sipa_number', 100);
            $table->string('stra_number', 100);
            $table->string('apoteker_nik', 20);
            $table->string('sia_document_url');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pharmacy_operating_hours');
        Schema::dropIfExists('pharmacy_staffs');
        Schema::dropIfExists('pharmacy_legalities');
        Schema::dropIfExists('pharmacies');
    }
};
