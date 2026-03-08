import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
  const contributors = await prisma.user.findMany({
    where: {
      notesContributed: { some: { status: "approved" } },
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      department: { select: { slug: true, name: true } },
      year: true,
      _count: { select: { notesContributed: true } },
      notesContributed: {
        where: { status: "approved" },
        select: {
          downloadCount: true,
          averageRating: true,
        },
      },
    },
  })

  const withStats = contributors.map((u) => {
    const notes = u.notesContributed
    const totalDownloads = notes.reduce((s, n) => s + n.downloadCount, 0)
    const avgRating =
      notes.length > 0
        ? notes.reduce((s, n) => s + (n.averageRating ?? 0), 0) / notes.length
        : 0
    return {
      id: u.id,
      name: `${u.firstName} ${u.lastName}`,
      department: u.department?.name ?? "",
      year: u.year,
      yearLabel: u.year ? ["", "1st Year", "2nd Year", "3rd Year", "4th Year"][u.year] : null,
      notesCount: notes.length,
      downloads: totalDownloads,
      rating: Math.round(avgRating * 10) / 10,
    }
  })

  withStats.sort((a, b) => b.notesCount - a.notesCount)
  const ranked = withStats.map((c, i) => ({ ...c, rank: i + 1 }))

  return NextResponse.json(ranked)
}
