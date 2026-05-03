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
            $table->softDeletes();
        });

        Schema::table('medicine_batches', function (Blueprint $table) {
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pharmacy_staffs', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });

        Schema::table('medicine_batches', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });
    }
};
