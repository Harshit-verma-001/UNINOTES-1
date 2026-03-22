import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireRole } from "@/lib/auth"

export async function POST(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireRole(["host", "admin"])
    const noteId = params.id

    const note = await prisma.note.findUnique({ where: { id: noteId } })
    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 })
    }

    // A host can only approve notes in their own department
    if (user.role === "host" && user.departmentId !== note.departmentId) {
      return NextResponse.json({ error: "You can only approve notes in your department." }, { status: 403 })
    }

    const updatedNote = await prisma.note.update({
      where: { id: noteId },
      data: {
        status: "approved",
        approvedById: user.id,
      },
    })

    return NextResponse.json(updatedNote)
  } catch (err) {
    if (err instanceof Response) return err // Re-throw auth errors
    console.error(err)
    return NextResponse.json({ error: "Failed to approve note" }, { status: 500 })
  }
}