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

    public function show(Medicine $medicine)
    {
        $this->authorize('view', $medicine);

        $medicine->load(['category', 'unit', 'type', 'form', 'batches']);
        $history = $this->medicineService->getStockHistory($medicine->id);

        return response()->json([
            'medicine' => new MedicineResource($medicine),
            'history' => $history
        ]);
    }

    public function edit(Request $request, Medicine $medicine)
    {
        $this->authorize('update', $medicine);

        $medicine->load(['category', 'unit', 'type', 'form', 'batches']);

        return Inertia::render('pharmacy/medicine/edit', [
            'medicine' => new MedicineResource($medicine),
            'categories' => MedicineCategory::all(['id', 'name']),
            'units' => MedicineUnit::all(['id', 'name']),
            'types' => MedicineType::all(['id', 'name']),
            'forms' => MedicineForm::all(['id', 'name']),
        ]);
    }

    public function update(UpdateMedicineRequest $request, Medicine $medicine)
    {
        $this->authorize('update', $medicine);

        $this->medicineService->update($medicine, $request->validated());

        return redirect()->route('pharmacy.medicines.index')
            ->with('success', 'Obat berhasil diperbarui');
    }

    public function destroy(Request $request, Medicine $medicine)
    {
        $this->authorize('delete', $medicine);

        $medicine->delete();
        return redirect()->back()->with('success', 'Obat berhasil dihapus');
    }

    public function addBatch(Request $request, Medicine $medicine)
    {
        $this->authorize('update', $medicine);

        $validated = $request->validate([
            'batch_number' => 'required|string|max:50',
            'expired_date' => 'required|date|after:today',
            'stock' => 'required|integer|min:0',
            'note' => 'nullable|string'
        ]);

        $this->medicineService->addBatch($medicine->id, $validated, $request->user()->id);

        return redirect()->back()->with('success', 'Batch baru berhasil ditambahkan');
    }

    public function adjustStock(Request $request, string $batchId)
    {
        $batch = \App\Models\MedicineBatch::with('medicine')->findOrFail($batchId);
        $this->authorize('update', $batch->medicine);

        $validated = $request->validate([
            'new_stock' => 'required|integer|min:0',
            'note' => 'nullable|string'
        ]);

        $this->medicineService->adjustStock($batchId, $validated, $request->user()->id);

        return redirect()->back()->with('success', 'Stok berhasil disesuaikan');
    }
}
