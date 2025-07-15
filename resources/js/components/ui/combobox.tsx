import * as React from "react"
import { cn } from "@/lib/utils"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface ComboboxOption {
    value: string
    label: string
}

interface ComboboxProps {
    options: ComboboxOption[]
    value?: string
    onValueChange: (value: string) => void
    placeholder?: string
    className?: string
    allowEmpty?: boolean
}

export function Combobox({
    options,
    value,
    onValueChange,
    placeholder = "Select option...",
    className,
    allowEmpty = true,
}: ComboboxProps) {
    const handleValueChange = (newValue: string) => {
        // Convert special empty value back to empty string
        onValueChange(newValue === "__EMPTY__" ? "" : newValue);
    };

    return (
        <Select value={value || "__EMPTY__"} onValueChange={handleValueChange}>
            <SelectTrigger className={cn("w-full", className)}>
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                {allowEmpty && (
                    <SelectItem value="__EMPTY__">
                        None
                    </SelectItem>
                )}
                {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
