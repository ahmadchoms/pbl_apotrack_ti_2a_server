import PharmacistCreateMedicine from "@/features/pharmacy/pages/medicines/create";

export default function CreateMedicinePage({
    categories = [],
    units = [],
    types = [],
    forms = [],
}) {
    return (
        <PharmacistCreateMedicine
            categories={categories}
            units={units}
            types={types}
            forms={forms}
        />
    );
}
