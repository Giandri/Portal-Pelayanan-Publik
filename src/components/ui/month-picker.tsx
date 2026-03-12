"use client"

import * as React from "react"
import { format, addMonths, subMonths, setMonth, setYear } from "date-fns"
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, FileDown } from "lucide-react"
import { id } from "date-fns/locale"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface MonthPickerProps {
    date?: Date
    setDate: (date: Date | undefined) => void
    onExport?: () => void
    placeholder?: string
    className?: string
}

const months = [
    "Januari", "Februari", "Maret", "April",
    "Mei", "Juni", "Juli", "Agustus",
    "September", "Oktober", "November", "Desember"
]

export function MonthPicker({
    date,
    setDate,
    onExport,
    placeholder = "Pilih Bulan",
    className,
}: MonthPickerProps) {
    const [viewDate, setViewDate] = React.useState(date || new Date())

    const handleMonthSelect = (monthIndex: number) => {
        const newDate = setMonth(viewDate, monthIndex)
        setDate(newDate)
    }

    const handlePrevYear = () => setViewDate(subMonths(viewDate, 12))
    const handleNextYear = () => setViewDate(addMonths(viewDate, 12))

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-full justify-start text-left font-normal h-10 px-3 rounded-md border border-blue-200 bg-white text-blue-700 hover:bg-blue-600 hover:text-white",
                        !date && "text-muted-foreground",
                        className
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "MMMM yyyy", { locale: id }) : <span>{placeholder}</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[280px] p-0 shadow-lg border-blue-100 bg-white" align="start">
                <div className="flex items-center justify-between p-2 border-b bg-blue-50/50">
                    <Button variant="ghost" size="icon" onClick={handlePrevYear} className="hover:bg-blue-100">
                        <ChevronLeft className="h-4 w-4 text-blue-700" />
                    </Button>
                    <div className="font-semibold text-blue-900">{format(viewDate, "yyyy")}</div>
                    <Button variant="ghost" size="icon" onClick={handleNextYear} className="hover:bg-blue-100">
                        <ChevronRight className="h-4 w-4 text-blue-700" />
                    </Button>
                </div>
                <div className="grid grid-cols-3 gap-2 p-3">
                    {months.map((month, index) => {
                        const isSelected = date &&
                            date.getMonth() === index &&
                            date.getFullYear() === viewDate.getFullYear()
                        const isCurrentMonth = new Date().getMonth() === index &&
                            new Date().getFullYear() === viewDate.getFullYear()

                        return (
                            <Button
                                key={month}
                                variant={isSelected ? "default" : "ghost"}
                                className={cn(
                                    "h-9 text-xs transition-all",
                                    isSelected ? "bg-blue-600 hover:bg-blue-700 text-white hover:text-white" : "hover:bg-blue-700 hover:text-white",
                                    !isSelected && isCurrentMonth && "text-blue-600 font-bold "
                                )}
                                onClick={() => handleMonthSelect(index)}
                            >
                                {month.substring(0, 3)}
                            </Button>
                        )
                    })}
                </div>
                <div className="p-2 border-t flex flex-col gap-2 bg-slate-50/50">
                    <Button
                        variant="ghost"
                        className="text-xs h-8 w-full hover:bg-blue-600 text-blue-600 hover:text-white"
                        onClick={() => {
                            const now = new Date()
                            setViewDate(now)
                            setDate(now)
                        }}
                    >
                        Bulan Ini
                    </Button>
                    {onExport && (
                        <Button
                            variant="default"
                            className="text-xs h-9 w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                            onClick={(e) => {
                                e.stopPropagation();
                                onExport();
                            }}
                        >
                            <FileDown className="w-3.5 h-3.5" />
                            Export Excel
                        </Button>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    )
}
