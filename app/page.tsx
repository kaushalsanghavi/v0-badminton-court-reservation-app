"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Users, Settings } from "lucide-react"
import { QuickBooking } from "@/components/quick-booking"
import { BookingCalendar } from "@/components/booking-calendar"
import { RecentActivitySection } from "@/components/recent-activity-section"
import { MonthlyParticipation } from "@/components/monthly-participation"
import { CommentsModal } from "@/components/comments-modal"
import { BookingHistoryModal } from "@/components/booking-history-modal"

export default function HomePage() {
  const [selectedMember, setSelectedMember] = useState("")
  const [activeTab, setActiveTab] = useState("recent-activity")
  const [commentsModalOpen, setCommentsModalOpen] = useState(false)
  const [bookingHistoryModalOpen, setBookingHistoryModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState("")

  const handleBookSlot = async (date: string) => {
    if (!selectedMember) {
      alert("Please select a member first")
      return
    }

    try {
      const member = await fetch("/api/members")
        .then((res) => res.json())
        .then((members) => members.find((m: any) => m.name === selectedMember))

      if (!member) {
        alert("Member not found")
        return
      }

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memberId: member.id,
          bookingDate: date,
          deviceInfo: navigator.userAgent,
        }),
      })

      if (response.ok) {
        // Refresh the page to show updated bookings
        window.location.reload()
      } else {
        const error = await response.json()
        alert(error.error || "Failed to book slot")
      }
    } catch (error) {
      console.error("Error booking slot:", error)
      alert("Failed to book slot")
    }
  }

  const handleCancelBooking = async (date: string) => {
    if (!selectedMember) {
      alert("Please select a member first")
      return
    }

    try {
      const member = await fetch("/api/members")
        .then((res) => res.json())
        .then((members) => members.find((m: any) => m.name === selectedMember))

      if (!member) {
        alert("Member not found")
        return
      }

      const response = await fetch("/api/bookings/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memberId: member.id,
          bookingDate: date,
          deviceInfo: navigator.userAgent,
        }),
      })

      if (response.ok) {
        // Refresh the page to show updated bookings
        window.location.reload()
      } else {
        const error = await response.json()
        alert(error.error || "Failed to cancel booking")
      }
    } catch (error) {
      console.error("Error cancelling booking:", error)
      alert("Failed to cancel booking")
    }
  }

  const handleShowComments = (date: string) => {
    setSelectedDate(date)
    setCommentsModalOpen(true)
  }

  const handleShowBookingHistory = (date: string) => {
    setSelectedDate(date)
    setBookingHistoryModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold">Our own slot bookings for Badminton</h1>
              <p className="text-sm text-muted-foreground">Group Scheduler @ Sunny</p>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                8:30 AM - 9:45 AM
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />6 slots available daily
              </div>
              <button className="flex items-center gap-1 hover:text-foreground">
                <Settings className="h-4 w-4" />
                Design Options
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-fit grid-cols-2">
            <TabsTrigger value="recent-activity">Recent Activity</TabsTrigger>
            <TabsTrigger value="monthly-participation">Monthly Participation</TabsTrigger>
          </TabsList>

          <TabsContent value="recent-activity" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Quick Booking Section */}
                <QuickBooking selectedMember={selectedMember} onMemberChange={setSelectedMember} />

                {/* Main Booking Calendar */}
                <BookingCalendar
                  selectedMember={selectedMember}
                  onBookSlot={handleBookSlot}
                  onCancelBooking={handleCancelBooking}
                  onShowComments={handleShowComments}
                  onShowBookingHistory={handleShowBookingHistory}
                />
              </div>

              <div className="lg:col-span-1">
                <RecentActivitySection />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="monthly-participation">
            <MonthlyParticipation />
          </TabsContent>
        </Tabs>
      </div>

      <CommentsModal
        isOpen={commentsModalOpen}
        onClose={() => setCommentsModalOpen(false)}
        date={selectedDate}
        selectedMember={selectedMember}
      />

      <BookingHistoryModal
        isOpen={bookingHistoryModalOpen}
        onClose={() => setBookingHistoryModalOpen(false)}
        date={selectedDate}
      />
    </div>
  )
}
