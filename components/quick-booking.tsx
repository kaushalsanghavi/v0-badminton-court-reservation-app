"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Member } from "@/lib/db"

interface QuickBookingProps {
  selectedMember: string
  onMemberChange: (member: string) => void
}

export function QuickBooking({ selectedMember, onMemberChange }: QuickBookingProps) {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch("/api/members")
        const data = await response.json()
        if (Array.isArray(data)) {
          setMembers(data)
        } else {
          console.error("Members API returned non-array data:", data)
          setMembers([])
        }
      } catch (error) {
        console.error("Error fetching members:", error)
        setMembers([])
      } finally {
        setLoading(false)
      }
    }

    fetchMembers()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quick Booking</CardTitle>
        <p className="text-sm text-muted-foreground">Select your name to book or cancel slots</p>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <Select value={selectedMember} onValueChange={onMemberChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select member" />
            </SelectTrigger>
            <SelectContent>
              {members.map((member) => (
                <SelectItem key={member.id} value={member.name}>
                  {member.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedMember && (
            <p className="text-sm text-muted-foreground">
              Selected: <span className="font-medium">{selectedMember}</span>
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
