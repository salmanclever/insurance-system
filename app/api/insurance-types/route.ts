import { NextResponse } from "next/server"
import { fetchInsuranceTypes } from "@/lib/api"

export async function GET() {
  try {
    const insuranceTypes = await fetchInsuranceTypes()
    return NextResponse.json(insuranceTypes)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch insurance types" }, { status: 500 })
  }
}

