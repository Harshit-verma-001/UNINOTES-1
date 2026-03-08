import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/db"
import { requireAuth } from "@/lib/auth"

const createNoteSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(5000),
  department: z.string().min(1),
  year: z.coerce.number().int().min(1).max(4),
  section: z.string().trim().min(1).max(2),
  subject: z.string().min(1).max(200),
  fileUrl: z.string().url().optional(),
})

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const department = searchParams.get("department")
  const year = searchParams.get("year")
  const section = searchParams.get("section")
  const subject = searchParams.get("subject")

  const where: Record<string, unknown> = { status: "approved" }
  if (department) {
    const dept = await prisma.department.findUnique({ where: { slug: department } })
    if (dept) where.departmentId = dept.id
  }
  if (year) where.year = parseInt(year, 10)
  if (section) where.section = section.toLowerCase()
  if (subject) where.subjectSlug = subject

  const notes = await prisma.note.findMany({
    where,
    include: {
      department: { select: { slug: true } },
      contributor: { select: { id: true, firstName: true, lastName: true } },
      approver: { select: { firstName: true, lastName: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  })

  const list = notes.map((n) => ({
    id: n.id,
    title: n.title,
    description: n.description,
    subject: n.subject,
    subjectSlug: n.subjectSlug,
    department: n.department.slug,
    year: n.year,
    section: n.section,
    contributor: n.contributor ? `${n.contributor.firstName} ${n.contributor.lastName}` : null,
    host: n.approver ? `${n.approver.firstName} ${n.approver.lastName}` : null,
    downloads: n.downloadCount,
    rating: n.averageRating ?? 0,
    reviews: n.reviewCount,
    uploadedAt: n.createdAt,
  }))

  return NextResponse.json(list)
}

export async function POST(request: NextRequest) {
  const user = await requireAuth()
  if (user.role !== "student" && user.role !== "host" && user.role !== "admin") {
    return NextResponse.json({ error: "Only students and hosts can submit notes" }, { status: 403 })
  }

  try {
    const body = await request.json()
    const data = createNoteSchema.parse(body)
    const deptSlug = data.department

    const dept = await prisma.department.findUnique({ where: { slug: deptSlug } })
    if (!dept) {
      return NextResponse.json({ error: "Invalid department" }, { status: 400 })
    }

    const subjectSlug = data.subject.toLowerCase().replace(/\s+/g, "-")

    const note = await prisma.note.create({
      data: {
        title: data.title,
        description: data.description,
        fileUrl: data.fileUrl ?? null,
        departmentId: dept.id,
        year: data.year,
        section: data.section.toLowerCase(),
        subject: data.subject,
        subjectSlug,
        contributorId: user.id,
        status: "pending",
      },
      include: {
        contributor: { select: { firstName: true, lastName: true } },
      },
    })

    return NextResponse.json({
      id: note.id,
      title: note.title,
      status: note.status,
      createdAt: note.createdAt,
    })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors.map((e) => e.message).join(", ") }, { status: 400 })
    }
    console.error(err)
    return NextResponse.json({ error: "Failed to create note" }, { status: 500 })
  }
}
