"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ActivityFeed } from "./activity-feed"

export function RecentActivitySection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Activity</CardTitle>
        <p className="text-sm text-muted-foreground">Latest 10 bookings and cancellations</p>
      </CardHeader>
      <CardContent>
        <ActivityFeed limit={10} />
      </CardContent>
    </Card>
  )
}
