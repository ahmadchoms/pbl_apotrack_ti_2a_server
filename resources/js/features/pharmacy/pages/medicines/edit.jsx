import React from "react";
import { DashboardPharmacyLayout } from "@/layouts/pharmacy-layout";
import { MedicineForm } from "@/features/pharmacy/components/medicine/MedicineForm";

export default function PharmacistEditMedicine({
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
                medicine={medicine}
                categories={categories}
                units={units}
                types={types}
                forms={forms}
            />
        </DashboardPharmacyLayout>
    );
}
