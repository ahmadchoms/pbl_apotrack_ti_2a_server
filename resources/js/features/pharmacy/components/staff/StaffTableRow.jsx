import React from "react";
import {
    MoreHorizontal,
    Pencil,
    Trash2,
    Phone,
    Mail,
} from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getInitials } from "@/lib/utils";

export function StaffTableRow({ staff, onEdit, onDelete }) {
    return (
        <TableRow className="group hover:bg-slate-50/50 transition-colors border-slate-100/50">
            <TableCell className="py-5 pl-10">
                <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 rounded-2xl border-2 border-white shadow-md">
                        <AvatarImage src={staff.user.avatar_url} />
                        <AvatarFallback className="bg-primary text-white text-xs font-black">
                            {getInitials(staff.user.username)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-900 tracking-tight leading-none mb-1 group-hover:text-primary transition-colors">
                            {staff.user.username}
                        </span>
                        <div className="flex items-center gap-2">
                            <Badge
                                variant="outline"
                                className="text-[9px] font-black tracking-widest px-2 py-0 border-slate-200 text-slate-500"
                            >
                                {staff.role.toUpperCase()}
                            </Badge>
                        </div>
                    </div>
                </div>
            </TableCell>
            <TableCell>
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-slate-600">
                        <Phone className="w-3.5 h-3.5" />
                        <span className="text-xs font-bold">
                            {staff.user.phone || "N/A"}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                        <Mail className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-medium">
                            {staff.user.email}
                        </span>
                    </div>
                </div>
            </TableCell>
            <TableCell>
                <div
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[9px] font-black tracking-[0.1em] ${
                        staff.is_active
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                            : "bg-slate-50 text-slate-400 border-slate-200"
                    }`}
                >
                    <span
                        className={`w-1 h-1 rounded-full ${staff.is_active ? "bg-emerald-500 animate-pulse" : "bg-slate-300"}`}
                    />
                    {staff.is_active ? "AKTIF" : "NON-AKTIF"}
                </div>
            </TableCell>
            <TableCell className="pr-10 text-right">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="w-10 h-10 rounded-2xl bg-slate-50 hover:bg-primary text-slate-300 hover:text-white flex items-center justify-center transition-all group-hover:scale-105 shadow-sm p-0"
                        >
                            <MoreHorizontal className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="end"
                        className="rounded-2xl border-slate-200 shadow-xl w-44 p-2"
                    >
                        <DropdownMenuItem
                            onClick={() => onEdit(staff)}
                            className="rounded-xl text-xs font-bold gap-2 py-2.5 cursor-pointer text-slate-600 focus:bg-slate-50"
                        >
                            <Pencil className="w-4 h-4" /> Edit Data
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => onDelete(staff)}
                            className="rounded-xl text-xs font-bold gap-2 py-2.5 cursor-pointer text-rose-600 focus:bg-rose-50"
                        >
                            <Trash2 className="w-4 h-4" /> Hapus Staff
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
        </TableRow>
    );
}
