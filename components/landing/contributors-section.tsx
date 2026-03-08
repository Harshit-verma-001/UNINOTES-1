import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Trophy, Medal, Award, ArrowRight, FileText, Download } from "lucide-react"

const topContributors = [
  {
    id: "1",
    name: "Rahul Sharma",
    department: "BCA",
    notesCount: 45,
    downloads: 12500,
    rank: 1,
  },
  {
    id: "2",
    name: "Priya Singh",
    department: "BBA",
    notesCount: 38,
    downloads: 9800,
    rank: 2,
  },
  {
    id: "3",
    name: "Amit Kumar",
    department: "BTech",
    notesCount: 35,
    downloads: 8900,
    rank: 3,
  },
  {
    id: "4",
    name: "Sneha Patel",
    department: "BCA",
    notesCount: 32,
    downloads: 7600,
    rank: 4,
  },
  {
    id: "5",
    name: "Vikram Joshi",
    department: "BBA",
    notesCount: 28,
    downloads: 6500,
    rank: 5,
  },
]

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Trophy className="h-5 w-5 text-amber-500" />
    case 2:
      return <Medal className="h-5 w-5 text-slate-400" />
    case 3:
      return <Award className="h-5 w-5 text-amber-700" />
    default:
      return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>
  }
}

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}

export function ContributorsSection() {
  return (
    <section className="bg-card py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Top Contributors
            </h2>
            <p className="mt-2 text-lg text-muted-foreground">
              Students making a difference by sharing knowledge
            </p>
          </div>
          <Button variant="outline" asChild className="hidden sm:flex">
            <Link href="/leaderboard">
              View Leaderboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {topContributors.map((contributor) => (
            <Card
              key={contributor.id}
              className={`transition-all duration-300 hover:shadow-lg ${
                contributor.rank === 1
                  ? "border-amber-200 bg-gradient-to-br from-amber-50 to-transparent"
                  : "hover:border-primary/30"
              }`}
            >
              <CardContent className="p-6 text-center">
                <div className="flex justify-center">
                  {getRankIcon(contributor.rank)}
                </div>

                <Avatar className="mx-auto mt-4 h-16 w-16 border-2 border-border">
                  <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                    {getInitials(contributor.name)}
                  </AvatarFallback>
                </Avatar>

                <h3 className="mt-4 font-semibold text-foreground">
                  {contributor.name}
                </h3>
                <p className="text-sm text-muted-foreground">{contributor.department}</p>

                <div className="mt-4 flex items-center justify-center gap-4 text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    <span>{contributor.notesCount}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Download className="h-4 w-4" />
                    <span>{(contributor.downloads / 1000).toFixed(1)}k</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Button variant="outline" asChild>
            <Link href="/leaderboard">
              View Leaderboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
