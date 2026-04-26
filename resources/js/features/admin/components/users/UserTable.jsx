import React from "react";
import { AnimatePresence } from "framer-motion";
import { User, Phone, Mail, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ROLE_CONFIG, USER_STATUS_CONFIG } from "@/features/admin/lib/constants";
import { router } from "@inertiajs/react";

export function UserTable({ users = [], onDelete }) {
    return (
        <Table>
            <TableHeader className="bg-slate-50/50">
                <TableRow className="hover:bg-transparent border-slate-100/50">
                    <TableHead className="py-6 pl-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Profil Pengguna</TableHead>
                    <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Kontak</TableHead>
                    <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Peran</TableHead>
                    <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</TableHead>
                    <TableHead className="pr-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Aksi</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <AnimatePresence mode="wait">
                    {users.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="h-96 text-center">
                                <div className="flex flex-col items-center justify-center text-slate-300">
                                    <User className="w-16 h-16 mb-4 opacity-10" />
                                    <p className="text-sm font-black uppercase tracking-widest">Data pengguna tidak ditemukan</p>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        users.map((user) => {
                            const roleCfg = ROLE_CONFIG[user.role] || ROLE_CONFIG.CUSTOMER;
                            const statusCfg = user.is_active ? USER_STATUS_CONFIG.active : USER_STATUS_CONFIG.inactive;
                            return (
                                <TableRow key={user.id} className="group hover:bg-slate-50/30 transition-colors border-slate-100/50">
                                    <TableCell className="py-6 pl-10">
                                        <div className="flex items-center gap-4">
                                            <Avatar className="h-12 w-12 rounded-2xl border-2 border-white shadow-md">
                                                <AvatarImage src={user.avatar_url} />
                                                <AvatarFallback className="bg-slate-100 text-slate-400 text-xs font-black">
                                                    {user.username.substring(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-slate-900 tracking-tight leading-none mb-1 group-hover:text-[#0b3b60] transition-colors">{user.username}</span>
                                                <span className="text-[11px] font-bold text-slate-400">{user.email}</span>
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
                                        <Badge variant="secondary" className={`px-3 py-1 rounded-xl text-[9px] font-black tracking-widest border ${roleCfg.class}`}>
                                            {roleCfg.label}
                                        </Badge>
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
                                                <Button variant="ghost" className="w-10 h-10 rounded-2xl bg-slate-50 hover:bg-[#0b3b60] text-slate-300 hover:text-white flex items-center justify-center transition-all group-hover:scale-105 shadow-sm p-0">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-2xl border-slate-200 shadow-xl w-40 p-2">
                                                <DropdownMenuItem onClick={() => router.get(`/admin/users/${user.id}/edit`)} className="rounded-xl text-xs font-bold gap-2 py-2.5 cursor-pointer text-slate-600 focus:bg-slate-50">
                                                    <Pencil className="w-4 h-4" /> Edit Profil
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => onDelete(user)} className="rounded-xl text-xs font-bold gap-2 py-2.5 cursor-pointer text-rose-600 focus:bg-rose-50 focus:text-rose-700">
                                                    <Trash2 className="w-4 h-4" /> Hapus Akun
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    )}
                </AnimatePresence>
            </TableBody>
        </Table>
    );
}
