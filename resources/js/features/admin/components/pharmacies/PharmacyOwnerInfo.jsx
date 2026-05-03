import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Phone, MapPin } from "lucide-react";

export function PharmacyOwnerInfo({ data }) {
    return (
        <Card className="py-0 gap-0 rounded-[2.5rem] border-none shadow-2xl shadow-slate-200/40 bg-white overflow-hidden">
            <CardHeader className="p-8 border-b border-slate-50">
                <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-800">
                    Info Pemilik
                </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
                <div className="space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-50 border border-indigo-100 flex items-center justify-center overflow-hidden">
                            {data.pharmacist?.avatar ? (
                                <img
                                    src={data.pharmacist.avatar}
                                    alt={data.pharmacist.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <User className="w-8 h-8 text-indigo-400" />
                            )}
                        </div>
                        <div>
                            <p className="text-lg font-black text-slate-800 leading-tight">
                                {data.pharmacist?.name || "Unknown"}
                            </p>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                                Pemilik / Apoteker
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                            <Phone className="w-5 h-5 text-slate-400" />
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">
                                    Telepon
                                </p>
                                <p className="text-xs font-bold text-slate-700">
                                    {data.phone || "N/A"}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                            <MapPin className="w-5 h-5 text-slate-400 mt-1" />
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">
                                    Lokasi
                                </p>
                                <p className="text-xs font-bold text-slate-700 leading-relaxed">
                                    {data.address}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
