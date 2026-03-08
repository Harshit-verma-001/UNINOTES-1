"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, Upload, ListChecks, FileText, Download, Star, Clock, CheckCircle, XCircle, Trophy } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { api, type DashboardStats, type Submission } from "@/lib/api"
import { formatDistanceToNow } from "date-fns"

const quickActions = [
  { title: "Browse Notes", description: "Find study materials for your courses", icon: Search, href: "/browse", color: "bg-blue-500/10 text-blue-600" },
  { title: "Submit Notes", description: "Share your notes with classmates", icon: Upload, href: "/dashboard/submit", color: "bg-emerald-500/10 text-emerald-600" },
  { title: "My Submissions", description: "Track status of notes you submitted", icon: ListChecks, href: "/dashboard/submissions", color: "bg-amber-500/10 text-amber-600" },
]

function getStatusBadge(status: string) {
  switch (status) {
    case "approved":
      return (
        <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">
          <CheckCircle className="mr-1 h-3 w-3" />
          Approved
        </Badge>
      )
    case "pending":
      return (
        <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">
          <Clock className="mr-1 h-3 w-3" />
          Pending
        </Badge>
      )
    case "rejected":
      return (
        <Badge variant="outline" className="border-rose-200 bg-rose-50 text-rose-700">
          <XCircle className="mr-1 h-3 w-3" />
          Rejected
        </Badge>
      )
    default:
      return null
  }
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [recentDownloads, setRecentDownloads] = useState<{ id: string; title: string; subject: string; downloadedAt: string }[]>([])
  const [leaderboard, setLeaderboard] = useState<{ name: string; notesCount: number; rank: number }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login")
      return
    }
    if (!user) return

    async function fetchData() {
      try {
        const [statsRes, submissionsRes, recentRes, leaderRes] = await Promise.all([
          api.dashboard.stats(),
          api.dashboard.submissions(),
          api.dashboard.recentDownloads(),
          api.leaderboard(),
        ])
        setStats(statsRes)
        setSubmissions(submissionsRes)
        setRecentDownloads(recentRes)
        setLeaderboard(leaderRes.slice(0, 10).map((c) => ({ name: c.name, notesCount: c.notesCount, rank: c.rank })))
      } catch {
        setStats({ notesSubmitted: 0, notesApproved: 0, totalDownloads: 0, avgRating: 0 })
        setSubmissions([])
        setRecentDownloads([])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [user, authLoading, router])

  if (authLoading || !user) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  const displayName = `${user.firstName} ${user.lastName}`
  const topContributors = leaderboard.map((c) => ({
    ...c,
    name: c.name === displayName ? "You" : c.name,
  }))

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Welcome back, {user.firstName}!</h1>
        <p className="mt-2 text-muted-foreground">
          Here&apos;s what&apos;s happening with your notes today.
        </p>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading dashboard...</p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stats?.notesSubmitted ?? 0}</p>
                    <p className="text-sm text-muted-foreground">Notes Submitted</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">
                    <CheckCircle className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stats?.notesApproved ?? 0}</p>
                    <p className="text-sm text-muted-foreground">Approved</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10">
                    <Download className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{(stats?.totalDownloads ?? 0).toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Total Downloads</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/10">
                    <Star className="h-6 w-6 text-rose-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stats?.avgRating ?? 0}</p>
                    <p className="text-sm text-muted-foreground">Avg Rating</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <h2 className="mb-4 text-xl font-semibold text-foreground">Quick Actions</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {quickActions.map((action) => (
                <Link key={action.href} href={action.href}>
                  <Card className="h-full transition-all duration-300 hover:shadow-lg hover:border-primary/30">
                    <CardContent className="p-6">
                      <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${action.color}`}>
                        <action.icon className="h-6 w-6" />
                      </div>
                      <h3 className="mt-4 font-semibold text-foreground">{action.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{action.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Recent Downloads</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/browse">View All</Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentDownloads.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No downloads yet. Browse notes to get started.</p>
                  ) : (
                    recentDownloads.map((note) => (
                      <div key={note.id} className="flex items-center gap-4 rounded-lg border border-border p-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <Link href={`/notes/${note.id}`} className="font-medium text-foreground hover:text-primary">
                            {note.title}
                          </Link>
                          <p className="text-sm text-muted-foreground">{note.subject}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(note.downloadedAt), { addSuffix: true })}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Top Contributors</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/leaderboard">View All</Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topContributors.map((contributor) => (
                    <div
                      key={contributor.name + contributor.rank}
                      className={`flex items-center gap-3 rounded-lg p-3 ${
                        contributor.name === "You" ? "bg-primary/5 border border-primary/20" : ""
                      }`}
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-bold">
                        {contributor.rank <= 3 ? (
                          <Trophy className={`h-4 w-4 ${
                            contributor.rank === 1 ? "text-amber-500" :
                            contributor.rank === 2 ? "text-slate-400" : "text-amber-700"
                          }`} />
                        ) : (
                          contributor.rank
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{contributor.name}</p>
                        <p className="text-xs text-muted-foreground">{contributor.notesCount} notes</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">My Submissions</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/submissions">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {submissions.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No submissions yet. Submit your first notes!</p>
                ) : (
                  submissions.slice(0, 5).map((submission) => (
                    <div key={submission.id} className="flex flex-col gap-2 rounded-lg border border-border p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <Upload className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{submission.title}</p>
                          <p className="text-sm text-muted-foreground">
                            Submitted {formatDistanceToNow(new Date(submission.submittedAt), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(submission.status)}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
