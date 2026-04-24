<?php

namespace App\Http\Controllers\Pharmacy;

use App\Http\Controllers\Controller;
use App\Models\PharmacyStaff;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class StaffController extends Controller
{
    public function index(Request $request)
    {
        $query = PharmacyStaff::query()
            ->with(['user'])
            ->where('pharmacy_id', $request->user()->pharmacyStaff?->pharmacy_id);

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('username', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status') && $request->input('status') !== 'all') {
            $isActive = $request->input('status') === 'active';
            $query->where('is_active', $isActive);
        }

        $staff = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('pharmacy/staff', [
            'staff' => $staff,
            'filters' => $request->only(['search', 'status'])
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'username' => 'required|string|max:100',
            'email' => 'required|email|unique:users,email',
            'phone' => 'nullable|string|max:20',
            'password' => 'required|string|min:8',
            'role' => 'required|string|in:APOTEKER,STAFF',
            'is_active' => 'required|boolean',
        ]);

        return DB::transaction(function () use ($validated, $request) {
            $user = User::create([
                'username' => $validated['username'],
                'email' => $validated['email'],
                'phone' => $validated['phone'],
                'password_hash' => Hash::make($validated['password']),
                'role' => 'PHARMACY_STAFF',
                'is_active' => $validated['is_active'],
            ]);

            PharmacyStaff::create([
                'pharmacy_id' => $request->user()->pharmacyStaff->pharmacy_id,
                'user_id' => $user->id,
                'role' => $validated['role'],
                'is_active' => $validated['is_active'],
            ]);

            return redirect()->back()->with('success', 'Staff berhasil ditambahkan');
        });
    }

    public function update(Request $request, $id)
    {
        $staff = PharmacyStaff::findOrFail($id);

        $validated = $request->validate([
            'username' => 'required|string|max:100',
            'email' => 'required|email|unique:users,email,' . $staff->user_id,
            'phone' => 'nullable|string|max:20',
            'role' => 'required|string|in:APOTEKER,STAFF',
            'is_active' => 'required|boolean',
        ]);

        DB::transaction(function () use ($staff, $validated) {
            $staff->user->update([
                'username' => $validated['username'],
                'email' => $validated['email'],
                'phone' => $validated['phone'],
                'is_active' => $validated['is_active'],
            ]);

            $staff->update([
                'role' => $validated['role'],
                'is_active' => $validated['is_active'],
            ]);
        });

        return redirect()->back()->with('success', 'Staff berhasil diperbarui');
    }

    public function destroy($id)
    {
        $staff = PharmacyStaff::findOrFail($id);

        DB::transaction(function () use ($staff) {
            $user = $staff->user;
            $staff->delete();
            $user->delete();
        });

        return redirect()->back()->with('success', 'Staff berhasil dihapus');
    }
}
