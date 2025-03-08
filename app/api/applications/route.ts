import { NextResponse } from "next/server"
import { fetchApplications, submitApplication } from "@/lib/api"

export async function GET() {
  try {
    const applications = await fetchApplications()
    return NextResponse.json(applications)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.insuranceType || !data.formData) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Submit the application
    const result = await submitApplication(data)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error submitting application:", error)
    return NextResponse.json({ error: "Failed to submit application" }, { status: 500 })
  }
}

