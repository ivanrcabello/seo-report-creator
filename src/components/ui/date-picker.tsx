
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
  selected?: Date | Date[] | undefined;
  onSelect?: (date: Date | Date[] | undefined) => void;
  initialFocus?: boolean;
}

export function DatePicker({
  className,
  mode = "single",
  selected,
  onSelect,
  initialFocus = false,
}: DatePickerProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Calendar
        mode={mode === "range" ? "range" : mode === "multiple" ? "multiple" : "single"}
        selected={selected}
        onSelect={onSelect}
        initialFocus={initialFocus}
        className="pointer-events-auto"
      />
    </div>
  );
}

export function DatePickerWithButton({
  className,
  mode = "single",
  selected,
  onSelect,
  initialFocus = false,
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !selected && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selected && mode === "single"
            ? format(selected as Date, "PPP")
            : <span>Selecciona una fecha</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode={mode === "range" ? "range" : mode === "multiple" ? "multiple" : "single"}
          selected={selected}
          onSelect={onSelect}
          initialFocus={initialFocus}
          className="pointer-events-auto"
        />
      </PopoverContent>
    </Popover>
  );
}
