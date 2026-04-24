import PharmacistMedicineCatalog from "@/features/pharmacy/pages/medicines/index";

export default function MedicineCatalogPage({
    medicines = { data: [], links: [] },
    categories = [],
    filters = {},
}) {
    return (
        <PharmacistMedicineCatalog
            medicines={medicines || { data: [], links: [] }}
            categories={categories || []}
            filters={filters || {}}
        />
    );
}
