<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Pharmacy;
use App\Models\User;
use App\Models\PharmacyStaff;
use App\Models\PharmacyOperatingHour;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Support\Str;

class PharmacyController extends Controller
{
    public function index(Request $request)
    {
        $query = Pharmacy::query()
            ->select([
                'id', 'name', 'address', 'phone', 'latitude', 'longitude',
                'rating', 'total_reviews', 'license_number',
                'verification_status', 'is_active', 'is_force_closed', 'created_at'
            ])
            ->with([
                'staffs' => fn($q) => $q->select('id', 'pharmacy_id', 'user_id', 'role', 'is_active')
                    ->with(['user' => fn($u) => $u->select('id', 'username', 'avatar_url')]),
                'hours' => fn($q) => $q->select('pharmacy_id', 'day_of_week', 'open_time', 'close_time', 'is_closed', 'is_24_hours'),
                'images' => fn($q) => $q->select('pharmacy_id', 'image_url', 'is_primary')->where('is_primary', true)->limit(1),
            ])
            ->withCount(['orders', 'medicines'])
            ->latest();

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'ilike', "%{$request->search}%")
                  ->orWhere('address', 'ilike', "%{$request->search}%")
                  ->orWhere('phone', 'ilike', "%{$request->search}%");
            });
        }

        if ($request->status && $request->status !== 'all') {
            match ($request->status) {
                'verified' => $query->where('verification_status', 'VERIFIED'),
                'pending' => $query->where('verification_status', 'PENDING'),
                'rejected' => $query->where('verification_status', 'REJECTED'),
                'active' => $query->where('is_active', true)->where('is_force_closed', false),
                'closed' => $query->where(fn($q) => $q->where('is_active', false)->orWhere('is_force_closed', true)),
                default => null,
            };
        }

        $pharmacies = $query->paginate(12)->withQueryString();

        return Inertia::render('admin/pharmacies/index', [
            'pharmacies' => $pharmacies,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/pharmacies/create', [
            'available_staff' => User::whereIn('role', ['PHARMACY_STAFF', 'APOTEKER'])
                ->select('id', 'username', 'email', 'role', 'avatar_url')
                ->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:150',
            'address' => 'required|string',
            'phone' => 'nullable|string|max:20',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'license_number' => 'nullable|string|max:100',
            'verification_status' => 'required|in:PENDING,VERIFIED,REJECTED',
            'is_active' => 'boolean',
            'hours' => 'array',
            'hours.*.day_of_week' => 'required|integer|between:0,6',
            'hours.*.open_time' => 'nullable|string',
            'hours.*.close_time' => 'nullable|string',
            'hours.*.is_closed' => 'boolean',
            'hours.*.is_24_hours' => 'boolean',
            'staffs' => 'array',
            'staffs.*.user_id' => 'required|exists:users,id',
            'staffs.*.role' => 'required|in:APOTEKER,STAFF',
        ]);

        DB::transaction(function () use ($validated) {
            $pharmacy = Pharmacy::create([
                'id' => (string) Str::uuid(),
                'name' => $validated['name'],
                'address' => $validated['address'],
                'phone' => $validated['phone'],
                'latitude' => $validated['latitude'],
                'longitude' => $validated['longitude'],
                'license_number' => $validated['license_number'],
                'verification_status' => $validated['verification_status'],
                'is_active' => $validated['is_active'] ?? true,
            ]);

            foreach ($validated['hours'] as $hour) {
                PharmacyOperatingHour::create([
                    'id' => (string) Str::uuid(),
                    'pharmacy_id' => $pharmacy->id,
                    'day_of_week' => $hour['day_of_week'],
                    'open_time' => $hour['open_time'],
                    'close_time' => $hour['close_time'],
                    'is_closed' => $hour['is_closed'] ?? false,
                    'is_24_hours' => $hour['is_24_hours'] ?? false,
                ]);
            }

            foreach ($validated['staffs'] as $staff) {
                PharmacyStaff::create([
                    'id' => (string) Str::uuid(),
                    'pharmacy_id' => $pharmacy->id,
                    'user_id' => $staff['user_id'],
                    'role' => $staff['role'],
                    'is_active' => true,
                ]);
            }
        });

        return redirect()->route('admin.pharmacies')->with('success', 'Apotek berhasil ditambahkan');
    }

    public function edit($id)
    {
        $pharmacy = Pharmacy::with([
            'staffs' => fn($q) => $q->select('id', 'pharmacy_id', 'user_id', 'role')
                ->with(['user' => fn($u) => $u->select('id', 'username', 'email', 'avatar_url')]),
            'hours' => fn($q) => $q->select('id', 'pharmacy_id', 'day_of_week', 'open_time', 'close_time', 'is_closed', 'is_24_hours'),
            'images' => fn($q) => $q->select('id', 'pharmacy_id', 'image_url', 'is_primary', 'sort_order'),
        ])->findOrFail($id);

        return Inertia::render('admin/pharmacies/edit', [
            'pharmacy' => $pharmacy,
            'available_staff' => User::whereIn('role', ['PHARMACY_STAFF', 'APOTEKER'])
                ->select('id', 'username', 'email', 'role', 'avatar_url')
                ->get()
        ]);
    }

    public function update(Request $request, $id)
    {
        $pharmacy = Pharmacy::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:150',
            'address' => 'required|string',
            'phone' => 'nullable|string|max:20',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'license_number' => 'nullable|string|max:100',
            'verification_status' => 'required|in:PENDING,VERIFIED,REJECTED',
            'is_active' => 'boolean',
            'is_force_closed' => 'boolean',
            'hours' => 'array',
            'hours.*.day_of_week' => 'required|integer|between:0,6',
            'hours.*.open_time' => 'nullable|string',
            'hours.*.close_time' => 'nullable|string',
            'hours.*.is_closed' => 'boolean',
            'hours.*.is_24_hours' => 'boolean',
            'staffs' => 'array',
            'staffs.*.user_id' => 'required|exists:users,id',
            'staffs.*.role' => 'required|in:APOTEKER,STAFF',
        ]);

        DB::transaction(function () use ($pharmacy, $validated) {
            $pharmacy->update([
                'name' => $validated['name'],
                'address' => $validated['address'],
                'phone' => $validated['phone'],
                'latitude' => $validated['latitude'],
                'longitude' => $validated['longitude'],
                'license_number' => $validated['license_number'],
                'verification_status' => $validated['verification_status'],
                'is_active' => $validated['is_active'] ?? true,
                'is_force_closed' => $validated['is_force_closed'] ?? false,
            ]);

            // Sync hours
            $pharmacy->hours()->delete();
            foreach ($validated['hours'] as $hour) {
                PharmacyOperatingHour::create([
                    'id' => (string) Str::uuid(),
                    'pharmacy_id' => $pharmacy->id,
                    'day_of_week' => $hour['day_of_week'],
                    'open_time' => $hour['open_time'],
                    'close_time' => $hour['close_time'],
                    'is_closed' => $hour['is_closed'] ?? false,
                    'is_24_hours' => $hour['is_24_hours'] ?? false,
                ]);
            }

            // Sync staffs
            $pharmacy->staffs()->delete();
            foreach ($validated['staffs'] as $staff) {
                PharmacyStaff::create([
                    'id' => (string) Str::uuid(),
                    'pharmacy_id' => $pharmacy->id,
                    'user_id' => $staff['user_id'],
                    'role' => $staff['role'],
                    'is_active' => true,
                ]);
            }
        });

        return redirect()->route('admin.pharmacies')->with('success', 'Apotek berhasil diperbarui');
    }

    public function destroy($id)
    {
        $pharmacy = Pharmacy::findOrFail($id);
        
        DB::transaction(function() use ($pharmacy) {
            $pharmacy->staffs()->delete();
            $pharmacy->hours()->delete();
            $pharmacy->images()->delete();
            $pharmacy->delete();
        });

        return redirect()->route('admin.pharmacies')->with('success', 'Apotek berhasil dihapus');
    }

    public function detail($id)
    {
        $pharmacy = Pharmacy::with([
            'staffs' => function ($q) {
                $q->select(['id', 'pharmacy_id', 'user_id', 'role'])
                    ->with(['user' => function ($uq) {
                        $uq->select(['id', 'username', 'email', 'avatar_url', 'phone']);
                    }]);
            }
        ])
            ->select([
                'id', 'name', 'address', 'phone', 'license_number',
                'verification_status', 'rating', 'total_reviews',
                'is_active', 'created_at', 'latitude', 'longitude'
            ])
            ->findOrFail($id);

        $pharmacist = $pharmacy->staffs->where('role', 'APOTEKER')->first();

        $months_order = $pharmacy->orders()
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->get();

        return Inertia::render('admin/pharmacies/detail', [
            'pharmacy' => $pharmacy,
            'pharmacist' => $pharmacist ? [
                'name' => $pharmacist->user->username,
                'avatar' => $pharmacist->user->avatar_url,
                'sipa' => '1992/0812/2023',
                'phone' => $pharmacist->user->phone
            ] : null,
            'stats' => [
                'joined_at' => $pharmacy->created_at->format('d M Y'),
                'total_orders' => $months_order->count(),
            ]
        ]);
    }
}
