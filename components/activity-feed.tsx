"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Clock } from "lucide-react"
import { format } from "date-fns"
import type { ActivityLog } from "@/lib/db"

interface ActivityFeedProps {
  limit?: number
}

export function ActivityFeed({ limit = 10 }: ActivityFeedProps) {
  const [activities, setActivities] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch(`/api/activity?limit=${limit}`)
        const data = await response.json()
        setActivities(data)
      } catch (error) {
        console.error("Error fetching activities:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [limit])

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getStatusColor = (action: string) => {
    return action === "booked" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
  }

  const getStatusDot = (action: string) => {
    return action === "booked" ? "bg-green-500" : "bg-red-500"
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
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
    )
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-3 p-4 border rounded-lg bg-card">
          <div className="relative">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="text-xs font-medium">{getInitials(activity.member_name || "")}</AvatarFallback>
            </Avatar>
            <div
              className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${getStatusDot(activity.action)}`}
            ></div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <p className="text-sm font-medium">{activity.member_name}</p>
                <p className="text-sm text-muted-foreground">
                  {activity.action === "booked" ? "booked a slot for" : "cancelled a slot for"}
                </p>
              </div>
              <Badge variant={activity.action === "booked" ? "default" : "destructive"} className="text-xs">
                {activity.action === "booked" ? "Current Booking" : "Cancelled"}
              </Badge>
            </div>

            <div className="mt-2 space-y-1">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>{format(new Date(activity.created_at), "h:mm:ss a")}</span>
                <span>{format(new Date(activity.booking_date), "MMM d, yyyy")}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Full timestamp: {format(new Date(activity.created_at), "MMM d, yyyy 'at' h:mm:ss a")}
              </p>
              {activity.device_info && (
                <p className="text-xs text-muted-foreground truncate" title={activity.device_info}>
                  {activity.device_info}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}

      {activities.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>No recent activity</p>
        </div>
      )}
    </div>
  )
}
