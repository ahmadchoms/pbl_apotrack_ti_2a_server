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
        Schema::dropIfExists('notifications');
        Schema::dropIfExists('delivery_tracking_logs');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Dead code removal, no reversal planned for now.
    }
};
