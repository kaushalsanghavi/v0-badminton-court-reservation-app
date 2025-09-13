import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    console.log("[v0] Attempting to fetch members from database")
    console.log("[v0] DATABASE_URL exists:", !!process.env.DATABASE_URL)

    const members = await sql`
      SELECT id, name, email, avatar_color, created_at 
      FROM public.members 
      ORDER BY name ASC
    `

    console.log("[v0] Successfully fetched members:", members.length)
    return NextResponse.json(members)
  } catch (error) {
    console.error("[v0] Error fetching members:", error)
    return NextResponse.json({ error: "Failed to fetch members" }, { status: 500 })
  }
}
