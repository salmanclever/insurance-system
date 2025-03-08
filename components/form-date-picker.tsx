"use client"

import { useFormContext } from "react-hook-form"
import { DatePicker } from "@/components/ui/date-picker"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"

interface FormDatePickerProps {
  name: string
  label: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
}

export default function FormDatePicker({
  name,
  label,
  placeholder,
  required = false,
  disabled = false,
}: FormDatePickerProps) {
  const { control } = useFormContext()

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {label}
            {required && <span className="text-destructive"> *</span>}
          </FormLabel>
          <FormControl>
            <DatePicker value={field.value} onChange={field.onChange} placeholder={placeholder} disabled={disabled} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

