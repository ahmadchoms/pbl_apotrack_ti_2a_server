import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight, History, Search, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link, router } from "@inertiajs/react";
import { DashboardPharmacyLayout } from "@/layouts/pharmacy-layout";
import { TextInput } from "@/components/shared/TextInput";
import { SelectInput } from "@/components/shared/SelectInput";

export default function PharmacyAuditLogs({ logs, filters = {} }) {
    const logList = logs?.data || [];
    
    // Defensive extraction of pagination properties
    const links = logs?.meta?.links || logs?.links || [];
    const from = logs?.meta?.from || logs?.from || 0;
    const to = logs?.meta?.to || logs?.to || 0;
    const total = logs?.meta?.total || logs?.total || 0;
    const prevPageUrl = logs?.meta?.prev_page_url || logs?.prev_page_url;
    const nextPageUrl = logs?.meta?.next_page_url || logs?.next_page_url;

    // Filters local state
    const [searchVal, setSearchVal] = useState(filters.search || "");
    const [statusVal, setStatusVal] = useState(
        filters.status === "SUCCESS" ? "SUCCESS" : filters.status === "FAILED" ? "FAILED" : "Semua Status"
    );

    const onPageChange = (url) => {
        if (url) {
            router.get(
                url,
                {
                    search: searchVal,
                    status: statusVal === "Semua Status" ? "" : statusVal,
                },
                { preserveState: true }
            );
        }
    };

    const handleFilter = (e) => {
        if (e) e.preventDefault();
        router.get(
            route("pharmacy.profile.audit-logs"),
            {
                search: searchVal,
                status: statusVal === "Semua Status" ? "" : statusVal,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const handleReset = () => {
        setSearchVal("");
        setStatusVal("Semua Status");
        router.get(
            route("pharmacy.profile.audit-logs"),
            {},
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const statusOptions = [
        { id: "all", name: "Semua Status" },
        { id: "SUCCESS", name: "SUCCESS" },
        { id: "FAILED", name: "FAILED" },
    ];

    return (
        <DashboardPharmacyLayout activeMenu="pharmacy.profile">
            <div className="pb-20 max-w-5xl mx-auto font-sans space-y-6">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <Link
                            href={route("pharmacy.profile.index")}
                            className="w-11 h-11 rounded-2xl bg-white shadow-[0_2px_12px_rgba(15,23,42,0.01)] border border-slate-200/60 flex items-center justify-center text-slate-400 hover:text-primary transition-all duration-300 hover:scale-105 cursor-pointer"
                        >
                            <ArrowLeft className="w-5 h-5 text-slate-600" />
                        </Link>
                        <div>
                            <p className="text-[10px] font-black text-primary uppercase tracking-[0.25em] mb-1 flex items-center gap-2">
                                <span className="w-8 h-px bg-primary/30" />
                                Profil & Keamanan
                            </p>
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                                Riwayat Aktivitas Sistem
                            </h2>
                        </div>
                    </div>
                </div>

                {/* Filter & Search Bar */}
                <Card className="border border-slate-100 rounded-3xl shadow-[0_2px_12px_rgba(15,23,42,0.01)] bg-white p-6">
                    <form onSubmit={handleFilter} className="flex flex-col md:flex-row items-end gap-4">
                        <div className="flex-1 min-w-0 w-full">
                            <TextInput
                                label="Cari Log Aktivitas"
                                placeholder="Cari deskripsi atau kata kunci aksi..."
                                value={searchVal}
                                onChange={(e) => setSearchVal(e.target.value)}
                                icon={Search}
                            />
                        </div>
                        <div className="w-full md:w-64">
                            <SelectInput
                                label="Status"
                                value={statusVal}
                                onChange={(val) => setStatusVal(val)}
                                options={statusOptions}
                            />
                        </div>
                        <div className="flex items-center gap-2 w-full md:w-auto shrink-0 mt-4 md:mt-0">
                            <Button
                                type="submit"
                                className="w-full md:w-auto h-10 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer"
                            >
                                Cari
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleReset}
                                className="w-full md:w-auto h-10 px-6 rounded-xl text-xs font-bold cursor-pointer"
                            >
                                Reset
                            </Button>
                        </div>
                    </form>
                </Card>

                {/* Logs Listing Card */}
                <Card className="border border-slate-100 rounded-3xl shadow-[0_2px_12px_rgba(15,23,42,0.01)] bg-white overflow-hidden">
                    <div className="p-6 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-bold text-slate-800">
                                Daftar Rekam Aktivitas
                            </h3>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Menampilkan total {total} kejadian tercatat dalam sistem.
                            </p>
                        </div>
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                    </div>
                    
                    <CardContent className="p-6 space-y-6">
                        <div className="space-y-4">
                            <AnimatePresence mode="wait">
                                {logList.length > 0 ? (
                                    <div className="space-y-3.5">
                                        {logList.map((log, index) => {
                                            const dateObj = new Date(log.created_at);
                                            const dateStr = dateObj.toLocaleDateString("id-ID", {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                            });
                                            const timeStr = dateObj.toLocaleTimeString("id-ID", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            }) + " WIB";

                                            return (
                                                <motion.div
                                                    key={log.id || index}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.03 }}
                                                    className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-100 hover:border-primary/20 hover:shadow-[0_4px_20px_rgba(15,23,42,0.01)] transition-all duration-300"
                                                >
                                                    <div className="shrink-0 mt-0.5">
                                                        {log.status === "SUCCESS" ? (
                                                            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center">
                                                                <CheckCircle2 className="w-5 h-5" />
                                                            </div>
                                                        ) : (
                                                            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center">
                                                                <XCircle className="w-5 h-5" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0 space-y-1">
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <span className="font-mono font-bold text-primary text-[10px] bg-primary/5 border border-primary/10 px-2 py-0.5 rounded-md">
                                                                {log.action || "SYSTEM_EVENT"}
                                                            </span>
                                                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md border ${log.status === "SUCCESS" ? "bg-emerald-50/50 text-emerald-600 border-emerald-100" : "bg-rose-50/50 text-rose-600 border-rose-100"}`}>
                                                                {log.status === "SUCCESS" ? "SUCCESS" : "FAILED"}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm font-semibold text-slate-800 leading-relaxed">
                                                            {log.description}
                                                        </p>
                                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-400 font-medium font-sans">
                                                            <span className="flex items-center gap-1">
                                                                <Clock className="w-3.5 h-3.5 text-slate-300" />
                                                                {dateStr} pukul {timeStr}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-4">
                                        <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 border border-slate-100">
                                            <History className="w-8 h-8" />
                                        </div>
                                        <div className="text-center space-y-1">
                                            <p className="text-sm font-bold text-slate-700">Tidak ada log aktivitas ditemukan</p>
                                            <p className="text-xs text-slate-400">Silakan sesuaikan filter pencarian atau kata kunci Anda.</p>
                                        </div>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Pagination */}
                        {logList.length > 0 && (
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-100">
                                <p className="text-xs font-semibold text-slate-400">
                                    Menampilkan {from} – {to} dari {total} log aktivitas
                                </p>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-primary hover:bg-slate-50 disabled:opacity-30 transition-all shadow-xs cursor-pointer"
                                        disabled={!prevPageUrl}
                                        onClick={() => onPageChange(prevPageUrl)}
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </Button>
                                    <div className="flex items-center gap-1">
                                        {links
                                            .filter((l) => !isNaN(l.label))
                                            .map((link, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => onPageChange(link.url)}
                                                    className={`w-9 h-9 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer ${link.active ? "bg-primary text-white" : "bg-white text-slate-600 hover:text-primary hover:bg-slate-50 border border-slate-200"}`}
                                                >
                                                    {link.label}
                                                </button>
                                            ))}
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-primary hover:bg-slate-50 disabled:opacity-30 transition-all shadow-xs cursor-pointer"
                                        disabled={!nextPageUrl}
                                        onClick={() => onPageChange(nextPageUrl)}
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardPharmacyLayout>
    );
}
