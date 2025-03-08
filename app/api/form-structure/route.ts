import { NextResponse } from "next/server"
import { fetchFormStructure } from "@/lib/api"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const insuranceType = searchParams.get("type")

    if (!insuranceType) {
      return NextResponse.json({ error: "Insurance type is required" }, { status: 400 })
    }

    const formStructure = await fetchFormStructure(insuranceType)
    return NextResponse.json(formStructure)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch form structure" }, { status: 500 })
  }
}

