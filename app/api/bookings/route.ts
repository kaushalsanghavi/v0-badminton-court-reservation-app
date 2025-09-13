import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    console.log("[v0] Fetching bookings for date range:", startDate, "to", endDate)

    if (!startDate || !endDate) {
      return NextResponse.json({ error: "Start date and end date are required" }, { status: 400 })
    }

    const bookings = await sql`
      SELECT 
        b.id,
        b.member_id,
        b.booking_date,
        b.created_at,
        m.name as member_name
      FROM public.bookings b
      JOIN public.members m ON b.member_id = m.id
      WHERE b.booking_date >= ${startDate}
        AND b.booking_date <= ${endDate}
      ORDER BY b.booking_date ASC
    `

    console.log("[v0] Successfully fetched bookings:", bookings.length)
    return NextResponse.json(bookings)
  } catch (error) {
    console.error("[v0] Error fetching bookings:", error)
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { memberId, bookingDate, deviceInfo } = await request.json()

    console.log("[v0] Creating booking for member:", memberId, "date:", bookingDate)

    if (!memberId || !bookingDate) {
      return NextResponse.json({ error: "Member ID and booking date are required" }, { status: 400 })
    }

    // Check current bookings for the date
    const currentBookings = await sql`
      SELECT COUNT(*) as count 
      FROM public.bookings 
      WHERE booking_date = ${bookingDate}
    `

    const bookedCount = Number.parseInt(currentBookings[0].count)

    if (bookedCount >= 6) {
      return NextResponse.json({ error: "All slots are booked for this date" }, { status: 400 })
    }

    // Check if member already has a booking for this date
    const existingBooking = await sql`
      SELECT id FROM public.bookings 
      WHERE member_id = ${memberId} 
        AND booking_date = ${bookingDate}
    `

    if (existingBooking.length > 0) {
      return NextResponse.json({ error: "Member already has a booking for this date" }, { status: 400 })
    }

    // Create the booking
    const booking = await sql`
      INSERT INTO public.bookings (member_id, booking_date)
      VALUES (${memberId}, ${bookingDate})
      RETURNING *
    `

    const truncatedDeviceInfo = deviceInfo ? deviceInfo.substring(0, 90) : "Web App"

    // Log the activity
    await sql`
      INSERT INTO public.activity_log (member_id, action, booking_date, device_info)
      VALUES (${memberId}, 'booked', ${bookingDate}, ${truncatedDeviceInfo})
    `

    console.log("[v0] Successfully created booking:", booking[0].id)
    return NextResponse.json(booking[0])
  } catch (error) {
    console.error("[v0] Error creating booking:", error)
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
  }
}
