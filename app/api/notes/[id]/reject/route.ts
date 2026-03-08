import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireRole } from "@/lib/auth"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireRole(["host", "admin"])

  const { id } = await params
  const body = await request.json().catch(() => ({}))
  const reason = (body.reason as string)?.trim() || null

  const note = await prisma.note.findUnique({ where: { id } })
  if (!note) {
    return NextResponse.json({ error: "Note not found" }, { status: 404 })
  }
  if (note.status !== "pending") {
    return NextResponse.json({ error: "Note is not pending" }, { status: 400 })
  }

  await prisma.note.update({
    where: { id },
    data: { status: "rejected", rejectionReason: reason },
  })

  return NextResponse.json({ ok: true })
}
