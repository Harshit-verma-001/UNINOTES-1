import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Star, FileText, ArrowRight } from "lucide-react"

const topNotes = [
  {
    id: "1",
    title: "Data Structures Complete Guide",
    subject: "Data Structures",
    department: "BCA",
    contributor: "Rahul Sharma",
    downloads: 1250,
    rating: 4.8,
  },
  {
    id: "2",
    title: "Marketing Management Notes",
    subject: "Marketing",
    department: "BBA",
    contributor: "Priya Singh",
    downloads: 980,
    rating: 4.7,
  },
  {
    id: "3",
    title: "Digital Electronics Fundamentals",
    subject: "Electronics",
    department: "BTech",
    contributor: "Amit Kumar",
    downloads: 1100,
    rating: 4.9,
  },
  {
    id: "4",
    title: "Database Management Systems",
    subject: "DBMS",
    department: "BCA",
    contributor: "Sneha Patel",
    downloads: 890,
    rating: 4.6,
  },
  {
    id: "5",
    title: "Financial Accounting Basics",
    subject: "Accounting",
    department: "BBA",
    contributor: "Vikram Joshi",
    downloads: 750,
    rating: 4.5,
  },
  {
    id: "6",
    title: "Object Oriented Programming",
    subject: "OOP",
    department: "BTech",
    contributor: "Neha Gupta",
    downloads: 1050,
    rating: 4.8,
  },
]

export function TopNotesSection() {
  return (
    <section className="bg-background py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Top Notes This Week
            </h2>
            <p className="mt-2 text-lg text-muted-foreground">
              Most downloaded and highest rated notes
            </p>
          </div>
          <Button variant="outline" asChild className="hidden sm:flex">
            <Link href="/browse">
              View All Notes
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {topNotes.map((note) => (
            <Link key={note.id} href={`/notes/${note.id}`}>
              <Card className="group h-full transition-all duration-300 hover:shadow-lg hover:border-primary/30">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <Badge variant="secondary">{note.department}</Badge>
                  </div>

                  <h3 className="mt-4 text-lg font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                    {note.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {note.subject}
                  </p>

                  <p className="mt-3 text-sm text-muted-foreground">
                    by <span className="font-medium text-foreground">{note.contributor}</span>
                  </p>

                  <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Download className="h-4 w-4" />
                      <span>{note.downloads.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span className="font-medium text-foreground">{note.rating}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Button variant="outline" asChild>
            <Link href="/browse">
              View All Notes
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
