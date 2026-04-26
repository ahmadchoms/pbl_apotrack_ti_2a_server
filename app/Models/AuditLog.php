<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class AuditLog extends Model
{
    use HasUuids;

    public $timestamps = false; // We use created_at only

    protected $guarded = [];

    protected $casts = [
        'metadata' => 'array',
        'created_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Local Scopes
    public function scopeSearch($query, $search)
    {
        return $query->when($search, function ($q) use ($search) {
            $q->where(function ($sq) use ($search) {
                $sq->where('description', 'ilike', "%{$search}%")
                  ->orWhere('action', 'ilike', "%{$search}%");
            });
        });
    }

    public function scopeFilterStatus($query, $status)
    {
        return $query->when($status && $status !== 'all', function ($q) use ($status) {
            $q->where('status', $status);
        });
    }

    public function scopeFilterAction($query, $action)
    {
        return $query->when($action && $action !== 'all', function ($q) use ($action) {
            $q->where('action', $action);
        });
    }

    public function scopeFilterDate($query, $from, $to)
    {
        return $query->when($from, fn($q) => $q->whereDate('created_at', '>=', $from))
            ->when($to, fn($q) => $q->whereDate('created_at', '<=', $to));
    }
}
