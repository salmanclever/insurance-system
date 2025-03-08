"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2, Download } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { generatePDF } from "@/lib/pdf-generator"
import { useToast } from "@/hooks/use-toast"

interface ApplicationDetailsModalProps {
  application: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function ApplicationDetailsModal({ application, open, onOpenChange }: ApplicationDetailsModalProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const { toast } = useToast()

  const handleDownloadPDF = async () => {
    if (!application) return

    try {
      setIsDownloading(true)

      // Generate PDF on the client side
      await generatePDF(application)

      toast({
        title: "PDF Downloaded",
        description: "Your application PDF has been generated and downloaded.",
      })
    } catch (error) {
      console.error("Error generating PDF:", error)
      toast({
        title: "Download Failed",
        description: "There was an error generating the PDF. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDownloading(false)
    }
  }

  if (!application) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Application Details</DialogTitle>
          <DialogDescription>Submitted on {formatDate(application.submittedAt)}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">{application.insuranceType}</h3>
              <p className="text-sm text-muted-foreground">Application ID: {application.id}</p>
            </div>
            <div
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                application.status === "Approved"
                  ? "bg-green-100 text-green-800"
                  : application.status === "Pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : application.status === "Rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
              }`}
            >
              {application.status}
            </div>
          </div>

          <div className="border rounded-md p-4">
            <h4 className="font-medium mb-3">Application Data</h4>
            <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {Object.entries(application.formData).map(([key, value]) => (
                <div key={key} className="border-b pb-2">
                  <dt className="text-sm font-medium text-gray-500">{formatFieldName(key)}</dt>
                  <dd className="mt-1 text-sm">{formatFieldValue(value)}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="flex justify-end">
            <Button variant="outline" onClick={handleDownloadPDF} disabled={isDownloading}>
              {isDownloading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating PDF...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Helper functions to format field names and values
function formatFieldName(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1") // Add space before capital letters
    .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
}

function formatFieldValue(value: any): string {
  if (value === null || value === undefined) return "N/A"
  if (typeof value === "boolean") return value ? "Yes" : "No"

  // Check if the value is an ISO date string
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
    return formatDate(value)
  }

  return String(value)
}

