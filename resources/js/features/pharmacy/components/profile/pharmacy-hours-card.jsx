import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Clock, Save } from "lucide-react";
import { useForm } from "@inertiajs/react";
import { toast } from "sonner";

const DAYS = [
    "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"
];

export function PharmacyHoursCard({ pharmacy }) {
    const { data, setData, put, processing } = useForm({
        hours: pharmacy?.hours || []
    });

    const handleHourChange = (index, field, value) => {
        const newHours = [...data.hours];
        newHours[index] = { ...newHours[index], [field]: value };
        setData("hours", newHours);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("pharmacy.profile.updateHours"), {
            onSuccess: () => toast.success("Jam operasional diperbarui"),
            onError: () => toast.error("Gagal memperbarui jam operasional")
        });
    };

    return (
        <Card className="border-0 shadow-lg shadow-slate-200/50 rounded-3xl overflow-hidden bg-white">
            <CardHeader className="pb-4 pt-6 px-8 border-b border-slate-50 flex flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-[#0b3b60]" />
                    <CardTitle className="text-lg font-bold text-slate-800">
                        Jam Operasional
                    </CardTitle>
                </div>
                <Button 
                    onClick={handleSubmit} 
                    disabled={processing}
                    className="bg-[#0b3b60] hover:bg-[#082a45] text-white rounded-xl h-10 px-6 flex items-center gap-2"
                >
                    <Save className="h-4 w-4" />
                    {processing ? "Menyimpan..." : "Simpan"}
                </Button>
            </CardHeader>
            <CardContent className="px-8 py-6">
                <div className="space-y-4">
                    {DAYS.map((day, index) => {
                        const hourData = data.hours.find(h => h.day_of_week === index) || {
                            day_of_week: index,
                            open_time: "08:00",
                            close_time: "20:00",
                            is_closed: false,
                            is_24_hours: false
                        };
                        
                        const dataIndex = data.hours.findIndex(h => h.day_of_week === index);
                        const effectiveIndex = dataIndex === -1 ? data.hours.length : dataIndex;

                        return (
                            <div key={day} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 rounded-2xl gap-4 border border-slate-100">
                                <div className="min-w-[100px]">
                                    <span className="text-sm font-bold text-[#0b3b60]">{day}</span>
                                </div>
                                
                                <div className="flex flex-wrap items-center gap-6">
                                    <div className="flex items-center gap-4">
                                        <div className="space-y-1">
                                            <Label className="text-[10px] font-black uppercase text-slate-400">Buka</Label>
                                            <Input 
                                                type="time" 
                                                disabled={hourData.is_closed || hourData.is_24_hours}
                                                value={hourData.open_time?.substring(0, 5)}
                                                onChange={(e) => handleHourChange(effectiveIndex, "open_time", e.target.value)}
                                                className="h-9 w-32 bg-white rounded-lg border-slate-200 text-xs font-bold"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-[10px] font-black uppercase text-slate-400">Tutup</Label>
                                            <Input 
                                                type="time" 
                                                disabled={hourData.is_closed || hourData.is_24_hours}
                                                value={hourData.close_time?.substring(0, 5)}
                                                onChange={(e) => handleHourChange(effectiveIndex, "close_time", e.target.value)}
                                                className="h-9 w-32 bg-white rounded-lg border-slate-200 text-xs font-bold"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6 border-l border-slate-200 pl-6">
                                        <div className="flex items-center gap-2">
                                            <Switch 
                                                checked={hourData.is_24_hours}
                                                onCheckedChange={(val) => handleHourChange(effectiveIndex, "is_24_hours", val)}
                                            />
                                            <span className="text-[10px] font-black uppercase text-slate-500">24 Jam</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Switch 
                                                checked={hourData.is_closed}
                                                onCheckedChange={(val) => handleHourChange(effectiveIndex, "is_closed", val)}
                                            />
                                            <span className="text-[10px] font-black uppercase text-slate-500">Tutup</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
