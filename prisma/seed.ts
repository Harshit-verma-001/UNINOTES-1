import "dotenv/config"
import { prisma } from "../lib/db"
import bcrypt from "bcryptjs"

async function main() {
  const depts = [
    { slug: "bca", name: "BCA", fullName: "Bachelor of Computer Applications", description: "Computer science fundamentals, programming, and software development" },
    { slug: "bba", name: "BBA", fullName: "Bachelor of Business Administration", description: "Business management, marketing, finance, and entrepreneurship" },
    { slug: "btech", name: "BTech", fullName: "Bachelor of Technology", description: "Engineering principles, technical skills, and innovation" },
    { slug: "ba", name: "BA", fullName: "Bachelor of Arts", description: "Humanities, social sciences, languages, and liberal arts" },
  ]

  for (const d of depts) {
    await prisma.department.upsert({
      where: { slug: d.slug },
      create: d,
      update: d,
    })
  }

  const bca = await prisma.department.findUniqueOrThrow({ where: { slug: "bca" } })
  const hash = await bcrypt.hash("password123", 12)

  const admin = await prisma.user.upsert({
    where: { email: "admin@uninotes.edu" },
    create: {
      email: "admin@uninotes.edu",
      passwordHash: hash,
      firstName: "Admin",
      lastName: "User",
      role: "admin",
    },
    update: {},
  })

  const host = await prisma.user.upsert({
    where: { email: "host@uninotes.edu" },
    create: {
      email: "host@uninotes.edu",
      passwordHash: hash,
      firstName: "Prof. Amit",
      lastName: "Kumar",
      role: "host",
      departmentId: bca.id,
    },
    update: {},
  })

  const student = await prisma.user.upsert({
    where: { email: "student@uninotes.edu" },
    create: {
      email: "student@uninotes.edu",
      passwordHash: hash,
      firstName: "Rahul",
      lastName: "Sharma",
      role: "student",
      departmentId: bca.id,
      year: 2,
      section: "a",
    },
    update: {},
  })

  const existingNote = await prisma.note.findFirst({
    where: {
      contributorId: student.id,
      subjectSlug: "data-structures",
      section: "a",
      year: 2,
    },
  })

  const note =
    existingNote ??
    (await prisma.note.create({
      data: {
        title: "Complete Data Structures Notes - Arrays, Linked Lists, Trees",
        description: "These comprehensive notes cover all major data structures topics including arrays, linked lists, stacks, queues, trees, and graphs.",
        departmentId: bca.id,
        year: 2,
        section: "a",
        subject: "Data Structures",
        subjectSlug: "data-structures",
        contributorId: student.id,
        status: "approved",
        approvedById: host.id,
        downloadCount: 1250,
        averageRating: 4.8,
        reviewCount: 156,
      },
    }))

  const existingComments = await prisma.comment.count({ where: { noteId: note.id } })
  if (existingComments === 0) {
    await prisma.comment.createMany({
      data: [
        { noteId: note.id, userId: student.id, content: "These notes are incredibly detailed. The diagrams really helped me understand tree traversals.", likes: 24 },
        { noteId: note.id, userId: host.id, content: "Great work! The practice problems at the end of each chapter are very helpful.", likes: 18 },
      ],
    })
  }

  console.log("Seed complete. Created departments, admin@uninotes.edu, host@uninotes.edu, student@uninotes.edu (password: password123), and sample note.")
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e)
    prisma.$disconnect()
    process.exit(1)
  })
