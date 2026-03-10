"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function GratifikasiAlert() {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        // We add a slight delay to make sure the entrance is smooth
        const timer = setTimeout(() => {
            setOpen(true);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent
                className="sm:max-w-xl p-0 bg-transparent border-none shadow-none flex justify-center items-center [&>button]:hidden outline-none"
                onOpenAutoFocus={(e) => e.preventDefault()}
            >
                <DialogHeader className="sr-only">
                    <DialogTitle>Pemberitahuan</DialogTitle>
                    <DialogDescription>Himbauan Tolak Gratifikasi Lingkungan BWS</DialogDescription>
                </DialogHeader>

                <div
                    className="relative w-full max-w-full flex justify-center group cursor-pointer"
                    onClick={() => setOpen(false)}
                >
                    <img
                        src="/images/gratifikasi.png"
                        alt="Himbauan Tolak Gratifikasi"
                        className="w-auto h-auto max-w-full max-h-[60vh] md:max-h-[85vh] object-contain rounded-sm shadow-2xl transition-transform hover:scale-[1.02]"
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
