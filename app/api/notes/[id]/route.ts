import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const note = await prisma.note.findUnique({
    where: { id },
    include: {
      department: true,
      contributor: { select: { id: true, firstName: true, lastName: true } },
      approver: { select: { firstName: true, lastName: true } },
    },
  })
  if (!note) {
    return NextResponse.json({ error: "Note not found" }, { status: 404 })
  }
  if (note.status !== "approved") {
    return NextResponse.json({ error: "Note not found" }, { status: 404 })
  }

  const yearLabel = ["", "1st Year", "2nd Year", "3rd Year", "4th Year"][note.year] || `${note.year}`

  return NextResponse.json({
    id: note.id,
    title: note.title,
    subject: note.subject,
    department: note.department.name,
    departmentSlug: note.department.slug,
    year: note.year,
    yearLabel,
    section: note.section.toUpperCase(),
    description: note.description,
    fileUrl: note.fileUrl,
    contributor: note.contributor ? `${note.contributor.firstName} ${note.contributor.lastName}` : null,
    host: note.approver ? `${note.approver.firstName} ${note.approver.lastName}` : null,
    downloads: note.downloadCount,
    rating: note.averageRating ?? 0,
    reviews: note.reviewCount,
    uploadedAt: note.createdAt,
  })
}
