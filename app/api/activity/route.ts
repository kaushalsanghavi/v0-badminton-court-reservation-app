import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get("limit") || "10"

    console.log("[v0] Fetching activity log with limit:", limit)

    const activities = await sql`
      SELECT 
        a.id,
        a.member_id,
        a.action,
        a.booking_date,
        a.device_info,
        a.created_at,
        m.name as member_name
      FROM public.activity_log a
      JOIN public.members m ON a.member_id = m.id
      ORDER BY a.created_at DESC
      LIMIT ${Number.parseInt(limit)}
    `

    console.log("[v0] Successfully fetched activities:", activities.length)
    return NextResponse.json(activities)
  } catch (error) {
    console.error("[v0] Error fetching activity:", error)
    return NextResponse.json({ error: "Failed to fetch activity" }, { status: 500 })
  }
}
