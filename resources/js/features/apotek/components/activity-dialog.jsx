import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function ActivityDialog({ activities }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className="w-full text-xs font-bold text-[#0b3b60] tracking-widest uppercase hover:text-blue-700 transition-colors p-4">
                    Lihat Semua Aktivitas
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md rounded-3xl p-6">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-slate-800">
                        Semua Aktivitas Pengguna
                    </DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-[400px] w-full pr-4 mt-4">
                    <div className="space-y-6">
                        {activities.map((user) => (
                            <div
                                key={user.id}
                                className="flex items-center justify-between group"
                            >
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10 border-2 border-slate-50 group-hover:border-blue-100 transition-colors">
                                        <AvatarImage
                                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.avatar}&backgroundColor=e2e8f0`}
                                        />
                                        <AvatarFallback className="bg-[#0b3b60] text-white text-xs font-bold">
                                            {user.avatar}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800">
                                            {user.name}
                                        </p>
                                        <p className="text-[10px] font-medium text-slate-400">
                                            {user.status}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                                        Total Beli
                                    </p>
                                    <p className="text-sm font-bold text-[#0b3b60]">
                                        {user.amount}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
