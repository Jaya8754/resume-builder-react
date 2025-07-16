import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { CreatableMultiSelect } from "@/components/ui/CreatableMultiSelect";
import {
  Popover,
  PopoverTrigger,
  PopoverContent
} from "@/components/ui/popover";

import { parseDate } from "chrono-node";
import { Button } from "@/components/ui/button";

function formatDate(date: Date | undefined) {
  if (!date) return "";
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

type FormFieldRendererProps = {
  id: string;
  label?: string;
  type?: "text" | "email" | "password" | "textarea" | "select" | "file" | "date" | "multi-select-with-tags";
  required?: boolean;
  placeholder?: string;
  options?: string[]; 
  value?: string;
  onChange?: (value: string) => void;
};

export function FormFieldRenderer({
  id,
  label,
  type = "text",
  required = false,
  placeholder,
  options = [],
  value,
  onChange
}: FormFieldRendererProps) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(
    value ? new Date(value) : undefined
  );

  if (type === "multi-select-with-tags") {
    return (
      <div className="grid w-full max-w-sm items-start gap-2">
        <Label htmlFor={id}>
          {label}
          {required && <span className="text-red-600 ml-1">*</span>}
        </Label>
        <CreatableMultiSelect
          value={value || ""}
          onChange={onChange!}
          options={options}
          placeholder={placeholder || "Type or select skills"}
        />
      </div>
    );
  }

  return (
    <div className="grid w-full max-w-sm items-start gap-2">
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-red-600 ml-1">*</span>}
      </Label>

      {type === "textarea" && (
        <Textarea id={id} placeholder={placeholder} value={value} onChange={(e) => onChange?.(e.target.value)} />
      )}

      {type === "select" && (
        <Select onValueChange={(val) => onChange?.(val)}>
          <SelectTrigger id={id}>
            <SelectValue placeholder={placeholder || "Select an option"} />
          </SelectTrigger>
          <SelectContent>
            {options.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {type === "file" && (
        <Input id={id} type="file" onChange={(e) => onChange?.(e.target.files?.[0]?.name || "")} />
      )}

      {type === "date" && (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <div className="relative w-full">
              <Input
                id={id}
                value={value}
                placeholder="Select or type a date"
                className="pr-10"
                onClick={() => setOpen(true)}
                onChange={(e) => {
                  onChange?.(e.target.value);
                  const parsed = parseDate(e.target.value);
                  if (parsed) setDate(parsed);
                }}
              />
              <Button
                variant="ghost"
                className="absolute right-1 top-1/2 -translate-y-1/2 size-8"
                onClick={() => setOpen(true)}
                type="button"
              >
                <CalendarIcon className="w-4 h-4" />
              </Button>
            </div>
          </PopoverTrigger>
          <PopoverContent className="p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(selectedDate) => {
                setDate(selectedDate);
                onChange?.(formatDate(selectedDate));
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      )}

      {["text", "email", "password"].includes(type) && (
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
        />
      )}
    </div>
  );
}
