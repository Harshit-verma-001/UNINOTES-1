import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const note = await prisma.note.findUnique({ where: { id } })
  if (!note || note.status !== "approved") {
    return NextResponse.json({ error: "Note not found" }, { status: 404 })
  }

  await prisma.$transaction([
    prisma.download.create({ data: { noteId: id, userId: user.id } }),
    prisma.note.update({
      where: { id },
      data: { downloadCount: { increment: 1 } },
    }),
  ])

  return NextResponse.json({ ok: true, fileUrl: note.fileUrl })
}
