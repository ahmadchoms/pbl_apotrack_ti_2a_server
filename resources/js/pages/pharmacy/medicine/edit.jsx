import { MedicineForm } from "@/features/pharmacy/components/medicine/MedicineForm";
import { DashboardPharmacyLayout } from "@/layouts/pharmacy-layout";

export default function EditMedicinePage({
    medicine = {},
    categories = [],
    units = [],
    types = [],
    forms = [],
}) {
    return (
        <DashboardPharmacyLayout activeMenu="Daftar Obat">
            <MedicineForm
                isEdit={true}
                medicine={medicine.data}
                categories={categories}
                units={units}
                types={types}
                forms={forms}
            />
        </DashboardPharmacyLayout>
    );
}
