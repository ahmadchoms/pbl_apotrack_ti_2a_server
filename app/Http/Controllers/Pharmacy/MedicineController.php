<?php
/*
 * Created At: 2026-04-24T09:50:34Z
 * Completed At: 2026-04-24T09:50:35Z
 */

namespace App\Http\Controllers\Pharmacy;

use App\Http\Controllers\Controller;
use App\Http\Requests\Pharmacy\StoreMedicineRequest;
use App\Http\Requests\Pharmacy\UpdateMedicineRequest;
use App\Http\Resources\Pharmacy\MedicineResource;
use App\Models\Medicine;
use App\Models\MedicineCategory;
use App\Models\MedicineForm;
use App\Models\MedicineType;
use App\Models\MedicineUnit;
use App\Services\Pharmacy\MedicineService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MedicineController extends Controller
{
    public function __construct(
        protected MedicineService $medicineService
    ) {}

    public function index(Request $request)
    {
        $pharmacyId = $request->user()->pharmacyStaff->pharmacy_id;
        $filters = $request->only(['search', 'category', 'status']);
        $medicines = $this->medicineService->list($pharmacyId, $filters);

        return Inertia::render('pharmacy/medicine/index', [
            'medicines' => MedicineResource::collection($medicines),
            'categories' => MedicineCategory::all(['id', 'name']),
            'filters' => $filters
        ]);
    }

    public function create()
    {
        return Inertia::render('pharmacy/medicine/create', [
            'categories' => MedicineCategory::all(['id', 'name']),
            'units' => MedicineUnit::all(['id', 'name']),
            'types' => MedicineType::all(['id', 'name']),
            'forms' => MedicineForm::all(['id', 'name']),
        ]);
    }

    public function store(StoreMedicineRequest $request)
    {
        $this->medicineService->store(
            $request->user()->pharmacyStaff->pharmacy_id,
            $request->validated()
        );

        return redirect()->route('pharmacy.medicines.index')
            ->with('success', 'Obat berhasil ditambahkan');
    }

    public function edit(Request $request, string $id)
    {
        $medicine = Medicine::query()
            ->where('pharmacy_id', $request->user()->pharmacyStaff->pharmacy_id)
            ->with(['category', 'unit', 'type', 'form', 'images', 'batches'])
            ->findOrFail($id);

        return Inertia::render('pharmacy/medicine/edit', [
            'medicine' => new MedicineResource($medicine),
            'categories' => MedicineCategory::all(['id', 'name']),
            'units' => MedicineUnit::all(['id', 'name']),
            'types' => MedicineType::all(['id', 'name']),
            'forms' => MedicineForm::all(['id', 'name']),
        ]);
    }

    public function update(UpdateMedicineRequest $request, string $id)
    {
        $medicine = Medicine::where('pharmacy_id', $request->user()->pharmacyStaff->pharmacy_id)
            ->findOrFail($id);
        
        $this->medicineService->update($medicine, $request->validated());

        return redirect()->route('pharmacy.medicines.index')
            ->with('success', 'Obat berhasil diperbarui');
    }

    public function destroy(Request $request, Medicine $medicine)
    {
        if ($medicine->pharmacy_id !== $request->user()->pharmacyStaff->pharmacy_id) {
            abort(403);
        }

        $medicine->delete();
        return redirect()->back()->with('success', 'Obat berhasil dihapus');
    }
}
