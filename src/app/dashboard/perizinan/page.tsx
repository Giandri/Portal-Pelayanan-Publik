"use client";

import { useState, useEffect, useMemo } from "react";
import {
    DndContext,
    DragOverlay,
    useSensor,
    useSensors,
    PointerSensor,
    closestCorners,
    DragStartEvent,
    DragEndEvent,
    DragOverEvent,
    defaultDropAnimationSideEffects,
    DropAnimation,
} from "@dnd-kit/core";
import {
    SortableContext,
    arrayMove,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
    FileText,
    Droplets,
    CloudRain,
    Calendar,
    GripVertical,
    Clock,
    CheckCircle2,
    XCircle,
    User,
    Mail,
    Phone,
    Building2,
    Paperclip,
    History,
    AlertTriangle,
} from "lucide-react";
import { UploadDropzone } from "@/lib/uploadthing";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Permit, PermitStatus } from "@/lib/types";
import { permitTypes, statusConfig, statusFlow } from "@/lib/constants";
import { cn, formatDate } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

// --- Types ---

const iconMap = {
    FileText,
    Droplets,
    CloudRain,
};

// --- Sortable Card Component ---

interface SortablePermitCardProps {
    permit: Permit;
    onClick?: () => void;
    isActive?: boolean;
}

function SortablePermitCard({ permit, onClick, isActive }: SortablePermitCardProps) {
    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: permit.id,
        data: {
            type: "Permit",
            permit,
        },
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
    };

    const permitType = permitTypes.find((p) => p.slug === permit.type);
    const Icon = permitType && permitType.icon in iconMap
        ? iconMap[permitType.icon as keyof typeof iconMap]
        : FileText;

    return (
        <Card
            ref={setNodeRef}
            style={style}
            onClick={onClick}
            className={cn(
                "cursor-grab group hover:shadow-md transition-all border-l-4",
                isDragging ? "opacity-30" : "opacity-100",
                isActive ? "ring-2 ring-primary border-l-primary" : "border-l-transparent",
                "bg-card"
            )}
        >
            <CardContent className="p-3">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-3 overflow-hidden">
                        <div
                            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                            style={{ backgroundColor: permitType?.bgColor || "#f3f4f6" }}
                        >
                            <Icon className="w-5 h-5" style={{ color: permitType?.color || "#6b7280" }} />
                        </div>
                        <div className="min-w-0 flex-1">
                            <h4 className="font-semibold text-sm line-clamp-2 leading-tight text-foreground/90">
                                {permitType?.title || permit.type}
                            </h4>
                            <p className="text-xs text-muted-foreground mt-1 truncate">
                                {permit.applicantName}
                            </p>
                        </div>
                    </div>
                    <div
                        {...attributes}
                        {...listeners}
                        className="opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded"
                    >
                        <GripVertical className="w-4 h-4 text-muted-foreground" />
                    </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground border-t pt-2">
                    <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(permit.createdAt)}
                    </div>
                    <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-[10px]">
                        {permit.trackingId}
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}

// --- Column Component ---

interface KanbanColumnProps {
    id: PermitStatus;
    permits: Permit[];
    activePermitId: string | null;
    onPermitClick: (id: string) => void;
}

function KanbanColumn({ id, permits, activePermitId, onPermitClick }: KanbanColumnProps) {
    const config = statusConfig[id];

    const { setNodeRef } = useSortable({
        id: id,
        data: {
            type: "Column",
            columnId: id,
        },
    });

    const permitIds = useMemo(() => permits.map((p) => p.id), [permits]);

    return (
        <div ref={setNodeRef} className="flex flex-col h-full w-80 bg-muted/30 rounded-xl border border-border/50">
            {/* Column Header */}
            <div className="p-3 border-b flex items-center justify-between bg-white/50 backdrop-blur-sm rounded-t-xl sticky top-0 z-10">
                <div className="flex items-center gap-2">
                    <div
                        className="w-3 h-3 rounded-full ring-2 ring-offset-1"
                        style={{ backgroundColor: config.color, "--tw-ring-color": config.bgColor } as React.CSSProperties}
                    />
                    <h3 className="font-semibold text-sm">{config.label}</h3>
                </div>
                <Badge variant="outline" className="px-2 py-0.5 h-6 text-xs font-mono">
                    {permits.length}
                </Badge>
            </div>

            {/* Sortable Area */}
            <div className="flex-1 p-2 overflow-y-auto min-h-[150px]">
                <SortableContext items={permitIds} strategy={verticalListSortingStrategy}>
                    <div className="space-y-2">
                        {permits.map((permit) => (
                            <SortablePermitCard
                                key={permit.id}
                                permit={permit}
                                isActive={activePermitId === permit.id}
                                onClick={() => onPermitClick(permit.id)}
                            />
                        ))}
                    </div>
                </SortableContext>
            </div>
        </div>
    );
}

