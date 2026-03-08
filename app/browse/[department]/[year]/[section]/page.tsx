import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight, BookOpen, FileText } from "lucide-react"

const subjects = [
  { id: "data-structures", name: "Data Structures", notesCount: 24 },
  { id: "database-management", name: "Database Management", notesCount: 18 },
  { id: "web-development", name: "Web Development", notesCount: 32 },
  { id: "computer-networks", name: "Computer Networks", notesCount: 15 },
  { id: "operating-systems", name: "Operating Systems", notesCount: 21 },
  { id: "software-engineering", name: "Software Engineering", notesCount: 12 },
]

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

export default async function SectionPage({ params }: { params: Promise<{ department: string; year: string; section: string }> }) {
  const { department, year, section } = await params

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
            <span className="font-medium text-foreground">
              {yearNames[year]} - Section {section.toUpperCase()}
            </span>
          </nav>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">
              {departmentNames[department]} - {yearNames[year]} - Section {section.toUpperCase()}
            </h1>
            <p className="mt-2 text-muted-foreground">
              Select a subject to view available notes
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {subjects.map((subject) => (
              <Link key={subject.id} href={`/browse/${department}/${year}/${section}/${subject.id}`}>
                <Card className="group h-full transition-all duration-300 hover:shadow-lg hover:border-primary/30">
                  <CardContent className="p-6">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                      <BookOpen className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                      {subject.name}
                    </h3>
                    <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      <span>{subject.notesCount} notes available</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
