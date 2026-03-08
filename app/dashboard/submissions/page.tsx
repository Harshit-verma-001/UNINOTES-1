"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Upload, CheckCircle, Clock, XCircle } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { api, type Submission } from "@/lib/api"
import { formatDistanceToNow } from "date-fns"

export default function SubmissionsPage() {
  const { user, loading: authLoading } = useAuth()
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      window.location.href = "/login"
      return
    }
    if (!user) return
    api.dashboard.submissions().then(setSubmissions).catch(() => []).finally(() => setLoading(false))
  }, [user, authLoading])

  if (authLoading || !user) return <div className="p-8">Loading...</div>

  function getStatusBadge(status: string, reason: string | null) {
    switch (status) {
      case "approved":
        return (
          <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">
            <CheckCircle className="mr-1 h-3 w-3" /> Approved
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">
            <Clock className="mr-1 h-3 w-3" /> Pending
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="border-rose-200 bg-rose-50 text-rose-700">
            <XCircle className="mr-1 h-3 w-3" /> Rejected
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Submissions</h1>
        <p className="mt-2 text-muted-foreground">Track the status of your submitted notes.</p>
      </div>
      <Card>
        <CardHeader>
          <Button asChild>
            <Link href="/dashboard/submit">Submit New Notes</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : submissions.length === 0 ? (
            <p className="text-muted-foreground">No submissions yet. Submit your first notes!</p>
          ) : (
            <div className="space-y-4">
              {submissions.map((s) => (
                <div
                  key={s.id}
                  className="flex flex-col gap-2 rounded-lg border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Upload className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{s.title}</p>
                      <p className="text-sm text-muted-foreground">
                        Submitted {formatDistanceToNow(new Date(s.submittedAt), { addSuffix: true })}
                      </p>
                      {s.rejectionReason && (
                        <p className="mt-1 text-sm text-destructive">Reason: {s.rejectionReason}</p>
                      )}
                    </div>
                  </div>
                  {getStatusBadge(s.status, s.rejectionReason)}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
