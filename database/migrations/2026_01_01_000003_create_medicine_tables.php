<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('medicine_categories', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name', 100)->unique();
        });

        Schema::create('medicine_forms', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name', 50)->unique();
        });

        Schema::create('medicine_types', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name', 50)->unique();
        });

        Schema::create('medicine_units', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name', 30)->unique();
        });

        Schema::create('medicines', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('pharmacy_id')->constrained('pharmacies');
            $table->foreignUuid('category_id')->constrained('medicine_categories');
            $table->foreignUuid('form_id')->constrained('medicine_forms');
            $table->foreignUuid('type_id')->constrained('medicine_types');
            $table->foreignUuid('unit_id')->constrained('medicine_units');
            $table->string('name', 200);
            $table->string('generic_name', 200)->nullable();
            $table->string('manufacturer', 100)->nullable();
            $table->text('description')->nullable();
            $table->text('dosage_info')->nullable();
            $table->decimal('price', 12, 2);
            $table->boolean('requires_prescription')->default(false);
            $table->integer('weight_in_grams')->default(100);
            $table->integer('total_active_stock')->default(10);
            $table->boolean('is_active')->default(true);
            $table->softDeletes();
            $table->timestamps();

            $table->index(['pharmacy_id', 'is_active']);
            $table->index('name');
        });

        Schema::create('medicine_images', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('medicine_id')->constrained('medicines')->cascadeOnDelete();
            $table->string('image_url');
            $table->boolean('is_primary')->default(false);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('medicine_batches', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('medicine_id')->constrained('medicines');
            $table->string('batch_number', 50);
            $table->date('expired_date');
            $table->integer('stock')->default(0);
            $table->timestamps();

            $table->unique(['medicine_id', 'batch_number']);
            $table->index('expired_date');
        });

        DB::statement('ALTER TABLE medicine_batches ADD CONSTRAINT chk_stock_non_negative CHECK (stock >= 0)');

        Schema::create('stock_movements', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('medicine_id')->constrained('medicines');
            $table->foreignUuid('batch_id')->constrained('medicine_batches');
            $table->string('type', 20); // IN | OUT | ADJUSTMENT | EXPIRED | RETURN
            $table->integer('quantity');
            $table->string('reference_type', 30)->nullable();
            $table->uuid('reference_id')->nullable();
            $table->text('note')->nullable();
            $table->foreignUuid('created_by')->constrained('users');
            $table->timestamp('created_at')->useCurrent();
        });

        DB::statement('ALTER TABLE stock_movements ADD CONSTRAINT chk_movement_quantity_positive CHECK (quantity > 0)');
    }

    public function down(): void
    {
        Schema::dropIfExists('stock_movements');
        Schema::dropIfExists('medicine_batches');
        Schema::dropIfExists('medicine_images');
        Schema::dropIfExists('medicines');
        Schema::dropIfExists('medicine_units');
        Schema::dropIfExists('medicine_types');
        Schema::dropIfExists('medicine_forms');
        Schema::dropIfExists('medicine_categories');
    }
};
