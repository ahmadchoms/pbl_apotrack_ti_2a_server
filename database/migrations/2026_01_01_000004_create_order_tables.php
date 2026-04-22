<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // CREATE Prescriptions first without order_id constraint, then Orders, then link.
        Schema::create('prescriptions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained('users');
            $table->uuid('order_id')->nullable();
            $table->string('image_url');
            $table->string('doctor_name', 100)->nullable();
            $table->string('patient_name', 100)->nullable();
            $table->date('issued_date')->nullable();
            $table->string('status', 20)->default('PENDING'); // PENDING | VERIFIED | REJECTED
            $table->foreignUuid('verified_by')->nullable()->constrained('users');
            $table->timestamp('verified_at')->nullable();
            $table->text('rejection_note')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->index('status');
        });

        Schema::create('orders', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained('users');
            $table->foreignUuid('pharmacy_id')->constrained('pharmacies');
            $table->foreignUuid('address_id')->nullable()->constrained('user_addresses');
            $table->foreignUuid('prescription_id')->nullable()->constrained('prescriptions');
            $table->string('order_number', 30)->unique();
            $table->string('service_type', 20); // DELIVERY | PICKUP
            $table->string('payment_method', 20); // COD | QRIS
            $table->string('order_status', 20)->default('PENDING');
            $table->string('payment_status', 20)->default('UNPAID');
            $table->decimal('subtotal_amount', 12, 2);
            $table->decimal('discount_amount', 12, 2)->default(0);
            $table->decimal('shipping_cost', 12, 2)->default(0);
            $table->decimal('grand_total', 12, 2);
            $table->text('notes')->nullable();
            $table->text('cancellation_reason')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamp('expired_at');
            $table->timestamps();

            $table->index('order_status');
            $table->index('payment_status');
            $table->index('created_at');
        });

        DB::statement('ALTER TABLE orders ADD CONSTRAINT chk_grand_total_non_negative CHECK (grand_total >= 0)');

        // Now link prescriptions to orders
        Schema::table('prescriptions', function (Blueprint $table) {
            $table->foreign('order_id')->references('id')->on('orders')->nullOnDelete();
        });

        Schema::create('order_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('order_id')->constrained('orders')->cascadeOnDelete();
            $table->foreignUuid('medicine_id')->constrained('medicines');
            $table->string('medicine_name', 200);
            $table->string('unit_name', 30);
            $table->boolean('requires_prescription')->default(false);
            $table->integer('quantity');
            $table->decimal('price', 12, 2);
            $table->decimal('subtotal', 12, 2);
        });

        DB::statement('ALTER TABLE order_items ADD CONSTRAINT chk_quantity_positive CHECK (quantity > 0)');

        Schema::create('delivery_trackings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('order_id')->unique()->constrained('orders')->cascadeOnDelete();
            $table->string('courier_name', 100)->nullable();
            $table->string('tracking_number', 50)->nullable();
            $table->string('status', 30)->default('WAITING_PICKUP');
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('delivery_tracking_logs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('delivery_tracking_id')->constrained('delivery_trackings')->cascadeOnDelete();
            $table->string('status', 30);
            $table->text('description')->nullable();
            $table->float('latitude', 10, 6)->nullable();
            $table->float('longitude', 10, 6)->nullable();
            $table->timestamp('created_at')->useCurrent();
        });

        Schema::create('payment_proofs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('order_id')->unique()->constrained('orders');
            $table->string('image_url');
            $table->string('bank_name', 50)->nullable();
            $table->decimal('amount', 12, 2);
            $table->string('status', 20)->default('PENDING'); // PENDING | VERIFIED | REJECTED
            $table->foreignUuid('verified_by')->nullable()->constrained('users');
            $table->timestamp('verified_at')->nullable();
            $table->text('note')->nullable();
            $table->timestamp('submitted_at')->useCurrent();

            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payment_proofs');
        Schema::dropIfExists('delivery_tracking_logs');
        Schema::dropIfExists('delivery_trackings');
        Schema::dropIfExists('order_items');
        Schema::table('prescriptions', function (Blueprint $table) {
            $table->dropForeign(['order_id']);
        });
        Schema::dropIfExists('orders');
        Schema::dropIfExists('prescriptions');
    }
};
