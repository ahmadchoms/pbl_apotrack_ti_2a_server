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
        Schema::table('pharmacies', function (Blueprint $table) {
            $table->string('logo_url')->nullable()->after('phone');
        });

        Schema::dropIfExists('pharmacy_images');
    }

    public function down(): void
    {
        Schema::create('pharmacy_images', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('pharmacy_id')->constrained()->cascadeOnDelete();
            $table->string('image_url');
            $table->boolean('is_primary')->default(false);
            $table->timestamps();
        });

        Schema::table('pharmacies', function (Blueprint $table) {
            $table->dropColumn('logo_url');
        });
    }
};
