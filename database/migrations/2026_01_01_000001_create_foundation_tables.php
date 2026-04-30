<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('username', 100);
            $table->string('phone', 20)->nullable();
            $table->string('email', 100)->unique();
            $table->string('password_hash');
            $table->string('role', 20)->default('USERS');
            $table->string('avatar_url')->nullable();
            $table->boolean('is_active')->default(true);
            $table->softDeletes();
            $table->timestamps();

            $table->index('role');
        });

        Schema::create('user_addresses', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('label', 50);
            $table->text('address_detail');
            $table->float('latitude', 10, 6);
            $table->float('longitude', 10, 6);
            $table->boolean('is_primary')->default(false);
            $table->timestamps();

            $table->index(['user_id', 'is_primary']);
        });

        // Unique index for primary address
        DB::statement('CREATE UNIQUE INDEX idx_user_primary_address ON user_addresses (user_id) WHERE is_primary = true');
    }

    public function down(): void
    {
        Schema::dropIfExists('user_addresses');
        Schema::dropIfExists('users');
    }
};
