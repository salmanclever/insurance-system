import { NextResponse } from "next/server"
import { fetchApplicationById } from "@/lib/api"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const application = await fetchApplicationById(id)

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }

    // Return the application data for client-side PDF generation
    return NextResponse.json(application)
  } catch (error) {
    console.error("Error fetching application:", error)
    return NextResponse.json({ error: "Failed to fetch application" }, { status: 500 })
  }
}

