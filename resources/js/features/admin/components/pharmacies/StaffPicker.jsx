import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, UserPlus, X, Users, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FormField } from "@/features/admin/components/shared/FormField";
import { InfoBox } from "@/features/admin/components/shared/InfoBox";
import axios from "axios";

export function StaffPicker({
    staffs,
    staffSearch,
    setStaffSearch,
    addStaff,
    removeStaff,
    updateStaffRole,
}) {
    const [availableStaff, setAvailableStaff] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (staffSearch.length < 2) {
            setAvailableStaff([]);
            return;
        }

        const delayDebounceFn = setTimeout(async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(
                    route("admin.pharmacies.search-staff"),
                    {
                        params: { search: staffSearch },
                    },
                );
                setAvailableStaff(response.data);
            } catch (error) {
                console.error("Error fetching staff:", error);
            } finally {
                setIsLoading(false);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [staffSearch]);

    // Filter out already added staff from the search results
    const filteredResults = availableStaff.filter(
        (user) => !staffs.find((s) => s.user_id === user.id),
    );

    return (
        <div className="space-y-8">
            <div className="relative">
                <FormField label="Cari Staf (Username atau Email)">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        <Input
                            value={staffSearch}
                            onChange={(e) => setStaffSearch(e.target.value)}
                            placeholder="Ketik nama atau email..."
                            className="pl-12 h-14 rounded-2xl bg-slate-50 border-transparent focus:ring-[#0b3b60]/20 font-bold"
                        />
                        {isLoading && (
                            <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 animate-spin" />
                        )}
                    </div>
                </FormField>
                <AnimatePresence>
                    {staffSearch.length >= 2 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute z-50 left-0 right-0 top-full mt-2 bg-white rounded-3xl shadow-2xl border border-slate-100 max-h-64 overflow-y-auto p-2 space-y-1"
                        >
                            {filteredResults.length > 0 ? (
                                filteredResults.map((user) => (
                                    <button
                                        key={user.id}
                                        type="button"
                                        onClick={() => {
                                            addStaff(user);
                                            setAvailableStaff([]);
                                        }}
                                        className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10 rounded-xl border border-white shadow-sm">
                                                <AvatarImage
                                                    src={user.avatar_url}
                                                />
                                                <AvatarFallback className="bg-slate-100 text-slate-400 text-xs font-black">
                                                    {user.username
                                                        .substring(0, 2)
                                                        .toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="text-left">
                                                <p className="text-xs font-black text-slate-700">
                                                    {user.username}
                                                </p>
                                                <p className="text-[10px] font-bold text-slate-400">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge
                                                variant="secondary"
                                                className="text-[9px] font-black uppercase tracking-widest bg-slate-100 text-slate-500"
                                            >
                                                {user.role}
                                            </Badge>
                                            <div className="w-8 h-8 rounded-xl bg-[#0b3b60]/5 text-[#0b3b60] flex items-center justify-center group-hover:bg-[#0b3b60] group-hover:text-white transition-colors">
                                                <UserPlus className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </button>
                                ))
                            ) : !isLoading ? (
                                <div className="p-8 text-center">
                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                                        Staf tidak ditemukan atau sudah
                                        ditugaskan
                                    </p>
                                </div>
                            ) : null}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <div className="space-y-4">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Staf Terdaftar ({staffs.length})
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {staffs.length > 0 ? (
                        staffs.map((staff) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                key={staff.user_id}
                                className="flex items-center gap-4 p-4 rounded-3xl bg-slate-50 border border-slate-100 group relative"
                            >
                                <Avatar className="h-12 w-12 rounded-2xl border-2 border-white shadow-md">
                                    <AvatarImage
                                        src={staff.user_data?.avatar_url}
                                    />
                                    <AvatarFallback className="bg-white text-slate-400 text-xs font-black">
                                        {staff.user_data?.username
                                            ?.substring(0, 2)
                                            .toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-black text-slate-900 truncate">
                                        {staff.user_data?.username}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                updateStaffRole(
                                                    staff.user_id,
                                                    "APOTEKER",
                                                )
                                            }
                                            className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-colors ${staff.role === "APOTEKER" ? "bg-[#0b3b60] text-white" : "bg-white text-slate-400 border border-slate-100 hover:bg-slate-100"}`}
                                        >
                                            Apoteker
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                updateStaffRole(
                                                    staff.user_id,
                                                    "STAFF",
                                                )
                                            }
                                            className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-colors ${staff.role === "STAFF" ? "bg-[#0b3b60] text-white" : "bg-white text-slate-400 border border-slate-100 hover:bg-slate-100"}`}
                                        >
                                            Staf
                                        </button>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeStaff(staff.user_id)}
                                    className="w-8 h-8 rounded-xl bg-white text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full py-10 border-2 border-dashed border-slate-100 rounded-[2rem] flex flex-col items-center justify-center text-slate-300">
                            <Users className="w-10 h-10 mb-2 opacity-20" />
                            <p className="text-[10px] font-black uppercase tracking-widest">
                                Belum ada staf ditambahkan
                            </p>
                        </div>
                    )}
                </div>
            </div>
            <InfoBox text="Setiap apotek minimal harus memiliki 1 Apoteker sebagai penanggung jawab teknis." />
        </div>
    );
}
