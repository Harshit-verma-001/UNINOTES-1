import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
  const departments = await prisma.department.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { notes: { where: { status: "approved" } } } },
    },
  })
  const withCounts = departments.map((d) => ({
    id: d.id,
    slug: d.slug,
    name: d.name,
    fullName: d.fullName,
    description: d.description,
    notesCount: d._count.notes,
  }))
  return NextResponse.json(withCounts)
}
