import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const { memberId, bookingDate, deviceInfo } = await request.json()

    if (!memberId || !bookingDate) {
      return NextResponse.json({ error: "Member ID and booking date are required" }, { status: 400 })
    }

    // Find the booking to cancel
    const existingBooking = await sql`
      SELECT id, slot_number FROM bookings 
      WHERE member_id = ${memberId} 
        AND booking_date = ${bookingDate} 
        AND status = 'active'
    `

    if (existingBooking.length === 0) {
      return NextResponse.json({ error: "No active booking found for this member and date" }, { status: 404 })
    }

    const booking = existingBooking[0]

    // Cancel the booking
    await sql`
      UPDATE bookings 
      SET status = 'cancelled', updated_at = NOW()
      WHERE id = ${booking.id}
    `

    // Log the activity
    await sql`
      INSERT INTO activity_log (member_id, action_type, booking_date, slot_number, device_info)
      VALUES (${memberId}, 'cancelled', ${bookingDate}, ${booking.slot_number}, ${deviceInfo})
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error cancelling booking:", error)
    return NextResponse.json({ error: "Failed to cancel booking" }, { status: 500 })
  }
}
