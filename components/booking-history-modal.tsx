"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Calendar, X } from "lucide-react"
import { format } from "date-fns"
import type { ActivityLog } from "@/lib/db"

interface BookingHistoryModalProps {
  isOpen: boolean
  onClose: () => void
  date: string
}

export function BookingHistoryModal({ isOpen, onClose, date }: BookingHistoryModalProps) {
  const [activities, setActivities] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && date) {
      fetchBookingHistory()
    }
  }, [isOpen, date])

  const fetchBookingHistory = async () => {
    try {
      setLoading(true)
      // Fetch all activities for the specific date
      const response = await fetch(`/api/activity?limit=100`)
      const allActivities = await response.json()

      // Filter activities for the specific date
      const dateActivities = allActivities.filter((activity: ActivityLog) => activity.booking_date === date)

      setActivities(dateActivities)
    } catch (error) {
      console.error("Error fetching booking history:", error)
    } finally {
      setLoading(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getStatusColor = (actionType: string) => {
    return actionType === "booked" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
  }

  const getStatusDot = (actionType: string) => {
    return actionType === "booked" ? "bg-green-500" : "bg-red-500"
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "EEEE, MMMM d, yyyy")
    } catch {
      return dateString
    }
  }

  const formatTime = (timestamp: string) => {
    try {
      return format(new Date(timestamp), "h:mm:ss a")
    } catch {
      return timestamp
    }
  }

  const formatFullTimestamp = (timestamp: string) => {
    try {
      return format(new Date(timestamp), "MMM d, yyyy 'at' h:mm:ss a")
    } catch {
      return timestamp
    }
  }

  const parseDeviceInfo = (deviceInfo: string) => {
    if (!deviceInfo) return { device: "Unknown", browser: "Unknown" }

    // Extract device and browser info from user agent
    const androidMatch = deviceInfo.match(/Android [\d.]+/)
    const chromeMatch = deviceInfo.match(/Chrome/)
    const edgeMatch = deviceInfo.match(/Edge/)
    const safariMatch = deviceInfo.match(/Safari/) && !deviceInfo.match(/Chrome/)

    let device = "Unknown"
    let browser = "Unknown"

    if (androidMatch) {
      device = androidMatch[0]
      if (deviceInfo.includes("Pixel")) {
        const pixelMatch = deviceInfo.match(/Android \d+ Pixel \d+/)
        if (pixelMatch) device = pixelMatch[0]
      }
    }

    if (chromeMatch) browser = "Chrome"
    else if (edgeMatch) browser = "Edge"
    else if (safariMatch) browser = "Safari"

    return { device, browser }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            <DialogTitle className="text-lg">Booking History for {formatDate(date)}</DialogTitle>
          </div>
          <button
            onClick={onClose}
            className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <X className="h-4 w-4" />
          </button>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Timeline of all booking actions for this date</p>

          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex items-start gap-3 p-4 border rounded-lg">
                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : activities.length > 0 ? (
            <div className="space-y-4">
              {activities.map((activity) => {
                const { device, browser } = parseDeviceInfo(activity.device_info || "")
                return (
                  <div key={activity.id} className="flex items-start gap-3 p-4 border rounded-lg bg-card">
                    <div className="relative">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-xs font-medium">
                          {getInitials(activity.member_name || "")}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${getStatusDot(activity.action_type)}`}
                      ></div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.member_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {activity.action_type === "booked" ? "booked a slot for" : "cancelled a slot for"}
                          </p>
                        </div>
                        <Badge className={getStatusColor(activity.action_type)}>
                          {activity.action_type === "booked" ? "Current Booking" : "Cancelled"}
                        </Badge>
                      </div>

                      <div className="mt-2 space-y-1">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <span>{formatTime(activity.created_at)}</span>
                          <span>
                            {device} - {browser}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Full timestamp: {formatFullTimestamp(activity.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No booking history available for this date</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
