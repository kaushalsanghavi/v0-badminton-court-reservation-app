"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { format } from "date-fns"
import type { Comment, Member } from "@/lib/db"

interface CommentsModalProps {
  isOpen: boolean
  onClose: () => void
  date: string
  selectedMember: string
}

export function CommentsModal({ isOpen, onClose, date, selectedMember }: CommentsModalProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [members, setMembers] = useState<Member[]>([])
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    if (isOpen && date) {
      fetchComments()
      fetchMembers()
    }
  }, [isOpen, date])

  const fetchComments = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/comments?date=${date}`)
      const data = await response.json()
      setComments(data)
    } catch (error) {
      console.error("Error fetching comments:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMembers = async () => {
    try {
      const response = await fetch("/api/members")
      const data = await response.json()
      setMembers(data)
    } catch (error) {
      console.error("Error fetching members:", error)
    }
  }

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !selectedMember) {
      alert("Please select a member and enter a comment")
      return
    }

    try {
      setSubmitting(true)
      const member = members.find((m) => m.name === selectedMember)
      if (!member) {
        alert("Member not found")
        return
      }

      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memberId: member.id,
          commentDate: date,
          commentText: newComment.trim(),
        }),
      })

      if (response.ok) {
        setNewComment("")
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 3000)
        await fetchComments() // Refresh comments
      } else {
        const error = await response.json()
        alert(error.error || "Failed to post comment")
      }
    } catch (error) {
      console.error("Error posting comment:", error)
      alert("Failed to post comment")
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMMM d, yyyy")
    } catch {
      return dateString
    }
  }

  const formatTimestamp = (timestamp: string) => {
    try {
      return format(new Date(timestamp), "MMM d, h:mm a")
    } catch {
      return timestamp
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Comments for {formatDate(date)}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Existing Comments */}
          <div className="space-y-4">
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <Card className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                      </div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                    </Card>
                  </div>
                ))}
              </div>
            ) : comments.length > 0 ? (
              comments.map((comment) => (
                <Card key={comment.id} className="p-4 bg-muted/30">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{comment.member_name}</h4>
                    <span className="text-sm text-muted-foreground">{formatTimestamp(comment.created_at)}</span>
                  </div>
                  <p className="text-sm">{comment.comment_text}</p>
                </Card>
              ))
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <p>No comments for this date yet.</p>
              </div>
            )}
          </div>

          <hr />

          {/* Add New Comment */}
          <div className="space-y-4">
            <h3 className="font-medium text-muted-foreground">Add New Comment</h3>
            <Textarea
              placeholder="Add a comment about this day..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[100px] resize-none"
            />
            <div className="flex justify-end">
              <Button
                onClick={handleSubmitComment}
                disabled={submitting || !newComment.trim() || !selectedMember}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                {submitting ? "Posting..." : "Post Comment"}
              </Button>
            </div>
          </div>

          {/* Success Message */}
          {showSuccess && (
            <Card className="p-4 bg-green-50 border-green-200">
              <div className="text-green-800">
                <h4 className="font-medium">Comment added</h4>
                <p className="text-sm">Your comment has been posted successfully</p>
              </div>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