// --- Main Page Component ---

export default function PermitDashboard() {
    const { data: initialPermits = [], isLoading, refetch } = useQuery<Permit[]>({
        queryKey: ['permits'],
        queryFn: async () => {
            const response = await fetch("/api/permits");
            if (!response.ok) throw new Error("Failed to fetch");
            return response.json();
        }
    });

    const [permits, setPermits] = useState<Permit[]>([]);
    const [activeDragId, setActiveDragId] = useState<string | null>(null);
    const [selectedPermitId, setSelectedPermitId] = useState<string | null>(null);

    // Rejection Dialog State
    const [isRejectOpen, setIsRejectOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        if (initialPermits.length > 0) {
            setPermits(initialPermits);
        }
    }, [initialPermits]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const columns = useMemo(() => {
        const cols: Record<string, Permit[]> = {};
        statusFlow.forEach(status => {
            cols[status] = permits.filter(p => p.status === status);
        });
        return cols;
    }, [permits]);

    const activePermit = useMemo(
        () => permits.find((p) => p.id === activeDragId),
        [permits, activeDragId]
    );

    const selectedPermit = useMemo(
        () => permits.find((p) => p.id === selectedPermitId),
        [permits, selectedPermitId]
    );

    const activeOutputFiles = useMemo(() => {
        const atts = (selectedPermit?.attachments as any[]) || [];
        return atts.filter(f => f.category === 'output');
    }, [selectedPermit]);

    const activeUserFiles = useMemo(() => {
        const atts = (selectedPermit?.attachments as any[]) || [];
        return atts.filter(f => f.category !== 'output');
    }, [selectedPermit]);

    function onDragStart(event: DragStartEvent) {
        // ... (skip lines)
        // ...
        <TabsContent value="files">
            <div className="space-y-4">
                {activeOutputFiles.length > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <h4 className="text-sm font-semibold text-green-800 mb-2 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4" /> Dokumen Output (Izin)
                        </h4>
                        <div className="space-y-2">
                            {activeOutputFiles.map((file: any, i: number) => (
                                <div key={i} className="flex items-center gap-3 p-2 bg-white rounded border border-green-100 shadow-sm">
                                    <div className="w-8 h-8 bg-green-100 text-green-600 rounded flex items-center justify-center">
                                        <FileText className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{file.name}</p>
                                        <p className="text-xs text-muted-foreground">Output Izin</p>
                                    </div>
                                    <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => window.open(file.url, '_blank')}>
                                        Lihat
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Lampiran Pemohon</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {activeUserFiles.length > 0 ? (
                            activeUserFiles.map((file: any, idx: number) => (
                                <div key={file.key || idx} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors group cursor-pointer relative">
                                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded flex items-center justify-center">
                                        <Paperclip className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate" title={file.name}>{file.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type?.split('/')[1] || 'doc'}
                                        </p>
                                    </div>
                                    <a href={file.url} target="_blank" rel="noopener noreferrer" className="absolute inset-0" />
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-8 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                                <Paperclip className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                <p>Tidak ada dokumen lampiran</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </TabsContent>
        setActiveDragId(event.active.id as string);
        if (event.active.data.current?.type === "Permit") {
            setSelectedPermitId(event.active.id as string);
        }
    }

    function onDragOver(event: DragOverEvent) {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isActiveAPermit = active.data.current?.type === "Permit";
        const isOverAPermit = over.data.current?.type === "Permit";
        const isOverAColumn = over.data.current?.type === "Column";

        if (!isActiveAPermit) return;

        // Implementation for dragging over another permit (reordering) or column
        setPermits((prev) => {
            const activeIndex = prev.findIndex((p) => p.id === activeId);
            const overIndex = prev.findIndex((p) => p.id === overId);

            if (isOverAPermit) {
                // Determine if we need to change the status of the active permit
                const activePermit = prev[activeIndex];
                const overPermit = prev[overIndex];

                if (activePermit.status !== overPermit.status) {
                    const updatedPermit = { ...activePermit, status: overPermit.status };
                    const newPermits = [...prev];
                    newPermits[activeIndex] = updatedPermit;
                    return arrayMove(newPermits, activeIndex, overIndex);
                }

                // Same column reorder
                return arrayMove(prev, activeIndex, overIndex);
            }

            if (isOverAColumn) {
                const activePermit = prev[activeIndex];
                const newStatus = overId as PermitStatus;

                if (activePermit.status !== newStatus) {
                    const updatedPermit = { ...activePermit, status: newStatus };
                    const newPermits = [...prev];
                    newPermits[activeIndex] = updatedPermit;
                    return newPermits;
                }
            }

            return prev;
        });
    }

    // Unified Status Update Function
    async function updateStatus(permitId: string, newStatus: PermitStatus, reason?: string) {
        // Optimistic Update
        const previousPermits = [...permits];

        setPermits(prev => prev.map(p =>
            p.id === permitId
                ? { ...p, status: newStatus, rejectionReason: reason || p.rejectionReason }
                : p
        ));

        try {
            setIsUpdating(true);
            const response = await fetch("/api/permits/status", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: permitId,
                    status: newStatus,
                    rejectionReason: reason
                }),
            });

            if (!response.ok) throw new Error("Update failed");

            toast.success(`Status berhasil diperbarui ke ${statusConfig[newStatus].label}`);
            refetch(); // Sync with server source of truth

            // Close dialog if open
            if (isRejectOpen) {
                setIsRejectOpen(false);
                setRejectionReason("");
            }
        } catch (error) {
            console.error(error);
            toast.error("Gagal memperbarui status");
            setPermits(previousPermits); // Rollback
        } finally {
            setIsUpdating(false);
        }
    }

    async function onDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        setActiveDragId(null);

        if (!over) return;

        const permitId = active.id as string;
        const currentPermit = permits.find(p => p.id === permitId);

        const finalStatus = permits.find(p => p.id === permitId)?.status;
        const initialStatus = initialPermits.find(p => p.id === permitId)?.status;

        if (finalStatus && finalStatus !== initialStatus) {
            await updateStatus(permitId, finalStatus);
        }
    }

    const dropAnimation: DropAnimation = {
        sideEffects: defaultDropAnimationSideEffects({
            styles: {
                active: {
                    opacity: '0.5',
                },
            },
        }),
    };

    if (isLoading) {
        return (
            <div className="h-full flex flex-col p-6 gap-6">
                <div>
                    <Skeleton className="h-8 w-64 mb-2" />
                    <Skeleton className="h-4 w-96" />
                </div>
                <div className="flex-1 overflow-x-auto pb-4">
                    <div className="flex h-full gap-4 items-start min-w-[1000px]">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="flex flex-col h-full w-80 bg-muted/30 rounded-xl border border-border/50">
                                <div className="p-3 border-b flex items-center justify-between bg-white/50 backdrop-blur-sm rounded-t-xl">
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="w-3 h-3 rounded-full" />
                                        <Skeleton className="h-4 w-24" />
                                    </div>
                                    <Skeleton className="h-6 w-8 rounded" />
                                </div>
                                <div className="p-2 space-y-2">
                                    {[...Array(3)].map((_, j) => (
                                        <div key={j} className="h-32 bg-card rounded-xl border-l-4 border-l-muted p-3 space-y-3">
                                            <div className="flex gap-3">
                                                <Skeleton className="w-9 h-9 rounded-lg flex-shrink-0" />
                                                <div className="space-y-2 flex-1">
                                                    <Skeleton className="h-4 w-full" />
                                                    <Skeleton className="h-3 w-2/3" />
                                                </div>
                                            </div>
                                            <div className="flex justify-between pt-2">
                                                <Skeleton className="h-3 w-16" />
                                                <Skeleton className="h-4 w-20" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col p-6 gap-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Papan Kelola Permohonan</h1>
                <p className="text-muted-foreground">Kelola status dan alur permohonan izin.</p>
            </div>

            {/* Kanban Board */}
            <div className="flex-1 overflow-x-auto pb-4">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCorners}
                    onDragStart={onDragStart}
                    onDragOver={onDragOver}
                    onDragEnd={onDragEnd}
                >
                    <div className="flex h-full gap-4 items-start min-w-[1000px]">
                        {statusFlow.map((status) => (
                            <KanbanColumn
                                key={status}
                                id={status}
                                permits={columns[status] || []}
                                activePermitId={selectedPermitId}
                                onPermitClick={setSelectedPermitId}
                            />
                        ))}
                    </div>

                    <DragOverlay dropAnimation={dropAnimation}>
                        {activePermit ? (
                            <div className="rotate-3 cursor-grabbing">
                                <SortablePermitCard permit={activePermit} isActive />
                            </div>
                        ) : null}
                    </DragOverlay>
                </DndContext>
            </div>

            {/* Details Section (Below Kanban) */}
            <div className="border-t pt-6 mt-2">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" />
                        Detail Permohonan
                    </h2>
                    {selectedPermit && (
                        <Badge variant="outline" className="font-mono">
                            {selectedPermit.trackingId}
                        </Badge>
                    )}
                </div>

                {selectedPermit ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 duration-500">
                        {/* Main Info */}
                        <Card className="lg:col-span-2 border-primary/20 shadow-md">
                            <CardHeader className="bg-muted/30 pb-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-lg text-primary">{selectedPermit.subject}</CardTitle>
                                        <CardDescription className="mt-1">
                                            {permitTypes.find(t => t.slug === selectedPermit.type)?.title}
                                        </CardDescription>
                                    </div>
                                    <Badge
                                        className="capitalize"
                                        style={{
                                            backgroundColor: statusConfig[selectedPermit.status].bgColor,
                                            color: statusConfig[selectedPermit.status].color
                                        }}
                                    >
                                        {statusConfig[selectedPermit.status].label}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 pt-6">
                                <Tabs defaultValue="info" className="w-full">
                                    <TabsList className="mb-4">
                                        <TabsTrigger value="info">Informasi</TabsTrigger>
                                        <TabsTrigger value="timeline">Riwayat</TabsTrigger>
                                        <TabsTrigger value="files">Dokumen</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="info" className="space-y-4">
                                        {selectedPermit.status === 'ditolak' && (
                                            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                                <h4 className="text-sm font-semibold text-red-800 mb-1 flex items-center gap-2">
                                                    <AlertTriangle className="w-4 h-4" /> Alasan Penolakan
                                                </h4>
                                                <p className="text-sm text-red-700 leading-relaxed">
                                                    {selectedPermit.rejectionReason || "Tidak ada alasan spesifik."}
                                                </p>
                                            </div>
                                        )}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-xs text-muted-foreground font-medium uppercase">Deskripsi</label>
                                                <p className="text-sm leading-relaxed">{selectedPermit.description}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs text-muted-foreground font-medium uppercase">Instansi / Perusahaan</label>
                                                <div className="flex items-center gap-2">
                                                    <Building2 className="w-4 h-4 text-muted-foreground" />
                                                    <p className="text-sm font-medium">{selectedPermit.agencyName || "-"}</p>
                                                </div>
                                                <p className="text-xs text-muted-foreground pl-6">{selectedPermit.agencyCategory}</p>
                                            </div>
                                        </div>

                                        <div className="border-t border-dashed my-4" />

                                        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                            <User className="w-4 h-4" /> Data Pemohon
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="bg-muted/30 p-3 rounded-lg">
                                                <label className="text-xs text-muted-foreground">Nama Lengkap</label>
                                                <p className="text-sm font-medium">{selectedPermit.applicantName}</p>
                                            </div>
                                            <div className="bg-muted/30 p-3 rounded-lg">
                                                <label className="text-xs text-muted-foreground flex items-center gap-1">
                                                    <Mail className="w-3 h-3" /> Email
                                                </label>
                                                <p className="text-sm font-medium truncate">{selectedPermit.applicantEmail}</p>
                                            </div>
                                            <div className="bg-muted/30 p-3 rounded-lg">
                                                <label className="text-xs text-muted-foreground flex items-center gap-1">
                                                    <Phone className="w-3 h-3" /> Telepon
                                                </label>
                                                <p className="text-sm font-medium">{selectedPermit.applicantPhone}</p>
                                            </div>
                                        </div>

                                        {selectedPermit.status === 'proses' && (
                                            <>
                                                <div className="border-t border-dashed my-4" />
                                                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2 text-primary">
                                                    <Paperclip className="w-4 h-4" /> Upload Dokumen Output
                                                </h4>
                                                <div className="mb-4">
                                                    <div className="mb-4">
                                                        <UploadDropzone
                                                            endpoint="permitAttachment"
                                                            onClientUploadComplete={async (res) => {
                                                                try {
                                                                    toast.success("Dokumen berhasil diunggah!");

                                                                    // Post metadata to our API to link it to the permit
                                                                    // We send the file data returned from UploadThing
                                                                    const filesData = res.map(file => ({
                                                                        name: file.name,
                                                                        url: file.url,
                                                                        size: file.size,
                                                                        type: file.type,
                                                                        key: file.key
                                                                    }));



                                                                    const response = await fetch("/api/permits/upload", {
                                                                        method: "PUT", // Use PUT for metadata update
                                                                        headers: { "Content-Type": "application/json" },
                                                                        body: JSON.stringify({
                                                                            permitId: selectedPermit.id,
                                                                            files: filesData
                                                                        }),
                                                                    });

                                                                    if (!response.ok) throw new Error("Gagal menyimpan metadata file");

                                                                    refetch();
                                                                } catch (error) {
                                                                    console.error("Failed to link file", error);
                                                                    toast.error("Gagal menyimpan data dokumen");
                                                                }
                                                            }}
                                                            onUploadError={(error: Error) => {
                                                                toast.error(`Gagal upload: ${error.message}`);
                                                            }}
                                                            appearance={{
                                                                container: "border-2 border-dashed border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors",
                                                                uploadIcon: "text-primary",
                                                                label: "text-primary hover:text-primary/80",
                                                                allowedContent: "text-muted-foreground",
                                                                button: "bg-primary hover:bg-primary/90 text-white"
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        {activeOutputFiles.length > 0 && (
                                            <>
                                                <div className="border-t border-dashed my-4" />
                                                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                                    <h4 className="text-sm font-semibold text-green-800 mb-2 flex items-center gap-2">
                                                        <CheckCircle2 className="w-4 h-4" /> Dokumen
                                                    </h4>
                                                    <div className="space-y-2">
                                                        {activeOutputFiles.map((file: any, i: number) => (
                                                            <div key={i} className="flex items-center gap-3 p-2 bg-white rounded border border-green-100 shadow-sm">
                                                                <div className="w-8 h-8 bg-green-100 text-green-600 rounded flex items-center justify-center">
                                                                    <FileText className="w-4 h-4" />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-sm font-medium truncate">{file.name}</p>
                                                                    <p className="text-xs text-muted-foreground">Output Izin</p>
                                                                </div>
                                                                <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => window.open(file.url, '_blank')}>
                                                                    Lihat
                                                                </Button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </TabsContent>

                                    <TabsContent value="timeline">
                                        <div className="relative pl-6 border-l-2 border-muted space-y-6">
                                            {selectedPermit.statusHistory.map((history, idx) => (
                                                <div key={idx} className="relative">
                                                    <div className="absolute -left-[29px] top-0 bg-background border-2 border-primary w-4 h-4 rounded-full" />
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-xs font-mono text-muted-foreground">
                                                            {formatDate(history.date)}
                                                        </span>
                                                        <h4 className="text-sm font-semibold capitalize">
                                                            {statusConfig[history.status].label}
                                                        </h4>
                                                        {history.note && (
                                                            <p className="text-sm text-muted-foreground bg-muted p-2 rounded mt-1">
                                                                {history.note}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="files">
                                        <div className="space-y-4">


                                            <div>
                                                <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Lampiran Pemohon</h4>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    {activeUserFiles.length > 0 ? (
                                                        activeUserFiles.map((file: any, idx: number) => (
                                                            <div key={file.key || idx} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors group cursor-pointer relative">
                                                                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded flex items-center justify-center">
                                                                    <Paperclip className="w-5 h-5" />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-sm font-medium truncate" title={file.name}>{file.name}</p>
                                                                    <p className="text-xs text-muted-foreground">
                                                                        {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type?.split('/')[1] || 'doc'}
                                                                    </p>
                                                                </div>
                                                                <a href={file.url} target="_blank" rel="noopener noreferrer" className="absolute inset-0" />
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="col-span-full py-8 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                                                            <Paperclip className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                                            <p>Tidak ada dokumen lampiran</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>

                        {/* Actions / Status Card */}
                        <div className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm">Aksi Cepat</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <Button className="w-full justify-start" variant="outline">
                                        <FileText className="w-4 h-4 mr-2" />
                                        Lihat Dokumen Lengkap
                                    </Button>
                                    <Button className="w-full justify-start" variant="outline">
                                        <History className="w-4 h-4 mr-2" />
                                        Unduh Riwayat
                                    </Button>
                                    <div className="border-t my-2" />
                                    {selectedPermit.status === 'diajukan' && (
                                        <Button
                                            className="w-full"
                                            variant="default"
                                            disabled={isUpdating}
                                            onClick={() => updateStatus(selectedPermit.id, 'proses')}
                                        >
                                            Proses Permohonan
                                        </Button>
                                    )}
                                    {selectedPermit.status === 'proses' && (
                                        <div className="grid grid-cols-2 gap-2">
                                            <Button
                                                className="w-full bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-medium"
                                                disabled={isUpdating}
                                                onClick={() => updateStatus(selectedPermit.id, 'disetujui')}
                                            >
                                                Setujui
                                            </Button>
                                            <Button
                                                className="w-full bg-red-600 hover:bg-red-700 text-white"
                                                disabled={isUpdating}
                                                onClick={() => setIsRejectOpen(true)}
                                            >
                                                Tolak
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>


                        </div>
                    </div>
                ) : (
                    <div className="h-[300px] border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-muted-foreground bg-muted/20">
                        <FileText className="w-12 h-12 mb-3 opacity-20" />
                        <p className="font-medium">Pilih kartu permohonan untuk melihat detail</p>
                    </div>
                )}
            </div>


            {/* Rejection Dialog */}
            <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-600">
                            <AlertTriangle className="w-5 h-5" />
                            Tolak Permohonan
                        </DialogTitle>
                        <DialogDescription>
                            Anda akan menolak permohonan ini. Harap berikan alasan penolakan yang jelas untuk pemohon.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label htmlFor="reason">Alasan Penolakan</Label>
                            <Textarea
                                id="reason"
                                placeholder="Isi keterangan penolakan . . ."
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                className="h-24"
                            />
                        </div>
                    </div>
                    <DialogFooter className="">
                        <Button
                            className="w-full"
                            disabled={!rejectionReason.trim() || isUpdating}
                            onClick={() => {
                                if (selectedPermitId) {
                                    updateStatus(selectedPermitId, 'ditolak', rejectionReason);
                                }
                            }}
                        >
                            {isUpdating ? "Memproses..." : "Tolak Permohonan"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div >
    );
}
