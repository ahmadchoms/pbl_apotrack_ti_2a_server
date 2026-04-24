<?php
/*
 * Created At: 2026-04-24T09:50:34Z
 * Completed At: 2026-04-24T09:50:35Z
 */

namespace App\Http\Controllers\Pharmacy;

use App\Http\Controllers\Controller;
use App\Models\Medicine;
use App\Models\MedicineCategory;
use App\Models\MedicineForm;
use App\Models\MedicineType;
use App\Models\MedicineUnit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class MedicineController extends Controller
{
    public function index(Request $request)
    {
        $query = Medicine::query()
            ->with(['category', 'form', 'type', 'unit', 'images', 'batches'])
            ->withSum(['batches as total_active_stock' => function ($query) {
                $query->where('expired_date', '>', now());
            }], 'stock');

        // Server-side filtering
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('generic_name', 'like', "%{$search}%");
            });
        }

        if ($request->filled('category') && $request->input('category') !== 'Semua') {
            $categoryName = $request->input('category');
            $query->whereHas('category', function ($q) use ($categoryName) {
                $q->where('name', $categoryName);
            });
        }

        if ($request->filled('status')) {
            $status = $request->input('status');
            if ($status === 'low') {
                $query->whereIn('id', function ($sub) {
                    $sub->select('medicine_id')
                        ->from('medicine_batches')
                        ->groupBy('medicine_id')
                        ->havingRaw('SUM(stock) <= 10');
                });
            } elseif ($status === 'expiring') {
                $query->whereHas('batches', function ($q) {
                    $q->where('expired_date', '<=', now()->addMonths(3));
                });
            }
        }

        $medicines = $query->latest()->paginate(8)->withQueryString();

        // Transform data to match frontend requirements if necessary
        $medicines->getCollection()->transform(function ($medicine) {
            return [
                'id' => $medicine->id,
                'name' => $medicine->name,
                'generic_name' => $medicine->generic_name,
                'manufacturer' => $medicine->manufacturer,
                'price' => (float) $medicine->price,
                'requires_prescription' => (bool) $medicine->requires_prescription,
                'is_active' => (bool) $medicine->is_active,
                'category' => $medicine->category?->name,
                'form' => $medicine->form?->name,
                'type' => $medicine->type?->name,
                'unit' => $medicine->unit?->name,
                'images' => $medicine->images,
                'batches' => $medicine->batches,
                'total_active_stock' => (int) $medicine->total_active_stock,
            ];
        });

        return Inertia::render('pharmacy/medicine/index', [
            'medicines' => $medicines,
            'categories' => MedicineCategory::all(['id', 'name']),
            'filters' => $request->only(['search', 'category', 'status'])
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

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'generic_name' => 'nullable|string|max:255',
            'manufacturer' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'dosage_info' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'weight_in_grams' => 'nullable|numeric|min:0',
            'category' => 'required|string|exists:medicine_categories,name',
            'type' => 'required|string|exists:medicine_types,name',
            'form' => 'required|string|exists:medicine_forms,name',
            'unit' => 'required|string|exists:medicine_units,name',
            'requires_prescription' => 'required|boolean',
            'is_active' => 'required|boolean',
            'batches' => 'required|array|min:1',
            'batches.*.batch_number' => 'required|string',
            'batches.*.expired_date' => 'required|date',
            'batches.*.stock' => 'required|integer|min:0',
        ]);

        return DB::transaction(function () use ($validated, $request) {
            $category = MedicineCategory::where('name', $validated['category'])->first();
            $type = MedicineType::where('name', $validated['type'])->first();
            $form = MedicineForm::where('name', $validated['form'])->first();
            $unit = MedicineUnit::where('name', $validated['unit'])->first();

            $medicine = Medicine::create([
                'pharmacy_id' => $request->user()->pharmacyStaff->pharmacy_id,
                'category_id' => $category->id,
                'type_id' => $type->id,
                'form_id' => $form->id,
                'unit_id' => $unit->id,
                'name' => $validated['name'],
                'generic_name' => $validated['generic_name'],
                'manufacturer' => $validated['manufacturer'],
                'description' => $validated['description'],
                'dosage_info' => $validated['dosage_info'],
                'price' => $validated['price'],
                'weight_in_grams' => $validated['weight_in_grams'],
                'requires_prescription' => $validated['requires_prescription'],
                'is_active' => $validated['is_active'],
            ]);

            foreach ($validated['batches'] as $batchData) {
                $medicine->batches()->create($batchData);
            }

            return redirect()->route('pharmacy.medicines.index')->with('success', 'Obat berhasil ditambahkan');
        });
    }

    public function edit($id)
    {
        $medicine = Medicine::with(['category', 'unit', 'type', 'form', 'images', 'batches'])
            ->findOrFail($id);

        return Inertia::render('pharmacy/medicine/edit', [
            'medicine' => $medicine,
            'categories' => MedicineCategory::all(['id', 'name']),
            'units' => MedicineUnit::all(['id', 'name']),
            'types' => MedicineType::all(['id', 'name']),
            'forms' => MedicineForm::all(['id', 'name']),
        ]);
    }

    public function update(Request $request, $id)
    {
        $medicine = Medicine::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'generic_name' => 'nullable|string|max:255',
            'manufacturer' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'dosage_info' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'weight_in_grams' => 'nullable|numeric|min:0',
            'category' => 'required|string|exists:medicine_categories,name',
            'type' => 'required|string|exists:medicine_types,name',
            'form' => 'required|string|exists:medicine_forms,name',
            'unit' => 'required|string|exists:medicine_units,name',
            'requires_prescription' => 'required|boolean',
            'is_active' => 'required|boolean',
            'batches' => 'required|array|min:1',
            'batches.*.batch_number' => 'required|string',
            'batches.*.expired_date' => 'required|date',
            'batches.*.stock' => 'required|integer|min:0',
        ]);

        DB::transaction(function () use ($medicine, $validated) {
            $category = MedicineCategory::where('name', $validated['category'])->first();
            $type = MedicineType::where('name', $validated['type'])->first();
            $form = MedicineForm::where('name', $validated['form'])->first();
            $unit = MedicineUnit::where('name', $validated['unit'])->first();

            $medicine->update([
                'category_id' => $category->id,
                'type_id' => $type->id,
                'form_id' => $form->id,
                'unit_id' => $unit->id,
                'name' => $validated['name'],
                'generic_name' => $validated['generic_name'],
                'manufacturer' => $validated['manufacturer'],
                'description' => $validated['description'],
                'dosage_info' => $validated['dosage_info'],
                'price' => $validated['price'],
                'weight_in_grams' => $validated['weight_in_grams'],
                'requires_prescription' => $validated['requires_prescription'],
                'is_active' => $validated['is_active'],
            ]);

            // Sync batches (simple approach: delete and recreate for this MVP/demo)
            $medicine->batches()->delete();
            foreach ($validated['batches'] as $batchData) {
                $medicine->batches()->create($batchData);
            }
        });

        return redirect()->route('pharmacy.medicines.index')->with('success', 'Obat berhasil diperbarui');
    }

    public function destroy($id)
    {
        $medicine = Medicine::findOrFail($id);
        $medicine->delete();

        return redirect()->back()->with('success', 'Obat berhasil dihapus');
    }
}
