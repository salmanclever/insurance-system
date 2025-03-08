"use client"

import { useFormContext } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import FormDatePicker from "./form-date-picker"

interface FieldOption {
  label: string
  value: string
}

interface FieldCondition {
  dependsOn: string
  value: string
}

interface FieldProps {
  id: string
  type: string
  label: string
  placeholder?: string
  required?: boolean
  options?: FieldOption[]
  condition?: FieldCondition
  min?: number
  max?: number
}

interface DynamicFieldProps {
  field: FieldProps
}

export default function DynamicField({ field }: DynamicFieldProps) {
  const { control } = useFormContext()

  // Special handling for date fields
  if (field.type === "date") {
    return (
      <FormDatePicker
        name={field.id}
        label={field.label}
        placeholder={field.placeholder || "Select date"}
        required={field.required}
      />
    )
  }

  return (
    <FormField
      control={control}
      name={field.id}
      render={({ field: formField }) => (
        <FormItem>
          <FormLabel>
            {field.label}
            {field.required ? " *" : ""}
          </FormLabel>
          <FormControl>{renderFieldByType(field, formField)}</FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

function renderFieldByType(fieldConfig: FieldProps, formField: any) {
  switch (fieldConfig.type) {
    case "text":
      return (
        <Input {...formField} value={formField.value ?? ""} placeholder={fieldConfig.placeholder || ""} type="text" />
      )

    case "email":
      return (
        <Input {...formField} value={formField.value ?? ""} placeholder={fieldConfig.placeholder || ""} type="email" />
      )

    case "number":
      return (
        <Input
          {...formField}
          value={formField.value === null ? "" : formField.value}
          placeholder={fieldConfig.placeholder || ""}
          type="number"
          min={fieldConfig.min}
          max={fieldConfig.max}
          onChange={(e) => {
            const value = e.target.value === "" ? null : Number(e.target.value)
            formField.onChange(value)
          }}
        />
      )

    case "textarea":
      return <Textarea {...formField} value={formField.value ?? ""} placeholder={fieldConfig.placeholder || ""} />

    case "select":
      return (
        <Select onValueChange={formField.onChange} value={formField.value ?? ""}>
          <SelectTrigger>
            <SelectValue placeholder={fieldConfig.placeholder || "Select an option"} />
          </SelectTrigger>
          <SelectContent>
            {fieldConfig.options?.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )

    case "radio":
      return (
        <RadioGroup
          onValueChange={formField.onChange}
          value={formField.value ?? ""}
          className="flex flex-col space-y-1"
        >
          {fieldConfig.options?.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem value={option.value} id={`${fieldConfig.id}-${option.value}`} />
              <Label htmlFor={`${fieldConfig.id}-${option.value}`}>{option.label}</Label>
            </div>
          ))}
        </RadioGroup>
      )

    case "checkbox":
      return (
        <div className="flex items-center space-x-2">
          <Checkbox checked={!!formField.value} onCheckedChange={formField.onChange} id={fieldConfig.id} />
          <label
            htmlFor={fieldConfig.id}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {fieldConfig.placeholder || ""}
          </label>
        </div>
      )

    default:
      return <Input {...formField} value={formField.value ?? ""} />
  }
}

