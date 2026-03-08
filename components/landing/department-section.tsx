import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { GraduationCap, Briefcase, Cpu, BookText, ArrowRight } from "lucide-react"

const departments = [
  {
    id: "bca",
    name: "BCA",
    fullName: "Bachelor of Computer Applications",
    icon: Cpu,
    notesCount: 1250,
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    id: "bba",
    name: "BBA",
    fullName: "Bachelor of Business Administration",
    icon: Briefcase,
    notesCount: 980,
    color: "bg-emerald-500/10 text-emerald-600",
  },
  {
    id: "btech",
    name: "BTech",
    fullName: "Bachelor of Technology",
    icon: GraduationCap,
    notesCount: 1520,
    color: "bg-amber-500/10 text-amber-600",
  },
  {
    id: "ba",
    name: "BA",
    fullName: "Bachelor of Arts",
    icon: BookText,
    notesCount: 750,
    color: "bg-rose-500/10 text-rose-600",
  },
]

export function DepartmentSection() {
  return (
    <section className="bg-card py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            Browse by Department
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Find notes organized by your department and course
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {departments.map((dept) => (
            <Link key={dept.id} href={`/browse/${dept.id}`}>
              <Card className="group h-full transition-all duration-300 hover:shadow-lg hover:border-primary/30">
                <CardContent className="p-6">
                  <div className={`inline-flex h-14 w-14 items-center justify-center rounded-xl ${dept.color}`}>
                    <dept.icon className="h-7 w-7" />
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-foreground">
                    {dept.name}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {dept.fullName}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {dept.notesCount.toLocaleString()} notes
                    </span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
