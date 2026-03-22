import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/db"
import { requireRole } from "@/lib/auth"

const rejectSchema = z.object({
  reason: z.string().min(5, "Rejection reason is too short.").max(500),
})

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireRole(["host", "admin"])
    const noteId = params.id

    const note = await prisma.note.findUnique({ where: { id: noteId } })
    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 })
    }

    // A host can only reject notes in their own department
    if (user.role === "host" && user.departmentId !== note.departmentId) {
      return NextResponse.json({ error: "You can only reject notes in your department." }, { status: 403 })
    }

    const body = await request.json()
    const { reason } = rejectSchema.parse(body)

    const updatedNote = await prisma.note.update({
      where: { id: noteId },
      data: {
        status: "rejected",
        rejectionReason: reason,
      },
    })

    return NextResponse.json(updatedNote)
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 })
    }
    if (err instanceof Response) return err // Re-throw auth errors
    console.error(err)
    return NextResponse.json({ error: "Failed to reject note" }, { status: 500 })
  }
}