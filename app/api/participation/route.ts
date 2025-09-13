import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const month = searchParams.get("month") || new Date().getMonth() + 1
    const year = searchParams.get("year") || new Date().getFullYear()

    // Get total possible slots for the month (weekdays only, 6 slots per day)
    const totalSlotsQuery = await sql`
      SELECT COUNT(*) * 6 as total_slots
      FROM generate_series(
        DATE(${year} || '-' || ${month} || '-01'),
        DATE(${year} || '-' || ${month} || '-01') + INTERVAL '1 month' - INTERVAL '1 day',
        '1 day'::interval
      ) AS date_series(date)
      WHERE EXTRACT(DOW FROM date) BETWEEN 1 AND 5
    `

    const totalSlots = Number.parseInt(totalSlotsQuery[0].total_slots)

    // Get member participation stats
    const participation = await sql`
      SELECT 
        m.id,
        m.name,
        COUNT(b.id) as bookings,
        ROUND((COUNT(b.id)::numeric / ${totalSlots}) * 100, 0) as participation_rate
      FROM members m
      LEFT JOIN bookings b ON m.id = b.member_id 
        AND b.status = 'active'
        AND EXTRACT(MONTH FROM b.booking_date) = ${month}
        AND EXTRACT(YEAR FROM b.booking_date) = ${year}
      GROUP BY m.id, m.name
      ORDER BY bookings DESC, m.name ASC
    `

    return NextResponse.json(participation)
  } catch (error) {
    console.error("Error fetching participation:", error)
    return NextResponse.json({ error: "Failed to fetch participation" }, { status: 500 })
  }
}
