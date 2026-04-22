// resources/js/features/obat/pages/edit-obat-page.jsx

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, Save, ImagePlus } from "lucide-react";
import { kategoriOptions, validateObat } from "../schemas/obat-schema";

export default function EditObatPage({ obat, onBack, onSimpan }) {
    const [form, setForm] = useState({
        nama: "", kategori: "", satuan: "", harga: 0, stok: 0, ambangBatas: "", lokasiRak: "",
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [errors, setErrors]             = useState({});

    // Isi form dengan data dari Laravel/Inertia
    useEffect(() => {
        if (obat) {
            setForm({
                nama:        obat.nama        ?? "",
                kategori:    obat.kategori    ?? "",
                satuan:      obat.satuan      ?? obat.bentuk ?? "",
                harga:       obat.harga       ?? 0,
                stok:        obat.stok        ?? 0,
                ambangBatas: obat.ambangBatas ?? "",
                lokasiRak:   obat.lokasiRak   ?? "",
            });
            setImagePreview(obat.image ?? null);
        }
    }, [obat]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: null }));
    };

    const handleKategori = (value) => {
        setForm((prev) => ({ ...prev, kategori: value }));
        setErrors((prev) => ({ ...prev, kategori: null }));
    };

    const handleImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => setImagePreview(ev.target.result);
        reader.readAsDataURL(file);
    };

    const handleSubmit = () => {
        const { isValid, errors: err } = validateObat(form);
        if (!isValid) { setErrors(err); return; }
        onSimpan({ ...form, image: imagePreview });
    };

    return (
        <div className="p-8">
            <div className="mb-7">
                <p className="text-xs text-muted-foreground tracking-widest uppercase mb-1">Manajemen Inventaris</p>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={onBack}>
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="text-2xl font-bold text-[#1a2744]">Edit Obat</h1>
                </div>
            </div>

            <div className="flex gap-6 items-start">
                {/* Upload Gambar */}
                <Card className="w-72 shrink-0">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Visual Produk</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <label htmlFor="upload-edit" className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg h-48 cursor-pointer bg-muted/40 hover:bg-muted/60 transition overflow-hidden">
                            {imagePreview
                                ? <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                                : <div className="flex flex-col items-center gap-2 text-center p-4">
                                    <ImagePlus className="h-8 w-8 text-muted-foreground" />
                                    <p className="text-sm font-medium">Klik untuk unggah gambar</p>
                                    <p className="text-xs text-muted-foreground">Format JPG, PNG atau WEBP (Maks. 5MB)</p>
                                  </div>
                            }
                        </label>
                        <input id="upload-edit" type="file" accept="image/*" onChange={handleImage} className="hidden" />
                        {imagePreview && (
                            <Button variant="destructive" size="sm" className="w-full" onClick={() => setImagePreview(null)}>
                                Hapus Gambar
                            </Button>
                        )}
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-lg">🖼</div>
                    </CardContent>
                </Card>

                {/* Form */}
                <Card className="flex-1">
                    <CardContent className="pt-6 space-y-5">
                        <div className="flex items-center gap-3">
                            <div className="w-1 h-5 bg-[#1a2744] rounded-full" />
                            <p className="text-xs font-bold tracking-widest text-[#1a2744] uppercase">Informasi Umum</p>
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="nama">Nama Obat</Label>
                            <Input id="nama" name="nama" value={form.nama} onChange={handleChange} placeholder="Contoh: Amoxicillin 500mg" className={errors.nama ? "border-red-500" : ""} />
                            {errors.nama && <p className="text-xs text-red-500">{errors.nama}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label>Kategori</Label>
                                <Select value={form.kategori} onValueChange={handleKategori}>
                                    <SelectTrigger className={errors.kategori ? "border-red-500" : ""}>
                                        <SelectValue placeholder="Pilih Kategori" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {kategoriOptions.map((k) => <SelectItem key={k} value={k}>{k}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                {errors.kategori && <p className="text-xs text-red-500">{errors.kategori}</p>}
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="satuan">Satuan</Label>
                                <Input id="satuan" name="satuan" value={form.satuan} onChange={handleChange} placeholder="Contoh: Strip, Tablet, Botol" />
                            </div>
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                            <div className="w-1 h-5 bg-[#1a2744] rounded-full" />
                            <p className="text-xs font-bold tracking-widest text-[#1a2744] uppercase">Harga & Stok</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label htmlFor="harga">Harga Jual (IDR)</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">Rp</span>
                                    <Input id="harga" name="harga" type="number" value={form.harga} onChange={handleChange} className="pl-9" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="stok">Stok Awal</Label>
                                <Input id="stok" name="stok" type="number" value={form.stok} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label htmlFor="ambangBatas">Ambang Batas Minimum</Label>
                                <Input id="ambangBatas" name="ambangBatas" value={form.ambangBatas} onChange={handleChange} placeholder="Peringatan stok rendah" />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="lokasiRak">Lokasi Rak (Opsional)</Label>
                                <Input id="lokasiRak" name="lokasiRak" value={form.lokasiRak} onChange={handleChange} placeholder="Contoh: Rak A-12" />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <Button variant="ghost" onClick={onBack}>Batal</Button>
                            <Button onClick={handleSubmit} className="bg-[#1a2744] hover:bg-[#1a2744]/90 gap-2">
                                <Save className="h-4 w-4" /> Simpan Obat
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}