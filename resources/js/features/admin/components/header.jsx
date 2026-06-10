import React, { useState, useEffect } from "react";
import { Search, Bell, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { usePage, router } from "@inertiajs/react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import axios from "axios";
import { formatTime } from "@/lib/utils";

export function Header({ mobileSidebar }) {
    const user = usePage().props?.auth?.user;

    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = async () => {
        try {
            const response = await axios.get("/notifications");
            if (response.data?.status === "SUCCESS") {
                setNotifications(response.data.data);
                setUnreadCount(response.data.unread_count);
            }
        } catch (err) {
            console.error("Gagal memuat notifikasi:", err);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleMarkAllAsRead = async () => {
        try {
            await axios.patch("/notifications/read-all");
            setNotifications((prev) =>
                prev.map((n) => ({ ...n, is_read: true })),
            );
            setUnreadCount(0);
        } catch (err) {
            console.error("Gagal menandai semua notifikasi:", err);
        }
    };

    const handleNotificationClick = async (notif) => {
        if (!notif.is_read) {
            try {
                await axios.patch(`/notifications/${notif.id}/read`);
                setNotifications((prev) =>
                    prev.map((n) =>
                        n.id === notif.id ? { ...n, is_read: true } : n,
                    ),
                );
                setUnreadCount((prev) => Math.max(0, prev - 1));
            } catch (err) {
                console.error("Gagal menandai notifikasi:", err);
            }
        }

        if (notif.reference_type === "ORDER" && notif.reference_id) {
            const path = window.location.pathname;
            if (path.startsWith("/pharmacy")) {
                router.visit(route("pharmacy.orders.show", notif.reference_id));
            } else if (path.startsWith("/admin")) {
                router.visit(
                    route("admin.pharmacies.show", notif.reference_id),
                );
            }
        }
    };

    return (
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 md:px-8 flex items-center justify-between sticky top-0 z-10 w-full">
            <div className="flex items-center gap-4 flex-1">
                {mobileSidebar && (
                    <div className="md:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <button className="p-2 -ml-2 text-slate-500 hover:text-primary transition-colors focus:outline-none">
                                    <Menu className="h-6 w-6" />
                                </button>
                            </SheetTrigger>
                            <SheetContent
                                side="left"
                                className="p-0 w-64 bg-white border-0 shadow-xl [&>button]:hidden"
                            >
                                {mobileSidebar}
                            </SheetContent>
                        </Sheet>
                    </div>
                )}

                <div className="relative w-full max-w-md group hidden sm:block">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                        <Search className="h-4 w-4" />
                    </div>
                    <Input
                        type="text"
                        placeholder="Cari nama pengguna dan apotek..."
                        className="pl-10 bg-slate-50 border-slate-200 focus-visible:ring-1 focus-visible:ring-primary rounded-xl h-10 transition-all"
                    />
                </div>
            </div>

            <div className="flex items-center gap-5">
                <Popover>
                    <PopoverTrigger asChild>
                        <button className="relative p-2 rounded-full bg-slate-50 border border-slate-200 text-slate-500 hover:text-primary hover:bg-white transition-all shadow-sm cursor-pointer">
                            <Bell className="h-5 w-5" />
                            {unreadCount > 0 && (
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white shadow-sm animate-pulse"></span>
                            )}
                        </button>
                    </PopoverTrigger>
                    <PopoverContent
                        className="w-80 sm:w-96 rounded-2xl border-slate-100 p-0 gap-0 shadow-2xl bg-white overflow-hidden"
                        align="end"
                    >
                        <div className="p-4 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Bell className="w-4 h-4 text-primary" />
                                <span className="text-xs font-bold text-slate-800">
                                    Notifikasi
                                </span>
                                {unreadCount > 0 && (
                                    <span className="px-2 py-0.5 rounded-full bg-rose-50 border border-rose-100 text-rose-600 font-bold text-[9px] scale-90">
                                        {unreadCount} Baru
                                    </span>
                                )}
                            </div>
                            {unreadCount > 0 && (
                                <button
                                    onClick={handleMarkAllAsRead}
                                    className="text-[10px] font-bold text-primary hover:underline cursor-pointer"
                                >
                                    Tandai semua dibaca
                                </button>
                            )}
                        </div>

                        <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                            {notifications.length > 0 ? (
                                notifications.map((notif) => (
                                    <div
                                        key={notif.id}
                                        onClick={() =>
                                            handleNotificationClick(notif)
                                        }
                                        className={`p-4 flex gap-3 hover:bg-slate-50/50 transition-colors cursor-pointer text-left relative ${
                                            !notif.is_read
                                                ? "bg-blue-50/10"
                                                : ""
                                        }`}
                                    >
                                        {!notif.is_read && (
                                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary" />
                                        )}
                                        <div className="flex-1 min-w-0 pl-1.5">
                                            <h4 className="text-xs font-bold text-slate-800 leading-tight">
                                                {notif.title}
                                            </h4>
                                            <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-0.5">
                                                {notif.message}
                                            </p>
                                            <p className="text-[9px] text-slate-400 font-medium mt-1">
                                                {new Date(
                                                    notif.created_at,
                                                ).toLocaleDateString("id-ID", {
                                                    day: "numeric",
                                                    month: "short",
                                                })}{" "}
                                                • {formatTime(notif.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-2">
                                    <Bell className="w-8 h-8 opacity-20" />
                                    <p className="text-xs font-bold">
                                        Tidak ada notifikasi baru
                                    </p>
                                </div>
                            )}
                        </div>
                    </PopoverContent>
                </Popover>

                <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>

                <div className="flex items-center gap-3 cursor-pointer group">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-black text-slate-800 group-hover:text-primary transition-colors leading-none">
                            {user?.username || "Admin"}
                        </p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 leading-none">
                            Super Admin
                        </p>
                    </div>
                    <Avatar className="h-10 w-10 border-2 border-slate-100 group-hover:border-primary transition-colors shadow-sm">
                        <AvatarImage src={user?.avatar_url} />
                        <AvatarFallback className="bg-primary text-white font-black">
                            {user?.username
                                ? user.username.charAt(0).toUpperCase()
                                : "A"}
                        </AvatarFallback>
                    </Avatar>
                </div>
            </div>
        </header>
    );
}
