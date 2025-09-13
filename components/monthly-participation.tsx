"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { ChevronDown } from "lucide-react"

interface ParticipationData {
  id: number
  name: string
  bookings: number
  participation_rate: number
}

export function MonthlyParticipation() {
  const [participationData, setParticipationData] = useState<ParticipationData[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState("September")
  const [selectedYear, setSelectedYear] = useState("2025")

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const years = ["2024", "2025", "2026"]

  useEffect(() => {
    const fetchParticipation = async () => {
      try {
        setLoading(true)
        const monthNumber = months.indexOf(selectedMonth) + 1
        const response = await fetch(`/api/participation?month=${monthNumber}&year=${selectedYear}`)
        const data = await response.json()
        setParticipationData(data)
      } catch (error) {
        console.error("Error fetching participation data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchParticipation()
  }, [selectedMonth, selectedYear])

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getStatusBadge = (rate: number) => {
    if (rate >= 50) return { label: "High", variant: "default" as const, color: "bg-green-100 text-green-800" }
    if (rate >= 30) return { label: "Medium", variant: "secondary" as const, color: "bg-yellow-100 text-yellow-800" }
    return { label: "Low", variant: "destructive" as const, color: "bg-red-100 text-red-800" }
  }

  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-green-100 text-green-800",
      "bg-blue-100 text-blue-800",
      "bg-purple-100 text-purple-800",
      "bg-pink-100 text-pink-800",
      "bg-yellow-100 text-yellow-800",
      "bg-cyan-100 text-cyan-800",
      "bg-orange-100 text-orange-800",
      "bg-red-100 text-red-800",
      "bg-indigo-100 text-indigo-800",
      "bg-gray-100 text-gray-800",
    ]
    const index = name.length % colors.length
    return colors[index]
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 border rounded">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-2 bg-gray-200 rounded w-full"></div>
                </div>
                <div className="w-16 h-6 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Monthly Participation</CardTitle>
            <p className="text-sm text-muted-foreground">
              {selectedMonth} {selectedYear} booking statistics
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-[130px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[80px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 pb-2 border-b text-sm font-medium text-muted-foreground">
            <div className="col-span-4">MEMBER</div>
            <div className="col-span-2">BOOKINGS</div>
            <div className="col-span-4 flex items-center gap-1">
              PARTICIPATION RATE
              <ChevronDown className="h-3 w-3" />
            </div>
            <div className="col-span-2">STATUS</div>
          </div>

          {/* Table Rows */}
          <div className="space-y-3">
            {participationData.map((member) => {
              const status = getStatusBadge(member.participation_rate)
              return (
                <div key={member.id} className="grid grid-cols-12 gap-4 items-center py-2">
                  {/* Member */}
                  <div className="col-span-4 flex items-center gap-3">
                    <Avatar className={`w-8 h-8 ${getAvatarColor(member.name)}`}>
                      <AvatarFallback className="text-xs font-medium">{getInitials(member.name)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{member.name}</span>
                  </div>

                  {/* Bookings */}
                  <div className="col-span-2">
                    <span className="font-medium">{member.bookings}</span>
                  </div>

                  {/* Participation Rate */}
                  <div className="col-span-4">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <Progress value={member.participation_rate} className="flex-1 h-2" />
                        <span className="text-sm font-medium ml-2 min-w-[35px]">{member.participation_rate}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="col-span-2">
                    <Badge className={status.color}>{status.label}</Badge>
                  </div>
                </div>
              )
            })}
          </div>

          {participationData.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>
                No participation data available for {selectedMonth} {selectedYear}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
