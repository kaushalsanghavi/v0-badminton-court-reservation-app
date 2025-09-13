import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export { sql }

export interface Member {
  id: number
  name: string
  email?: string
  created_at: string
  updated_at: string
}

export interface Booking {
  id: number
  member_id: number
  booking_date: string
  slot_number: number
  status: "active" | "cancelled"
  created_at: string
  updated_at: string
  member_name?: string
}

export interface ActivityLog {
  id: number
  member_id: number
  action_type: "booked" | "cancelled"
  booking_date: string
  slot_number: number
  device_info?: string
  created_at: string
  member_name?: string
}

export interface Comment {
  id: number
  member_id: number
  comment_date: string
  comment_text: string
  created_at: string
  updated_at: string
  member_name?: string
}

export interface DayBooking {
  date: string
  dayName: string
  isPast: boolean
  bookedCount: number
  maxSlots: number
  bookedMembers: string[]
  availableSlots: number
}
