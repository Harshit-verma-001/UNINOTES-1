import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const body = await request.json()
  const value = typeof body.value === "number" ? Math.min(5, Math.max(1, Math.round(body.value))) : undefined
  if (value === undefined) {
    return NextResponse.json({ error: "Rating value 1-5 required" }, { status: 400 })
  }

  const note = await prisma.note.findUnique({ where: { id } })
  if (!note || note.status !== "approved") {
    return NextResponse.json({ error: "Note not found" }, { status: 404 })
  }

  await prisma.rating.upsert({
    where: {
      noteId_userId: { noteId: id, userId: user.id },
    },
    create: { noteId: id, userId: user.id, value },
    update: { value },
  })

  const agg = await prisma.rating.aggregate({
    where: { noteId: id },
    _avg: { value: true },
    _count: true,
  })

  await prisma.note.update({
    where: { id },
    data: {
      averageRating: agg._avg.value ?? null,
      reviewCount: agg._count,
    },
  })

  return NextResponse.json({ ok: true, averageRating: agg._avg.value, reviewCount: agg._count })
}
