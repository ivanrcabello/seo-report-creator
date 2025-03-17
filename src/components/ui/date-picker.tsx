
import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface DatePickerProps {
  className?: string;
  mode?: "single" | "range" | "multiple";
  selected?: Date | Date[] | { from: Date; to: Date } | undefined;
  onSelect?: (date: Date | Date[] | { from: Date; to: Date } | undefined) => void;
  initialFocus?: boolean;
  // Compatibility with older props
  date?: Date;
  setDate?: (date: Date) => void;
}

export function DatePicker({
  className,
  mode = "single",
  selected,
  onSelect,
  initialFocus = false,
  date, // For compatibility
  setDate, // For compatibility
}: DatePickerProps) {
  // If older props are passed, use those
  const effectiveSelected = selected || date;
  const effectiveOnSelect = onSelect || setDate;

  return (
    <div className={cn("grid gap-2", className)}>
      {mode === "single" && (
        <Calendar
          mode="single"
          selected={effectiveSelected as Date}
          onSelect={effectiveOnSelect as (date: Date | undefined) => void}
          initialFocus={initialFocus}
          className="bg-white rounded-md border shadow pointer-events-auto"
        />
      )}
      {mode === "range" && (
        <Calendar
          mode="range"
          selected={effectiveSelected as { from: Date; to: Date }}
          onSelect={effectiveOnSelect as (range: { from: Date; to: Date } | undefined) => void}
          initialFocus={initialFocus}
          className="bg-white rounded-md border shadow pointer-events-auto"
        />
      )}
      {mode === "multiple" && (
        <Calendar
          mode="multiple"
          selected={effectiveSelected as Date[]}
          onSelect={effectiveOnSelect as (dates: Date[] | undefined) => void}
          initialFocus={initialFocus}
          className="bg-white rounded-md border shadow pointer-events-auto"
        />
      )}
    </div>
  );
}

export function DatePickerWithButton({
  className,
  mode = "single",
  selected,
  onSelect,
  initialFocus = false,
  date, // For compatibility
  setDate, // For compatibility
}: DatePickerProps) {
  // If older props are passed, use those
  const effectiveSelected = selected || date;
  const effectiveOnSelect = onSelect || setDate;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !effectiveSelected && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {effectiveSelected && mode === "single"
            ? format(effectiveSelected as Date, "PPP")
            : <span>Selecciona una fecha</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={effectiveSelected as Date}
          onSelect={effectiveOnSelect as (date: Date | undefined) => void}
          initialFocus={initialFocus}
          className="pointer-events-auto"
        />
      </PopoverContent>
    </Popover>
  )
}
