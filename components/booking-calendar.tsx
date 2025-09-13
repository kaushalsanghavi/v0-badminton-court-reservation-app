"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Clock } from "lucide-react"
import { format, addDays, startOfWeek, isBefore, startOfDay } from "date-fns"
import type { Booking, Member } from "@/lib/db"

interface DayData {
  date: Date
  dateString: string
  dayName: string
  isPast: boolean
  bookedMembers: string[]
  bookedCount: number
  maxSlots: number
}

interface BookingCalendarProps {
  selectedMember: string
  onBookSlot: (date: string) => void
  onCancelBooking: (date: string) => void
  onShowComments: (date: string) => void
  onShowBookingHistory: (date: string) => void
}

export function BookingCalendar({
  selectedMember,
  onBookSlot,
  onCancelBooking,
  onShowComments,
  onShowBookingHistory,
}: BookingCalendarProps) {
  const [weekDays, setWeekDays] = useState<DayData[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)

  // Generate 2 weeks of weekdays (Monday-Friday)
  const generateWeekdays = () => {
    const today = new Date()
    const currentWeekStart = startOfWeek(today, { weekStartsOn: 1 }) // Monday
    const days: DayData[] = []

    // Generate 2 weeks (10 weekdays)
    for (let week = 0; week < 2; week++) {
      for (let day = 0; day < 5; day++) {
        // Monday to Friday
        const date = addDays(currentWeekStart, week * 7 + day)
        const dateString = format(date, "yyyy-MM-dd")
        const isPast = isBefore(date, startOfDay(today))

        days.push({
          date,
          dateString,
          dayName: format(date, "EEE, MMM d"),
          isPast,
          bookedMembers: [],
          bookedCount: 0,
          maxSlots: 6,
        })
      }
    }

    return days
  }

  const fetchData = async () => {
    try {
      setLoading(true)
      const days = generateWeekdays()
      const startDate = days[0].dateString
      const endDate = days[days.length - 1].dateString

      // Fetch bookings and members
      const [bookingsRes, membersRes] = await Promise.all([
        fetch(`/api/bookings?startDate=${startDate}&endDate=${endDate}`),
        fetch("/api/members"),
      ])

      const bookingsData = await bookingsRes.json()
      const membersData = await membersRes.json()

      setBookings(bookingsData)
      setMembers(membersData)

      // Process bookings into day data
      const processedDays = days.map((day) => {
        const dayBookings = bookingsData.filter((b: Booking) => b.booking_date === day.dateString)
        return {
          ...day,
          bookedMembers: dayBookings.map((b: Booking) => b.member_name || ""),
          bookedCount: dayBookings.length,
        }
      })

      setWeekDays(processedDays)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const isUserBooked = (day: DayData) => {
    return day.bookedMembers.includes(selectedMember)
  }

  const canBook = (day: DayData) => {
    return !day.isPast && day.bookedCount < day.maxSlots && !isUserBooked(day)
  }

  const canCancel = (day: DayData) => {
    return !day.isPast && isUserBooked(day)
  }

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>
  }

  // Split days into weeks
  const week1 = weekDays.slice(0, 5)
  const week2 = weekDays.slice(5, 10)

  const renderWeek = (days: DayData[], weekLabel: string) => (
    <div key={weekLabel} className="space-y-4">
      <h3 className="text-center text-sm text-muted-foreground font-medium">{weekLabel}</h3>
      <div className="grid grid-cols-5 gap-4">
        {days.map((day) => (
          <Card key={day.dateString} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-medium">{day.dayName}</CardTitle>
                  <p className="text-xs text-muted-foreground">{day.isPast ? "Past" : format(day.date, "EEEE")}</p>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {day.bookedCount}/{day.maxSlots}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">BOOKED MEMBERS</p>
                <div className="space-y-1">
                  {day.bookedMembers.map((member, index) => (
                    <Badge
                      key={index}
                      variant={member === selectedMember ? "default" : "secondary"}
                      className="text-xs mr-1 mb-1"
                    >
                      {member}
                    </Badge>
                  ))}
                </div>
                {day.isPast && day.bookedCount > 0 && (
                  <p className="text-xs text-muted-foreground mt-2">{day.isPast ? "Booked (Past)" : "Past Date"}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                {canBook(day) && (
                  <Button
                    size="sm"
                    className="w-full bg-green-100 hover:bg-green-200 text-green-800 border-green-200"
                    onClick={() => onBookSlot(day.dateString)}
                  >
                    Book Slot
                  </Button>
                )}

                {canCancel(day) && (
                  <Button
                    size="sm"
                    variant="destructive"
                    className="w-full bg-red-100 hover:bg-red-200 text-red-800 border-red-200"
                    onClick={() => onCancelBooking(day.dateString)}
                  >
                    Cancel Booking
                  </Button>
                )}

                <div className="flex items-center justify-between pt-2 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                    onClick={() => onShowComments(day.dateString)}
                  >
                    <MessageCircle className="h-3 w-3" />
                    Comments
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                    onClick={() => onShowBookingHistory(day.dateString)}
                  >
                    <Clock className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-1">2-Week Booking Window</h2>
        <p className="text-sm text-muted-foreground">Weekdays only (Monday - Friday)</p>
      </div>

      {renderWeek(week1, `Week of ${format(week1[0].date, "MMM d")}`)}
      {renderWeek(week2, `Week of ${format(week2[0].date, "MMM d")}`)}
    </div>
  )
}
