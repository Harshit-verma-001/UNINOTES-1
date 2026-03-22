import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

const createNoteSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  department: z.string().min(1, { message: "Please select a department." }),
  year: z.number({ invalid_type_error: "Please select a year." }),
  section: z.string().min(1, { message: "Please select a section." }),
  subject: z.string().min(1, { message: "Subject is required." }),
  fileUrl: z.string().url({ message: "Please provide a valid URL." }).optional().or(z.literal("")).or(z.null()),
})

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const department = searchParams.get("department")
    const year = searchParams.get("year")
    const section = searchParams.get("section")
    const subject = searchParams.get("subject")

    const where: any = { status: "approved" }

    if (department) {
      const dept = await prisma.department.findUnique({ where: { slug: department } })
      if (dept) where.departmentId = dept.id
    }
    if (year) where.year = parseInt(year)
    if (section) where.section = section
    if (subject) where.subject = subject

    const notes = await prisma.note.findMany({
      where,
      include: {
        contributor: { select: { firstName: true, lastName: true } },
        approvedBy: { select: { firstName: true, lastName: true } },
        department: { select: { slug: true } }
      },
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json(notes.map(note => ({
      id: note.id,
      title: note.title,
      description: note.description,
      subject: note.subject,
      subjectSlug: note.subjectSlug,
      department: note.department.slug,
      year: note.year,
      section: note.section,
      contributor: note.contributor ? `${note.contributor.firstName} ${note.contributor.lastName}` : null,
      host: note.approvedBy ? `${note.approvedBy.firstName} ${note.approvedBy.lastName}` : null,
      downloads: note.downloadCount,
      rating: note.averageRating,
      reviews: note.reviewCount,
      uploadedAt: note.createdAt.toISOString()
    })))
  } catch (error) {
    console.error("Notes GET error:", error)
    return NextResponse.json({ error: "Failed to fetch notes" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    let user = await getCurrentUser()

    // DEV FALLBACK: If the browser is still being stubborn with cookies, 
    // automatically assign the submission to the student test account so you can continue testing!
    if (!user && process.env.NODE_ENV !== "production") {
      user = await prisma.user.findFirst({ where: { email: "student@uninotes.edu" } })
    }

    if (!user) {
      return NextResponse.json({ error: "Session expired. Please clear your cookies and log in again!" }, { status: 401 })
    }
    if (user.role !== "student" && user.role !== "host" && user.role !== "admin") {
      return NextResponse.json({ error: "Only students and hosts can submit notes" }, { status: 403 })
    }

    const body = await request.json()
    const data = createNoteSchema.parse(body)
     
    const department = await prisma.department.findUnique({
      where: { slug: data.department },
    })

    if (!department) {
      return NextResponse.json({ error: "Invalid department" }, { status: 400 })
    }

    const note = await prisma.note.create({
      data: {
        title: data.title,
        description: data.description,
        departmentId: department.id,
        year: data.year,
        section: data.section,
        subject: data.subject,
        subjectSlug: data.subject.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        fileUrl: data.fileUrl || null,
        contributorId: user.id,
        status: user.role === "admin" ? "approved" : "pending",
        approvedById: user.role === "admin" ? user.id : null,
      },
    })

    return NextResponse.json({ id: note.id, title: note.title, status: note.status, createdAt: note.createdAt }, { status: 201 })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors.map((e) => e.message).join(", ") }, { status: 400 })
    }
    console.error("Note creation error:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
