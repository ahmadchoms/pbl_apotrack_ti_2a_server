import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ActivityDialog } from "@/features/pharmacy/components/dashboard/activity-dialog";

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: "easeOut" },
    },
};

export function UserActivityCard({ userActivities }) {
    return (
        <motion.div variants={itemVariants}>
            <Card className="border-0 shadow-sm rounded-3xl bg-white h-full flex flex-col">
                <CardHeader className="pb-4 pt-6 px-8 border-b border-slate-50">
                    <CardTitle className="text-lg font-bold text-slate-800">
                        User Activity
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 p-0">
                    <ScrollArea className="h-[260px] w-full px-6 pt-4">
                        <div className="space-y-6">
                            {userActivities.map((user) => (
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
                </CardContent>
                <div className="border-t border-slate-50 text-center">
                    <ActivityDialog activities={userActivities} />
                </div>
            </Card>
        </motion.div>
    );
}
