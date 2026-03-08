import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/db"
import { verifyPassword, createToken, setAuthCookie } from "@/lib/auth"

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = loginSchema.parse(body)

    const user = await prisma.user.findUnique({
      where: { email },
      include: { department: true },
    })
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const valid = await verifyPassword(password, user.passwordHash)
    if (!valid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

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
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
