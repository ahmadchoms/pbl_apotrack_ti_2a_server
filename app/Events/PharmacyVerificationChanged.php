<?php

namespace App\Events;

use App\Models\Pharmacy;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PharmacyVerificationChanged
{
    use Dispatchable, SerializesModels;

    public $pharmacy;
    public $status;

    public function __construct(Pharmacy $pharmacy, $status)
    {
        $this->pharmacy = $pharmacy;
        $this->status = $status;
    }
}