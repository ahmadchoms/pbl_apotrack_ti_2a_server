<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {

            $table->uuid("id")->primary();
            $table->string("full_name");
            $table->string("phone")->nullable();
            $table->string("email")->unique();
            $table->string("password_hash");
            $table->string("role");
            $table->boolean("is_active")->default(true);
            $table->timestamps();
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
