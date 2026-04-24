import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Check } from "lucide-react";

export function StaffFormDialog({ open, onClose, onSave, initialData }) {
    const isEdit = !!initialData;
    const [form, setForm] = useState({
        username: "",
        email: "",
        phone: "",
        role: "STAFF",
        is_active: true,
        password: "",
    });

    useEffect(() => {
        if (open) {
            setForm(
                initialData 
                    ? {
                        username: initialData.user.username,
                        email: initialData.user.email,
                        phone: initialData.user.phone || "",
                        role: initialData.role,
                        is_active: !!initialData.is_active,
                        password: "",
                    }
                    : {
                        username: "",
                        email: "",
                        phone: "",
                        role: "STAFF",
                        is_active: true,
                        password: "",
                    },
            );
        }
    }, [initialData, open]);

    const handleUpdate = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md rounded-2xl">
                <DialogHeader>
                    <DialogTitle>
                        {isEdit ? "Perbarui Data Staff" : "Tambah Staff Baru"}
                    </DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <label className="text-xs font-bold uppercase text-slate-500">
                            Nama Lengkap
                        </label>
                        <Input
                            value={form.username}
                            onChange={(e) =>
                                handleUpdate("username", e.target.value)
                            }
                            placeholder="Nama staff..."
                        />
                    </div>
                    <div className="grid gap-2">
                        <label className="text-xs font-bold uppercase text-slate-500">
                            Email
                        </label>
                        <Input
                            type="email"
                            value={form.email}
                            onChange={(e) =>
                                handleUpdate("email", e.target.value)
                            }
                            placeholder="email@example.com"
                        />
                    </div>
                    <div className="grid gap-2">
                        <label className="text-xs font-bold uppercase text-slate-500">
                            Nomor Telepon
                        </label>
                        <Input
                            type="tel"
                            value={form.phone}
                            onChange={(e) =>
                                handleUpdate("phone", e.target.value)
                            }
                            placeholder="081234567890"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <label className="text-xs font-bold uppercase text-slate-500">
                                Peran
                            </label>
                            <Select
                                value={form.role}
                                onValueChange={(val) =>
                                    handleUpdate("role", val)
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="APOTEKER">Apoteker</SelectItem>
                                    <SelectItem value="STAFF">Staff</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <label className="text-xs font-bold uppercase text-slate-500">
                                Status Akun
                            </label>
                            <Select
                                value={form.is_active ? "active" : "inactive"}
                                onValueChange={(val) =>
                                    handleUpdate("is_active", val === "active")
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Aktif</SelectItem>
                                    <SelectItem value="inactive">Nonaktif</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {!isEdit && (
                        <div className="grid gap-2">
                            <label className="text-xs font-bold uppercase text-slate-500">
                                Kata Sandi
                            </label>
                            <Input
                                type="password"
                                value={form.password}
                                onChange={(e) =>
                                    handleUpdate("password", e.target.value)
                                }
                                placeholder="Minimal 8 karakter..."
                            />
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Batal
                    </Button>
                    <Button
                        onClick={() => {
                            onSave(form);
                        }}
                        className="bg-primary"
                    >
                        <Check className="w-4 h-4 mr-2" /> Simpan
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
