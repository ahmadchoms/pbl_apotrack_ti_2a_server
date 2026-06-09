<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$o = App\Models\Order::find('019ea852-2737-73b4-b39c-ddf27b124ac0');
echo 'Order status: ' . ($o->order_status ?? 'NOT FOUND') . "\n";
$t = $o?->tracking;
if ($t) {
    echo 'biteship_id: ' . ($t->biteship_id ?? 'NULL') . "\n";
    echo 'tracking status: ' . $t->status . "\n";
} else {
    echo 'No tracking' . "\n";
}
