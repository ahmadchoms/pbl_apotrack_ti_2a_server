<?php

namespace App\Events;

use App\Models\PharmacyStaff;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class StaffRemoved
{
    use Dispatchable, SerializesModels;

    public $staff;

    public function __construct(PharmacyStaff $staff)
    {
        $this->staff = $staff;
    }
}
