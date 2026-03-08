import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { NotesList } from "@/components/browse/notes-list"
import { ChevronRight } from "lucide-react"

const departmentNames: Record<string, string> = {
  bca: "BCA",
  bba: "BBA",
  btech: "BTech",
  ba: "BA",
}

const yearNames: Record<string, string> = {
  "1": "1st Year",
  "2": "2nd Year",
  "3": "3rd Year",
  "4": "4th Year",
}

const subjectNames: Record<string, string> = {
  "data-structures": "Data Structures",
  "database-management": "Database Management",
  "web-development": "Web Development",
  "computer-networks": "Computer Networks",
  "operating-systems": "Operating Systems",
  "software-engineering": "Software Engineering",
}

export default async function SubjectPage({ params }: { params: Promise<{ department: string; year: string; section: string; subject: string }> }) {
  const { department, year, section, subject } = await params

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-background">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm">
            <Link href="/browse" className="text-muted-foreground hover:text-primary transition-colors">
              Browse
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <Link href={`/browse/${department}`} className="text-muted-foreground hover:text-primary transition-colors">
              {departmentNames[department] || department.toUpperCase()}
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <Link href={`/browse/${department}/${year}/${section}`} className="text-muted-foreground hover:text-primary transition-colors">
              {yearNames[year]} - Section {section.toUpperCase()}
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium text-foreground">
              {subjectNames[subject] || subject}
            </span>
          </nav>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">
              {subjectNames[subject] || subject}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {departmentNames[department]} - {yearNames[year]} - Section {section.toUpperCase()}
            </p>
          </div>

          <NotesList subject={subject} department={department} year={year} section={section} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
