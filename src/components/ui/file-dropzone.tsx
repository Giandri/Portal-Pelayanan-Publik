import { useDropzone } from "react-dropzone";
import { UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

export default function FileDropzone({ onDrop }: { onDrop: (files: File[]) => void }) {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'image/*': ['.png', '.jpg', '.jpeg'],
            'application/msword': ['.doc'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
        }
    });

    return (
        <div
            {...getRootProps()}
            className={cn(
                "border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors mb-4",
                isDragActive ? "border-primary bg-primary/10" : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
            )}
        >
            <input {...getInputProps()} />
            <div className="bg-background p-3 rounded-full mb-3 shadow-sm border">
                <UploadCloud className="w-6 h-6 text-primary" />
            </div>
            <div className="text-center">
                <p className="text-sm font-medium">Klik untuk upload atau drag & drop</p>
                <p className="text-xs text-muted-foreground mt-1">PDF, Word, atau Gambar (Max. 10MB)</p>
            </div>
        </div>
    );
}
