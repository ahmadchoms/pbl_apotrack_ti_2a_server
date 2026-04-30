<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\SoftDeletes;

class Medicine extends Model
{
    use HasUuids, SoftDeletes, \App\Models\Traits\HasSearchScope;

    protected $fillable = [
        'pharmacy_id',
        'category_id',
        'form_id',
        'type_id',
        'unit_id',
        'name',
        'generic_name',
        'manufacturer',
        'description',
        'dosage_info',
        'price',
        'requires_prescription',
        'weight_in_grams',
        'is_active',
    ];

    protected array $searchColumns = ['name', 'generic_name'];

    public function pharmacy()
    {
        return $this->belongsTo(Pharmacy::class);
    }

    public function category()
    {
        return $this->belongsTo(MedicineCategory::class);
    }

    public function form()
    {
        return $this->belongsTo(MedicineForm::class);
    }

    public function type()
    {
        return $this->belongsTo(MedicineType::class);
    }

    public function unit()
    {
        return $this->belongsTo(MedicineUnit::class);
    }

    public function images()
    {
        return $this->hasMany(MedicineImage::class);
    }

    public function batches()
    {
        return $this->hasMany(MedicineBatch::class);
    }

    public function stockMovements()
    {
        return $this->hasMany(StockMovement::class);
    }

    // Local Scopes
    public function scopeWithTotalActiveStock($query)
    {
        return $query->withSum(['batches as total_active_stock' => function ($sq) {
            $sq->where('expired_date', '>', now());
        }], 'stock');
    }

    public function scopeFilterByCategory($query, $category)
    {
        return $query->when($category && $category !== 'Semua', function ($q) use ($category) {
            $q->whereHas('category', function ($sq) use ($category) {
                $sq->where('name', $category);
            });
        });
    }

    public function scopeFilterByStatus($query, $status)
    {
        return $query->when($status, function ($q) use ($status) {
            if ($status === 'low') {
                $q->whereIn('id', function ($sub) {
                    $sub->select('medicine_id')
                        ->from('medicine_batches')
                        ->groupBy('medicine_id')
                        ->havingRaw('SUM(stock) <= 10');
                });
            } elseif ($status === 'expiring') {
                $q->whereHas('batches', function ($sq) {
                    $sq->where('expired_date', '<=', now()->addMonths(3));
                });
            }
        });
    }

    public function primaryImage()
    {
        return $this->hasOne(MedicineImage::class)
            ->where('is_primary', true);
    }
}
