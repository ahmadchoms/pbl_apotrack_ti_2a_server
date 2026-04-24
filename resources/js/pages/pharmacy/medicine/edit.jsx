import PharmacistEditMedicine from "@/features/pharmacy/pages/medicines/edit";

export default function EditMedicinePage({
    medicine = {},
    categories = [],
    units = [],
    types = [],
    forms = [],
}) {
    // Prop 'medicine' wajib ada karena membawa data obat yang akan diedit dari database
    return (
        <PharmacistEditMedicine
            medicine={medicine}
            categories={categories}
            units={units}
            types={types}
            forms={forms}
        />
    );
}
