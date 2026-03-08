import Link from "next/link"
import { notFound } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronRight, Users, FileText } from "lucide-react"

const departmentData: Record<string, { name: string; fullName: string; years: { id: string; name: string; sections: string[] }[] }> = {
  bca: {
    name: "BCA",
    fullName: "Bachelor of Computer Applications",
    years: [
      { id: "1", name: "1st Year", sections: ["A", "B", "C"] },
      { id: "2", name: "2nd Year", sections: ["A", "B", "C"] },
      { id: "3", name: "3rd Year", sections: ["A", "B"] },
    ],
  },
  bba: {
    name: "BBA",
    fullName: "Bachelor of Business Administration",
    years: [
      { id: "1", name: "1st Year", sections: ["A", "B"] },
      { id: "2", name: "2nd Year", sections: ["A", "B"] },
      { id: "3", name: "3rd Year", sections: ["A", "B"] },
    ],
  },
  btech: {
    name: "BTech",
    fullName: "Bachelor of Technology",
    years: [
      { id: "1", name: "1st Year", sections: ["A", "B", "C", "D"] },
      { id: "2", name: "2nd Year", sections: ["A", "B", "C", "D"] },
      { id: "3", name: "3rd Year", sections: ["A", "B", "C"] },
      { id: "4", name: "4th Year", sections: ["A", "B"] },
    ],
  },
  ba: {
    name: "BA",
    fullName: "Bachelor of Arts",
    years: [
      { id: "1", name: "1st Year", sections: ["A", "B"] },
      { id: "2", name: "2nd Year", sections: ["A", "B"] },
      { id: "3", name: "3rd Year", sections: ["A"] },
    ],
  },
}

export default async function DepartmentPage({ params }: { params: Promise<{ department: string }> }) {
  const { department } = await params
  const data = departmentData[department]

  if (!data) {
    notFound()
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-background">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-2 text-sm">
            <Link href="/browse" className="text-muted-foreground hover:text-primary transition-colors">
              Browse
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium text-foreground">{data.name}</span>
          </nav>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">{data.name}</h1>
            <p className="mt-2 text-muted-foreground">{data.fullName}</p>
          </div>

          <div className="space-y-8">
            {data.years.map((year) => (
              <div key={year.id}>
                <h2 className="mb-4 text-xl font-semibold text-foreground">{year.name}</h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                  {year.sections.map((section) => (
                    <Link key={section} href={`/browse/${department}/${year.id}/${section.toLowerCase()}`}>
                      <Card className="group transition-all duration-300 hover:shadow-lg hover:border-primary/30">
                        <CardContent className="p-6 text-center">
                          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                            <span className="text-xl font-bold text-primary">{section}</span>
                          </div>
                          <p className="mt-3 text-sm font-medium text-foreground">
                            Section {section}
                          </p>
                          <div className="mt-2 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                            <FileText className="h-3 w-3" />
                            <span>{Math.floor(Math.random() * 50 + 20)} notes</span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
