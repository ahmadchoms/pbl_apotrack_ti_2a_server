<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class GeneratePharmacyModels extends Command
{
        protected $signature = 'generate:pharmacy-models';
        protected $description = 'Generate all models with migrations and relationships';

        public function handle()
        {
                $models = [
                        'User',
                        'UserAddress',
                        'Pharmacy',
                        'PharmacyOperatingHour',
                        'MedicineCategory',
                        'MedicineForm',
                        'Medicine',
                        'Order',
                        'OrderItem',
                        'Notification',
                        'Review'
                ];

                foreach ($models as $model) {
                        $this->call('make:model', [
                                'name' => $model,
                                '--migration' => true
                        ]);
                }

                $this->info('Models & migrations created.');

                $this->generateMigrations();
                $this->generateRelationships();

                $this->info('All generated successfully.');
        }

        private function generateMigrations()
        {
                $map = [
                        'create_users_table' => 'usersMigration',
                        'create_user_addresses_table' => 'userAddressesMigration',
                        'create_pharmacies_table' => 'pharmaciesMigration',
                        'create_medicines_table' => 'medicinesMigration',
                        'create_orders_table' => 'ordersMigration',
                        'create_order_items_table' => 'orderItemsMigration',
                        'create_reviews_table' => 'reviewsMigration',
                ];

                foreach (glob(database_path('migrations/*.php')) as $file) {

                        foreach ($map as $key => $method) {

                                if (str_contains($file, $key)) {

                                        if (!method_exists($this, $method)) {
                                                $this->error("❌ Method {$method} not found");
                                                continue;
                                        }

                                        File::put($file, $this->$method());
                                }
                        }
                }
        }

        private function generateRelationships()
        {
                $relations = [
                        'User' => '
    public function addresses() { return $this->hasMany(UserAddress::class); }
    public function pharmacies() { return $this->hasMany(Pharmacy::class, "admin_id"); }
    public function orders() { return $this->hasMany(Order::class); }
    public function notifications() { return $this->hasMany(Notification::class); }
    public function reviews() { return $this->hasMany(Review::class); }
            ',

                        'UserAddress' => '
    public function user() { return $this->belongsTo(User::class); }
            ',

                        'Pharmacy' => '
    public function admin() { return $this->belongsTo(User::class, "admin_id"); }
    public function medicines() { return $this->hasMany(Medicine::class); }
    public function orders() { return $this->hasMany(Order::class); }
    public function reviews() { return $this->hasMany(Review::class); }
    public function operatingHours() { return $this->hasMany(PharmacyOperatingHour::class); }
            ',

                        'PharmacyOperatingHour' => '
    public function pharmacy() { return $this->belongsTo(Pharmacy::class); }
            ',

                        'Medicine' => '
    public function pharmacy() { return $this->belongsTo(Pharmacy::class); }
    public function category() { return $this->belongsTo(MedicineCategory::class); }
    public function form() { return $this->belongsTo(MedicineForm::class); }
    public function orderItems() { return $this->hasMany(OrderItem::class); }
            ',

                        'Order' => '
    public function user() { return $this->belongsTo(User::class); }
    public function pharmacy() { return $this->belongsTo(Pharmacy::class); }
    public function address() { return $this->belongsTo(UserAddress::class); }
    public function items() { return $this->hasMany(OrderItem::class); }
    public function review() { return $this->hasOne(Review::class); }
            ',

                        'OrderItem' => '
    public function order() { return $this->belongsTo(Order::class); }
    public function medicine() { return $this->belongsTo(Medicine::class); }
            ',

                        'Notification' => '
    public function user() { return $this->belongsTo(User::class); }
            ',

                        'Review' => '
    public function user() { return $this->belongsTo(User::class); }
    public function pharmacy() { return $this->belongsTo(Pharmacy::class); }
    public function order() { return $this->belongsTo(Order::class); }
            ',

                ];

                foreach ($relations as $model => $code) {
                        $path = app_path("Models/{$model}.php");

                        if (!File::exists($path)) continue;

                        $content = File::get($path);

                        $content = preg_replace(
                                '/class\s+' . $model . '\s+extends\s+Model\s*{/',
                                "class {$model} extends BaseModel\n{\n{$code}",
                                $content
                        );

                        File::put($path, $content);
                }
        }

        // ================= MIGRATIONS =================

        private function usersMigration()
        {
                return $this->stub('users', '
$table->uuid("id")->primary();
$table->string("full_name");
$table->string("phone")->nullable();
$table->string("email")->unique();
$table->string("password_hash");
$table->string("role");
$table->boolean("is_active")->default(true);
$table->timestamps();
');
        }

        private function userAddressesMigration()
        {
                return $this->stub('user_addresses', '
$table->uuid("id")->primary();
$table->foreignUuid("user_id")->constrained()->cascadeOnDelete();
$table->string("label");
$table->text("address_detail");
$table->float("latitude");
$table->float("longitude");
$table->boolean("is_primary")->default(false);
');
        }

        private function pharmaciesMigration()
        {
                return $this->stub('pharmacies', '
$table->uuid("id")->primary();
$table->foreignUuid("admin_id")->constrained("users")->cascadeOnDelete();
$table->string("name");
$table->text("address");
$table->float("latitude");
$table->float("longitude");
$table->float("rating")->default(0);
$table->boolean("is_open")->default(true);
$table->boolean("is_active")->default(true);
$table->timestamps();
');
        }

        private function medicinesMigration()
        {
                return $this->stub('medicines', '
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
');
        }

        private function ordersMigration()
        {
                return $this->stub('orders', '
$table->uuid("id")->primary();
$table->foreignUuid("user_id")->constrained()->cascadeOnDelete();
$table->foreignUuid("pharmacy_id")->constrained();
$table->foreignUuid("address_id")->constrained("user_addresses");
$table->string("service_type");
$table->string("payment_method");
$table->string("order_status");
$table->string("payment_status");
$table->decimal("total_price", 12, 2);
$table->timestamps();
');
        }

        private function orderItemsMigration()
        {
                return $this->stub('order_items', '
$table->uuid("id")->primary();
$table->foreignUuid("order_id")->constrained()->cascadeOnDelete();
$table->foreignUuid("medicine_id")->constrained();
$table->integer("quantity");
$table->decimal("price", 12, 2);
$table->decimal("subtotal", 12, 2);
');
        }

        private function reviewsMigration()
        {
                return $this->stub('reviews', '
$table->uuid("id")->primary();
$table->foreignUuid("user_id")->constrained();
$table->foreignUuid("pharmacy_id")->constrained();
$table->foreignUuid("order_id")->unique();
$table->integer("rating");
$table->text("comment")->nullable();
$table->timestamps();
');
        }



        private function stub($table, $fields)
        {
                return <<<PHP
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
public function up(): void {
    Schema::create('$table', function (Blueprint \$table) {
        $fields
    });
}
public function down(): void {
    Schema::dropIfExists('$table');
}
};
PHP;
        }
}
