<?php

namespace App\Http\Controllers\Pharmacy;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Services\Pharmacy\ProfileService;
use Illuminate\Support\Facades\Auth;

class ProfileController extends Controller
{
    public function __construct(
        protected ProfileService $profileService
    ) {}

    public function index(Request $request)
    {
        $user = $request->user()->load('pharmacyStaff.pharmacy');
        $pharmacy = $user->pharmacyStaff->pharmacy->load('operatingHours');

        return Inertia::render('pharmacy/profile/index', [
            'user' => $user,
            'pharmacy' => $pharmacy,
            'operatingHours' => $pharmacy->operatingHours,
            'userActivities' => $this->profileService->getAuditLogs($user->id)->items(),
        ]);
    }

    public function updateUser(Request $request)
    {
        $data = $request->validate([
            'username' => 'required|string|max:50|unique:users,username,' . $request->user()->id,
        ]);

        $this->profileService->updateUserProfile($request->user(), $data);

        return redirect()->back()->with('success', 'Profil pengguna berhasil diperbarui');
    }

    public function update(Request $request)
    {
        if ($request->user()->pharmacyStaff->role !== 'APOTEKER') {
            abort(403, 'Hanya Apoteker yang dapat mengubah informasi apotek.');
        }

        $pharmacy = $request->user()->pharmacyStaff->pharmacy;

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'address' => 'required|string',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);

        $this->profileService->updatePharmacy($pharmacy, $data);

        return redirect()->back()->with('success', 'Profil apotek berhasil diperbarui');
    }

    public function updatePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required|current_password',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $this->profileService->updatePassword($request->user(), $request->password);

        return redirect()->back()->with('success', 'Password berhasil diubah');
    }

    public function updateHours(Request $request)
    {
        if ($request->user()->pharmacyStaff->role !== 'APOTEKER') {
            abort(403, 'Hanya Apoteker yang dapat mengubah jam operasional.');
        }

        $request->validate([
            'hours' => 'required|array',
            'hours.*.day_of_week' => 'required|integer|between:0,6',
            'hours.*.open_time' => 'nullable|string',
            'hours.*.close_time' => 'nullable|string',
            'hours.*.is_closed' => 'required|boolean',
            'hours.*.is_24_hours' => 'required|boolean',
        ]);

        $this->profileService->updateOperatingHours($request->hours);

        return redirect()->back()->with('success', 'Jam operasional berhasil diperbarui');
    }

    public function auditLogs(Request $request)
    {
        $filters = $request->only(['search', 'status']);
        $logs = $this->profileService->getAuditLogs($request->user()->id, $filters);

        return Inertia::render('pharmacy/profile/logs', [
            'logs' => $logs,
            'filters' => $filters,
        ]);
    }

    public function destroy(Request $request)
    {
        $request->validate([
            'password' => 'required|current_password',
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('home');
    }
}
