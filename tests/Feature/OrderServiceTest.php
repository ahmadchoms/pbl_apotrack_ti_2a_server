<?php

namespace Tests\Feature;

use App\Enums\OrderStatus;
use App\Exceptions\InsufficientStockException;
use App\Exceptions\InvalidOrderStatusTransitionException;
use App\Models\Medicine;
use App\Models\MedicineBatch;
use App\Models\MedicineCategory;
use App\Models\MedicineForm;
use App\Models\MedicineType;
use App\Models\MedicineUnit;
use App\Models\Order;
use App\Models\Pharmacy;
use App\Models\User;
use App\Services\Pharmacy\OrderService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class OrderServiceTest extends TestCase
{
    use RefreshDatabase;

    protected OrderService $orderService;
    protected Pharmacy $pharmacy;
    protected User $customer;
    protected Medicine $medicine;

    protected function setUp(): void
    {
        parent::setUp();
        $this->orderService = new OrderService();

        // Setup base data
        $this->pharmacy = Pharmacy::create([
            'name' => 'Test Pharmacy',
            'address' => 'Test Address',
            'phone' => '08123456789',
            'verification_status' => 'VERIFIED',
            'is_active' => true,
        ]);

        $this->customer = User::factory()->create(['role' => 'CUSTOMER']);

        $category = MedicineCategory::create(['name' => 'Obat Bebas']);
        $type = MedicineType::create(['name' => 'Generik']);
        $form = MedicineForm::create(['name' => 'Tablet']);
        $unit = MedicineUnit::create(['name' => 'Strip']);

        $this->medicine = Medicine::create([
            'pharmacy_id' => $this->pharmacy->id,
            'category_id' => $category->id,
            'type_id' => $type->id,
            'form_id' => $form->id,
            'unit_id' => $unit->id,
            'name' => 'Paracetamol',
            'price' => 5000,
            'weight_in_grams' => 10,
            'requires_prescription' => false,
            'is_active' => true,
        ]);
    }

    #[Test]
    public function it_can_create_pos_order_successfully_and_reduce_stock()
    {
        // Add stock batches
        $this->medicine->batches()->create([
            'batch_number' => 'B001',
            'expired_date' => now()->addYear(),
            'stock' => 50,
        ]);

        $this->medicine->batches()->create([
            'batch_number' => 'B002',
            'expired_date' => now()->addMonths(6), // FIFO should pick this first if we order by expired_date asc
            'stock' => 30,
        ]);

        $data = [
            'user_id' => $this->customer->id,
            'payment_method' => 'CASH',
            'total' => 10000,
            'items' => [
                [
                    'id' => $this->medicine->id,
                    'quantity' => 40,
                    'price' => 5000,
                ]
            ]
        ];

        $order = $this->orderService->createPOSOrder($this->pharmacy->id, $data);

        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'pharmacy_id' => $this->pharmacy->id,
            'order_status' => 'COMPLETED',
        ]);

        $this->assertDatabaseHas('order_items', [
            'order_id' => $order->id,
            'medicine_id' => $this->medicine->id,
            'quantity' => 40,
        ]);

        // Check stock reduction (FIFO)
        // B002 (30) + B001 (50)
        // Request 40: B002 becomes 0, B001 becomes 40 (50 - 10)
        $this->assertDatabaseHas('medicine_batches', [
            'batch_number' => 'B002',
            'stock' => 0,
        ]);

        $this->assertDatabaseHas('medicine_batches', [
            'batch_number' => 'B001',
            'stock' => 40,
        ]);
    }

    #[Test]
    public function it_throws_exception_if_stock_is_insufficient()
    {
        $this->medicine->batches()->create([
            'batch_number' => 'B001',
            'expired_date' => now()->addYear(),
            'stock' => 10,
        ]);

        $data = [
            'user_id' => $this->customer->id,
            'total' => 10000,
            'items' => [
                [
                    'id' => $this->medicine->id,
                    'quantity' => 15, // More than 10
                    'price' => 5000,
                ]
            ]
        ];

        $this->expectException(InsufficientStockException::class);

        try {
            $this->orderService->createPOSOrder($this->pharmacy->id, $data);
        } catch (InsufficientStockException $e) {
            // Verify no order was created (rollback)
            $this->assertEquals(0, Order::count());
            $this->assertEquals(10, MedicineBatch::where('batch_number', 'B001')->first()->stock);
            throw $e;
        }
    }

    #[Test]
    public function it_can_update_order_status_validly()
    {
        $order = Order::create([
            'user_id' => $this->customer->id,
            'pharmacy_id' => $this->pharmacy->id,
            'order_number' => 'ORD-123',
            'order_status' => OrderStatus::PENDING->value,
            'grand_total' => 5000,
        ]);

        $this->orderService->updateStatus($order->id, OrderStatus::PROCESSING);

        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'order_status' => OrderStatus::PROCESSING->value,
        ]);

        $this->assertDatabaseHas('order_status_logs', [
            'order_id' => $order->id,
            'status' => OrderStatus::PROCESSING->value,
        ]);
    }

    #[Test]
    public function it_throws_exception_on_invalid_status_transition()
    {
        $order = Order::create([
            'user_id' => $this->customer->id,
            'pharmacy_id' => $this->pharmacy->id,
            'order_number' => 'ORD-123',
            'order_status' => OrderStatus::PENDING->value,
            'grand_total' => 5000,
        ]);

        // PENDING to COMPLETED is invalid (must go through PROCESSING -> etc)
        $this->expectException(InvalidOrderStatusTransitionException::class);

        $this->orderService->updateStatus($order->id, OrderStatus::COMPLETED);
    }
}
