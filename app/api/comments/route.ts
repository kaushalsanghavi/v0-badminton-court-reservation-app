import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get("date")

    if (!date) {
      return NextResponse.json({ error: "Date is required" }, { status: 400 })
    }

    const comments = await sql`
      SELECT 
        c.id,
        c.member_id,
        c.comment_date,
        c.comment_text,
        c.created_at,
        c.updated_at,
        m.name as member_name
      FROM comments c
      JOIN members m ON c.member_id = m.id
      WHERE c.comment_date = ${date}
      ORDER BY c.created_at ASC
    `

    return NextResponse.json(comments)
  } catch (error) {
    console.error("Error fetching comments:", error)
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { memberId, commentDate, commentText } = await request.json()

    if (!memberId || !commentDate || !commentText) {
      return NextResponse.json({ error: "Member ID, comment date, and comment text are required" }, { status: 400 })
    }

    const comment = await sql`
      INSERT INTO comments (member_id, comment_date, comment_text)
      VALUES (${memberId}, ${commentDate}, ${commentText})
      RETURNING *
    `

    return NextResponse.json(comment[0])
  } catch (error) {
    console.error("Error creating comment:", error)
    return NextResponse.json({ error: "Failed to create comment" }, { status: 500 })
  }
}
