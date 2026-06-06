<?php

namespace App\Events;

use App\Models\Pharmacy;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PharmacyThresholdBreached
{
    use Dispatchable, SerializesModels;

    /**
     * The pharmacy instance.
     *
     * @var Pharmacy
     */
    public Pharmacy $pharmacy;

    /**
     * The count of bad reviews.
     *
     * @var int
     */
    public int $badReviewsCount;

    /**
     * Create a new event instance.
     *
     * @param Pharmacy $pharmacy
     * @param int $badReviewsCount
     */
    public function __construct(Pharmacy $pharmacy, int $badReviewsCount)
    {
        $this->pharmacy = $pharmacy;
        $this->badReviewsCount = $badReviewsCount;
    }
}
