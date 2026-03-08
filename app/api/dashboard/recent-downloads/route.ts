import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireAuth } from "@/lib/auth"

export async function GET() {
  const user = await requireAuth()

  const downloads = await prisma.download.findMany({
    where: { userId: user.id },
    include: { note: { select: { id: true, title: true, subject: true } } },
    orderBy: { createdAt: "desc" },
    take: 10,
  })

  const list = downloads.map((d) => ({
    id: d.note.id,
    title: d.note.title,
    subject: d.note.subject,
    downloadedAt: d.createdAt,
  }))

  return NextResponse.json(list)
}
