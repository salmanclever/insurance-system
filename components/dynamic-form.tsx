"use client"

import { useState, useEffect } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { fetchFormStructure, submitApplication } from "@/lib/api"
import DynamicField from "@/components/dynamic-field"
import { useToast } from "@/hooks/use-toast"

interface DynamicFormProps {
  onSubmitSuccess: () => void
}

export default function DynamicForm({ onSubmitSuccess }: DynamicFormProps) {
  const [selectedInsuranceType, setSelectedInsuranceType] = useState("")
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Fetch available insurance types
  const { data: insuranceTypes, isLoading: isLoadingTypes } = useQuery({
    queryKey: ["insuranceTypes"],
    queryFn: async () => {
      const response = await fetch("/api/insurance-types")
      if (!response.ok) throw new Error("Failed to fetch insurance types")
      return response.json()
    },
  })

  // Fetch form structure based on selected insurance type
  const { data: formStructure, isLoading: isLoadingForm } = useQuery({
    queryKey: ["formStructure", selectedInsuranceType],
    queryFn: () => fetchFormStructure(selectedInsuranceType),
    enabled: !!selectedInsuranceType,
  })

  // Create dynamic validation schema based on form structure
  const createValidationSchema = (fields: any[]) => {
    if (!fields) return yup.object().shape({})

    const schemaFields: Record<string, any> = {}

    fields.forEach((field) => {
      let validator: any

      switch (field.type) {
        case "text":
        case "textarea":
          validator = yup.string()
          if (field.required) {
            validator = validator.required(`${field.label} is required`)
          }
          break

        case "email":
          validator = yup.string()
          if (field.required) {
            validator = validator.required(`${field.label} is required`)
          }
          validator = validator.email("Please enter a valid email")
          break

        case "number":
          validator = yup.number().typeError("Please enter a valid number")
          if (field.min !== undefined) {
            validator = validator.min(field.min, `Minimum value is ${field.min}`)
          }
          if (field.max !== undefined) {
            validator = validator.max(field.max, `Maximum value is ${field.max}`)
          }
          if (field.required) {
            validator = validator.required(`${field.label} is required`)
          }
          break

        case "date":
          validator = yup.date().typeError("Please select a valid date")
          if (field.required) {
            validator = validator.required(`${field.label} is required`)
          }
          break

        case "checkbox":
          validator = yup.boolean()
          if (field.required) {
            validator = validator.oneOf([true], `You must accept the ${field.label}`)
          }
          break

        case "radio":
        case "select":
          validator = yup.string()
          if (field.required) {
            validator = validator.required(`${field.label} is required`)
          }
          break

        default:
          validator = yup.string()
          if (field.required) {
            validator = validator.required(`${field.label} is required`)
          }
      }

      schemaFields[field.id] = validator
    })

    return yup.object().shape(schemaFields)
  }

  // Initialize default values for form fields
  const getDefaultValues = () => {
    if (!formStructure?.fields) return {}

    const defaultValues: Record<string, any> = {}

    formStructure.fields.forEach((field: any) => {
      switch (field.type) {
        case "text":
        case "email":
        case "textarea":
          defaultValues[field.id] = ""
          break
        case "number":
          defaultValues[field.id] = null
          break
        case "date":
          defaultValues[field.id] = undefined
          break
        case "checkbox":
          defaultValues[field.id] = false
          break
        case "radio":
        case "select":
          defaultValues[field.id] = ""
          break
        default:
          defaultValues[field.id] = ""
      }
    })

    return defaultValues
  }

  const validationSchema = createValidationSchema(formStructure?.fields)
  const methods = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
    defaultValues: getDefaultValues(),
  })

  // Reset form with proper default values when form structure changes
  useEffect(() => {
    if (formStructure?.fields) {
      methods.reset(getDefaultValues())
    }
  }, [formStructure, methods])

  // Watch form values to handle conditional fields
  const formValues: Record<string, any> = methods.watch()

  // Filter fields based on conditions
  const getVisibleFields = () => {
    if (!formStructure?.fields) return []

    return formStructure.fields.filter((field: any) => {
      if (!field.condition) return true

      const { dependsOn, value } = field.condition
      return formValues[dependsOn as keyof typeof formValues] === value
    })
  }

  // Submit application mutation
  const submitMutation = useMutation({
    mutationFn: submitApplication,
    onSuccess: () => {
      toast({
        title: "Application Submitted",
        description: "Your insurance application has been submitted successfully.",
      })
      methods.reset(getDefaultValues())
      queryClient.invalidateQueries({ queryKey: ["applications"] })
      onSubmitSuccess()
    },
    onError: () => {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      })
    },
  })

  const onSubmit = (data: any) => {
    // Format dates for submission
    const formattedData = { ...data }

    // Convert Date objects to ISO strings for submission
    Object.keys(formattedData).forEach((key) => {
      if (formattedData[key] instanceof Date) {
        formattedData[key] = formattedData[key].toISOString()
      }
    })

    // Submit the application
    submitMutation.mutate({
      insuranceType: selectedInsuranceType,
      formData: formattedData,
      submittedAt: new Date().toISOString(),
    })
  }

  if (isLoadingTypes) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>New Insurance Application</CardTitle>
        <CardDescription>Please select an insurance type and fill out the application form.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <Label htmlFor="insurance-type">Insurance Type</Label>
          <Select
            value={selectedInsuranceType}
            onValueChange={(value) => {
              setSelectedInsuranceType(value)
            }}
          >
            <SelectTrigger id="insurance-type" className="w-full">
              <SelectValue placeholder="Select insurance type" />
            </SelectTrigger>
            <SelectContent>
              {insuranceTypes?.map((type: any) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedInsuranceType && (
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              {isLoadingForm ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="space-y-4">
                  {getVisibleFields().map((field: any) => (
                    <DynamicField key={field.id} field={field} />
                  ))}

                  <div className="pt-4">
                    <Button type="submit" className="w-full" disabled={submitMutation.isPending}>
                      {submitMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Application"
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </FormProvider>
        )}
      </CardContent>
    </Card>
  )
}

