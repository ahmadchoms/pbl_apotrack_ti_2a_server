import React from "react";
import { 
    MoreHorizontal, 
    Pencil, 
    ShieldAlert, 
    KeyRound,
    Phone,
    Mail
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
import { ROLE_CONFIG, USER_STATUS_CONFIG } from "@/features/admin/lib/constants";
import { router } from "@inertiajs/react";

export function UserTableRow({ user, onSuspend, onResetPassword }) {
    const roleCfg = ROLE_CONFIG[user.role] || ROLE_CONFIG.CUSTOMER;
    const statusCfg = user.is_active ? USER_STATUS_CONFIG.active : USER_STATUS_CONFIG.inactive;

    return (
        <TableRow className="group hover:bg-slate-50/50 transition-colors border-slate-100/50">
            <TableCell className="py-5 pl-10">
                <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 rounded-2xl border-2 border-white shadow-md">
                        <AvatarImage src={user.avatar_url} />
                        <AvatarFallback className="bg-slate-100 text-slate-400 text-xs font-black">
                            {user.username.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-900 tracking-tight leading-none mb-1 group-hover:text-[#0b3b60] transition-colors">
                            {user.username}
                        </span>
                        <span className="text-[11px] font-bold text-slate-400">
                            {user.email}
                        </span>
                    </div>
                </div>
            </TableCell>
            <TableCell>
                <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2 text-slate-600">
                        <Phone className="w-3 h-3" />
                        <span className="text-xs font-bold">{user.phone || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                        <Mail className="w-3 h-3" />
                        <span className="text-[10px] font-medium">{user.email}</span>
                    </div>
                </div>
            </TableCell>
            <TableCell>
                <div className="flex flex-col items-start gap-1">
                    <Badge
                        variant="secondary"
                        className={`px-3 py-1 rounded-xl text-[9px] font-black tracking-widest border ${roleCfg.class}`}
                    >
                        {roleCfg.label}
                    </Badge>
                    {user.pharmacy_name && (
                        <span className="text-[9px] font-bold text-[#0b3b60] bg-[#0b3b60]/5 px-2 py-0.5 rounded-md">
                            {user.pharmacy_name}
                        </span>
                    )}
                </div>
            </TableCell>
            <TableCell>
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[9px] font-black tracking-[0.1em] ${statusCfg.badge}`}>
                    <span className={`w-1 h-1 rounded-full ${statusCfg.dot} animate-pulse`} />
                    {statusCfg.label}
                </div>
            </TableCell>
            <TableCell className="pr-10 text-right">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="w-10 h-10 rounded-2xl bg-slate-50 hover:bg-[#0b3b60] text-slate-300 hover:text-white flex items-center justify-center transition-all group-hover:scale-105 shadow-sm p-0"
                        >
                            <MoreHorizontal className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-2xl border-slate-200 shadow-xl w-44 p-2">
                        <DropdownMenuItem
                            onClick={() => router.get(`/admin/users/${user.id}/edit`)}
                            className="rounded-xl text-xs font-bold gap-2 py-2.5 cursor-pointer text-slate-600 focus:bg-slate-50"
                        >
                            <Pencil className="w-4 h-4" /> Edit Profil
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => onResetPassword(user)}
                            className="rounded-xl text-xs font-bold gap-2 py-2.5 cursor-pointer text-amber-600 focus:bg-amber-50"
                        >
                            <KeyRound className="w-4 h-4" /> Reset Password
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => onSuspend(user)}
                            className={`rounded-xl text-xs font-bold gap-2 py-2.5 cursor-pointer ${user.is_active ? "text-rose-600 focus:bg-rose-50" : "text-emerald-600 focus:bg-emerald-50"}`}
                        >
                            <ShieldAlert className="w-4 h-4" /> {user.is_active ? "Tangguhkan Akun" : "Aktifkan Akun"}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
        </TableRow>
    );
}
