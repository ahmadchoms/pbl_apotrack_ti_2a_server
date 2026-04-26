import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { getInitials } from "@/lib/utils";

const ANIMATION = {
    row: {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, x: -10 },
    },
};

export function StaffTable({ paginatedStaff, onAction }) {
    return (
        <Table>
            <TableHeader>
                <TableRow className="border-slate-100 hover:bg-transparent bg-slate-50/60">
                    <TableHead className="w-[300px] pl-6 font-semibold text-slate-500 text-xs uppercase tracking-wider">
                        Informasi Staff
                    </TableHead>
                    <TableHead className="font-semibold text-slate-500 text-xs uppercase tracking-wider">
                        Kontak
                    </TableHead>
                    <TableHead className="font-semibold text-slate-500 text-xs uppercase tracking-wider">
                        Status Akun
                    </TableHead>
                    <TableHead className="text-right pr-6 font-semibold text-slate-500 text-xs uppercase tracking-wider">
                        Aksi
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <AnimatePresence mode="popLayout">
                    {paginatedStaff.map((staff) => (
                        <motion.tr
                            key={staff.id}
                            variants={ANIMATION.row}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            layout
                            className="group border-b border-slate-50 hover:bg-slate-50/80 transition-colors"
                        >
                            <TableCell className="pl-6 py-4">
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-10 w-10 ring-1 ring-slate-200 shadow-sm">
                                        <AvatarImage
                                            src={staff.user.avatar_url}
                                            alt={staff.user.username}
                                        />
                                        <AvatarFallback className="bg-primary text-white text-[11px] font-medium">
                                            {getInitials(staff.user.username)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-slate-800 text-sm">
                                            {staff.user.username}
                                        </span>
                                        <span className="text-xs text-slate-500 font-medium">
                                            {staff.role}
                                        </span>
                                    </div>
                                </div>
                            </TableCell>

                            <TableCell>
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-sm text-slate-700 font-medium">
                                        {staff.user.email}
                                    </span>
                                    <span className="text-xs text-slate-400">
                                        {staff.user.phone || "Belum ada nomor"}
                                    </span>
                                </div>
                            </TableCell>

                            <TableCell>
                                <Badge
                                    variant="secondary"
                                    className={`rounded-full px-3 py-1 text-[11px] font-semibold border-none ${
                                        staff.user.is_active
                                            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                                            : "bg-slate-100 text-slate-500 hover:bg-slate-100"
                                    }`}
                                >
                                    {staff.user.is_active
                                        ? "Aktif"
                                        : "Nonaktif"}
                                </Badge>
                            </TableCell>

                            <TableCell className="text-right pr-6">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            className="h-8 w-8 p-0 rounded-full transition-opacity focus:opacity-100 data-[state=open]:opacity-100"
                                        >
                                            <MoreHorizontal className="h-4 w-4 text-slate-500" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        align="end"
                                        className="rounded-xl w-36 shadow-md border-slate-100"
                                    >
                                        <DropdownMenuItem
                                            onClick={() =>
                                                onAction("formOpen", staff)
                                            }
                                            className="cursor-pointer gap-2.5 text-slate-600 font-medium py-2"
                                        >
                                            <Pencil className="w-4 h-4" /> Edit
                                            Data
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() =>
                                                onAction("deleteOpen", staff)
                                            }
                                            className="cursor-pointer gap-2.5 text-red-600 font-medium py-2 focus:text-red-700 focus:bg-red-50"
                                        >
                                            <Trash2 className="w-4 h-4" /> Hapus
                                            Akun
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </motion.tr>
                    ))}
                </AnimatePresence>
            </TableBody>
        </Table>
    );
}
