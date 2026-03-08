import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const note = await prisma.note.findUnique({ where: { id } })
  if (!note || note.status !== "approved") {
    return NextResponse.json({ error: "Note not found" }, { status: 404 })
  }

  const comments = await prisma.comment.findMany({
    where: { noteId: id },
    include: { user: { select: { firstName: true, lastName: true } } },
    orderBy: { createdAt: "desc" },
  })

  const list = comments.map((c) => ({
    id: c.id,
    author: `${c.user.firstName} ${c.user.lastName}`,
    content: c.content,
    likes: c.likes,
    date: c.createdAt,
  }))

  return NextResponse.json(list)
}

export async function POST(
  request: NextRequest,
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

  const body = await request.json()
  const content = (body.content as string)?.trim()
  if (!content) {
    return NextResponse.json({ error: "Content required" }, { status: 400 })
  }

  const comment = await prisma.comment.create({
    data: { noteId: id, userId: user.id, content },
    include: { user: { select: { firstName: true, lastName: true } } },
  })

  return NextResponse.json({
    id: comment.id,
    author: `${comment.user.firstName} ${comment.user.lastName}`,
    content: comment.content,
    likes: comment.likes,
    date: comment.createdAt,
  })
}
