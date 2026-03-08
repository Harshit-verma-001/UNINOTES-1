import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/db"
import { hashPassword, createToken, setAuthCookie } from "@/lib/auth"

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  department: z.string().optional(),
  year: z.number().min(1).max(4).optional(),
  section: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = registerSchema.parse(body)

    const existing = await prisma.user.findUnique({ where: { email: data.email } })
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 400 }
      )
    }

    const passwordHash = await hashPassword(data.password)
    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        role: "student",
        departmentId: data.department ? await resolveDepartmentId(data.department) : null,
        year: data.year ?? null,
        section: data.section ?? null,
      },
      include: { department: true },
    })

    const token = await createToken({
      sub: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    })
    await setAuthCookie(token)

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        department: user.department ? { id: user.department.id, slug: user.department.slug, name: user.department.name } : null,
        year: user.year,
        section: user.section,
      },
    })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: err.errors.map((e) => e.message).join(", ") },
        { status: 400 }
      )
    }
    console.error(err)
    return NextResponse.json({ error: "Registration failed" }, { status: 500 })
  }
}

async function resolveDepartmentId(slug: string): Promise<string | null> {
  const dept = await prisma.department.findUnique({ where: { slug } })
  return dept?.id ?? null
}
