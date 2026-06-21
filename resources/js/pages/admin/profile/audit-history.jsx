import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { History, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@inertiajs/react";
import { DashboardAdminLayout } from "@/layouts/admin-layout";
import { AuditFilters } from "@/features/admin/components/audit/AuditFilters";
import { AuditLogItem } from "@/features/admin/components/audit/AuditLogItem";
import { AdminPagination } from "@/features/admin/components/shared/AdminPagination";
import { PageHeader } from "@/features/admin/components/shared/PageHeader";
import { useAuditHistory } from "@/features/admin/hooks/useAuditHistory";
import {
    containerVariants,
    itemVariants,
} from "@/features/admin/lib/constants";

export default function AdminAuditHistory({ logs, filters, actionTypes: serverActionTypes }) {
    const {
        search,
        setSearch,
        status,
        setStatus,
        actionType,
        setActionType,
        dateFrom,
        setDateFrom,
        dateTo,
        setDateTo,
        handleFilter,
        resetFilters,
        logList,
        pagination,
        actionTypes,
    } = useAuditHistory({ logs, filters, actionTypes: serverActionTypes });
    console.log(actionTypes);

    return (
        <DashboardAdminLayout activeMenu="profile">
            <div className="space-y-8 pb-20">
                <div className="flex items-start gap-4">
                    <Link
                        href={route("admin.profile.index")}
                        className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 hover:text-primary transition-colors shrink-0 mt-1"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div className="flex-1">
                        <PageHeader
                            title="Riwayat Aktivitas"
                            description="Tinjau dan lacak seluruh catatan aktivitas log keamanan akun Anda."
                        >
                            <Button
                                variant="outline"
                                onClick={resetFilters}
                                className="h-12 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest border-slate-200 text-slate-400 hover:bg-slate-50"
                            >
                                Reset
                            </Button>
                            <Button
                                onClick={handleFilter}
                                className="h-12 px-8 rounded-2xl bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20"
                            >
                                Terapkan Filter
                            </Button>
                        </PageHeader>
                    </div>
                </div>
                <AuditFilters
                    search={search}
                    setSearch={setSearch}
                    actionType={actionType}
                    setActionType={setActionType}
                    status={status}
                    setStatus={setStatus}
                    dateFrom={dateFrom}
                    setDateFrom={setDateFrom}
                    dateTo={dateTo}
                    setDateTo={setDateTo}
                    actionTypes={actionTypes}
                />
                <div className="space-y-4">
                    <AnimatePresence mode="wait">
                        {logList.length > 0 ? (
                            <motion.div
                                key="list"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="space-y-4"
                            >
                                {logList.map((log) => (
                                    <motion.div
                                        key={log.id}
                                        variants={itemVariants}
                                    >
                                        <AuditLogItem log={log} />
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="py-32 flex flex-col items-center justify-center text-center space-y-4"
                            >
                                <div className="w-20 h-20 rounded-[2.5rem] bg-slate-50 flex items-center justify-center text-slate-200">
                                    <History className="w-10 h-10" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-1">
                                        Belum Ada Catatan
                                    </h4>
                                    <p className="text-xs text-slate-400 font-bold max-w-64 mx-auto">
                                        Tidak ditemukan riwayat aktivitas yang
                                        sesuai dengan filter yang Anda pilih.
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                {logList.length > 0 && (
                    <AdminPagination
                        pagination={pagination}
                        itemLabel="aktivitas"
                    />
                )}
            </div>
        </DashboardAdminLayout>
    );
}
