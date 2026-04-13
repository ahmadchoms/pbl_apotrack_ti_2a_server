<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('medicines', function (Blueprint $table) {

            $table->uuid("id")->primary();
            $table->foreignUuid("pharmacy_id")->constrained()->cascadeOnDelete();
            $table->foreignUuid("category_id")->constrained("medicine_categories");
            $table->foreignUuid("form_id")->constrained("medicine_forms");
            $table->string("name");
            $table->text("description")->nullable();
            $table->decimal("price", 12, 2);
            $table->integer("stock");
            $table->string("unit");
            $table->text("image_url")->nullable();
            $table->boolean("is_active")->default(true);
            $table->timestamps();
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('medicines');
    }
};
