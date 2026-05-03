import { MedicineForm } from "@/features/pharmacy/components/medicine/MedicineForm";
import { DashboardPharmacyLayout } from "@/layouts/pharmacy-layout";

export default function CreateMedicinePage({
    categories = [],
    units = [],
    types = [],
    forms = [],
}) {
    return (
        <DashboardPharmacyLayout activeMenu="Daftar Obat">
            <MedicineForm
                isEdit={false}
                categories={categories}
                units={units}
                types={types}
                forms={forms}
            />
        </DashboardPharmacyLayout>
    );
}
