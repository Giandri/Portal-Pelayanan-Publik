import { Input } from "@/components/ui/input";

interface AgencyGridSelectorProps {
    value: string;
    onChange: (value: string) => void;
    category: string;
    placeholder?: string;
    label?: string;
}

export function AgencyGridSelector({
    value,
    onChange,
    category,
    placeholder,
    label
}: AgencyGridSelectorProps) {
    return (
        <div className="space-y-2">
            <div className="relative">
                <Input
                    label={label}
                    placeholder={placeholder || (category === 'akademik' ? "Nama Universitas..." : "Nama Instansi / Perusahaan...")}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    autoComplete="off"
                />
            </div>

            {!category && (
                <p className="text-xs text-gray-400 italic">
                    Silakan pilih kategori instansi terlebih dahulu.
                </p>
            )}
        </div>
    );
}

