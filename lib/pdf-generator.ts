// PDF Generator using jsPDF
import { formatDate } from "./utils"

// Helper function to format field names
function formatFieldName(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1") // Add space before capital letters
    .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
}

// Helper function to format field values
function formatFieldValue(value: any): string {
  if (value === null || value === undefined) return "N/A"
  if (typeof value === "boolean") return value ? "Yes" : "No"
  return String(value)
}

export async function generatePDF(application: any) {
  // Dynamically import jsPDF to avoid SSR issues
  const { jsPDF } = await import("jspdf")

  // Create a new PDF document
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  })

  // Set font size and styles
  doc.setFontSize(20)
  doc.setFont("helvetica", "bold")

  // Add title
  doc.text("Insurance Application", 105, 20, { align: "center" })

  // Add application details
  doc.setFontSize(12)
  doc.setFont("helvetica", "normal")

  // Add application ID and type
  doc.setFont("helvetica", "bold")
  doc.text(`Application ID: ${application.id}`, 20, 40)
  doc.text(`Insurance Type: ${application.insuranceType}`, 20, 50)

  // Add submission date and status
  doc.text(`Submitted: ${formatDate(application.submittedAt)}`, 20, 60)

  doc.setFont("helvetica", "bold")
  doc.text(`Status: ${application.status}`, 20, 70)

  // Add horizontal line
  doc.setDrawColor(200, 200, 200)
  doc.line(20, 75, 190, 75)

  // Add form data
  doc.setFontSize(16)
  doc.setFont("helvetica", "bold")
  doc.text("Application Details", 20, 85)

  // Add form fields
  doc.setFontSize(11)
  let yPosition = 95

  Object.entries(application.formData).forEach(([key, value]) => {
    // Check if we need to add a new page
    if (yPosition > 270) {
      doc.addPage()
      yPosition = 20
    }

    doc.setFont("helvetica", "bold")
    doc.text(`${formatFieldName(key)}:`, 20, yPosition)

    doc.setFont("helvetica", "normal")
    doc.text(`${formatFieldValue(value)}`, 80, yPosition)

    yPosition += 10
  })

  // Add footer
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setFont("helvetica", "normal")
    doc.text(`Page ${i} of ${pageCount}`, 105, 290, { align: "center" })
    doc.text(`Generated on ${new Date().toLocaleString()}`, 105, 295, { align: "center" })
  }

  // Save the PDF
  doc.save(`application-${application.id}.pdf`)
}

