<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->nullable()->constrained('users')->cascadeOnDelete();
            $table->string('action', 50); // e.g., 'SHIP_ORDER', 'UPDATE_PROFILE'
            $table->text('description');
            $table->string('status', 20)->default('SUCCESS');
            $table->json('metadata')->nullable(); // For machine data
            $table->timestamp('created_at')->useCurrent();

            $table->index(['user_id', 'action']);
            $table->index('created_at');
            $table->index(['user_id', 'created_at']);
            $table->index(['action', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
    }
};
