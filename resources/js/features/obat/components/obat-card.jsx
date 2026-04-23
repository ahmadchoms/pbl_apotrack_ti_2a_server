// resources/js/features/obat/components/obat-card.jsx

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

const formatRupiah = (num) =>
    "Rp " + Number(num).toLocaleString("id-ID").replace(/,/g, ".");

export default function ObatCard({ obat, onEdit, onDelete }) {
    return (
        <Card className="overflow-hidden p-0 gap-0">
            {/* Gambar */}
            <div className="relative h-40 bg-[#1a2744] flex items-center justify-center overflow-hidden">
                {obat.image ? (
                    <img
                        src={obat.image}
                        alt={obat.nama}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <span className="text-5xl">💊</span>
                )}

                {/* Tombol aksi */}
                <div className="absolute top-2 right-2 flex gap-1">
                    <Button
                        size="icon"
                        variant="secondary"
                        className="h-7 w-7 bg-white/90 hover:bg-white"
                        onClick={() => onEdit(obat.id)}
                    >
                        <Pencil className="h-3 w-3" />
                    </Button>
                    <Button
                        size="icon"
                        variant="secondary"
                        className="h-7 w-7 bg-white/90 hover:bg-red-50 hover:text-red-600"
                        onClick={() => onDelete(obat.id)}
                    >
                        <Trash2 className="h-3 w-3" />
                    </Button>
                </div>
            </div>

            <CardContent className="p-4">
                <Badge
                    variant="outline"
                    className="text-blue-600 border-blue-200 bg-blue-50 mb-2 text-[10px] tracking-wide uppercase"
                >
                    {obat.kategori}
                </Badge>

                <h3 className="font-bold text-[#1a2744] text-sm mb-1">{obat.nama}</h3>
                <p className="text-xs text-muted-foreground mb-3">
                    {obat.bentuk} • {obat.satuan}
                </p>

                <div className="flex justify-between">
                    <div>
                        <p className="text-[11px] text-muted-foreground">Stok</p>
                        <p className={`text-sm font-bold ${obat.stok <= 10 ? "text-red-500" : "text-[#1a2744]"}`}>
                            {obat.stok} Unit
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-[11px] text-muted-foreground">Harga</p>
                        <p className="text-sm font-bold text-[#1a2744]">
                            {formatRupiah(obat.harga)}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}