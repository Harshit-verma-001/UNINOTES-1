"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { BookOpen, FileText, CheckCircle, XCircle, Clock, Eye, Download, Users, TrendingUp, Menu, LogOut } from "lucide-react"

const pendingSubmissions = [
  {
    id: "1",
    title: "Operating Systems - Process Scheduling",
    subject: "Operating Systems",
    contributor: "Sneha Patel",
    submittedAt: "2 hours ago",
    fileSize: "2.4 MB",
  },
  {
    id: "2",
    title: "Computer Networks - TCP/IP Protocol",
    subject: "Computer Networks",
    contributor: "Vikram Joshi",
    submittedAt: "5 hours ago",
    fileSize: "1.8 MB",
  },
  {
    id: "3",
    title: "Database Design - ER Diagrams",
    subject: "DBMS",
    contributor: "Neha Gupta",
    submittedAt: "1 day ago",
    fileSize: "3.2 MB",
  },
  {
    id: "4",
    title: "Web Development - React Hooks",
    subject: "Web Development",
    contributor: "Arjun Reddy",
    submittedAt: "1 day ago",
    fileSize: "1.5 MB",
  },
]

const recentActions = [
  { id: "1", title: "Data Structures - Graphs", action: "approved", date: "Yesterday" },
  { id: "2", title: "Algorithm Analysis", action: "approved", date: "2 days ago" },
  { id: "3", title: "Java Basics", action: "rejected", date: "2 days ago" },
  { id: "4", title: "OOP Concepts", action: "approved", date: "3 days ago" },
]

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}

export default function HostDashboardPage() {
  const [selectedSubmission, setSelectedSubmission] = useState<typeof pendingSubmissions[0] | null>(null)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [submissions, setSubmissions] = useState(pendingSubmissions)

  const handleApprove = (id: string) => {
    setSubmissions(submissions.filter((s) => s.id !== id))
    setSelectedSubmission(null)
  }

  const handleReject = (id: string) => {
    setSubmissions(submissions.filter((s) => s.id !== id))
    setRejectDialogOpen(false)
    setSelectedSubmission(null)
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="hidden w-72 border-r border-border bg-card lg:block">
        <div className="flex h-16 items-center gap-2 border-b border-border px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <BookOpen className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">UNINOTES</span>
        </div>
        <nav className="p-4 space-y-1">
          <Link
            href="/host"
            className="flex items-center gap-3 rounded-lg bg-accent px-4 py-3 text-sm font-medium text-primary"
          >
            <FileText className="h-5 w-5" />
            Review Submissions
          </Link>
          <Link
            href="/host/approved"
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-accent transition-colors"
          >
            <CheckCircle className="h-5 w-5" />
            Approved Notes
          </Link>
          <Link
            href="/host/rejected"
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-accent transition-colors"
          >
            <XCircle className="h-5 w-5" />
            Rejected Notes
          </Link>
        </nav>
        <div className="absolute bottom-0 w-72 border-t border-border p-4">
          <div className="flex items-center gap-3 rounded-lg bg-accent p-3">
            <Avatar className="h-10 w-10 border border-border">
              <AvatarFallback className="bg-primary text-primary-foreground">AK</AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium text-foreground">Prof. Amit Kumar</p>
              <p className="truncate text-xs text-muted-foreground">BCA - Section A Host</p>
            </div>
            <Button variant="ghost" size="icon" className="shrink-0">
              <LogOut className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        {/* Mobile Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-card px-4 lg:hidden">
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
          <span className="text-lg font-semibold">Host Dashboard</span>
        </header>

        <main className="p-4 lg:p-8">
          <div className="space-y-8">
            {/* Welcome */}
            <div>
              <h1 className="text-3xl font-bold text-foreground">Host Dashboard</h1>
              <p className="mt-2 text-muted-foreground">
                Review and manage note submissions for BCA - Section A
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10">
                      <Clock className="h-6 w-6 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{submissions.length}</p>
                      <p className="text-sm text-muted-foreground">Pending</p>
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
                      <p className="text-2xl font-bold text-foreground">156</p>
                      <p className="text-sm text-muted-foreground">Approved</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">48</p>
                      <p className="text-sm text-muted-foreground">Contributors</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/10">
                      <TrendingUp className="h-6 w-6 text-rose-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">24.5k</p>
                      <p className="text-sm text-muted-foreground">Downloads</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Pending Submissions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-amber-600" />
                  Pending Submissions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {submissions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <CheckCircle className="h-12 w-12 text-emerald-500" />
                    <h3 className="mt-4 text-lg font-semibold text-foreground">All caught up!</h3>
                    <p className="mt-2 text-muted-foreground">No pending submissions to review.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {submissions.map((submission) => (
                      <div
                        key={submission.id}
                        className="flex flex-col gap-4 rounded-lg border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                            <FileText className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">{submission.title}</h3>
                            <p className="text-sm text-muted-foreground">{submission.subject}</p>
                            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Avatar className="h-4 w-4">
                                  <AvatarFallback className="text-[8px]">
                                    {getInitials(submission.contributor)}
                                  </AvatarFallback>
                                </Avatar>
                                {submission.contributor}
                              </span>
                              <span>{submission.submittedAt}</span>
                              <span>{submission.fileSize}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 sm:shrink-0">
                          <Button variant="outline" size="sm" onClick={() => setSelectedSubmission(submission)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Preview
                          </Button>
                          <Button
                            size="sm"
                            className="bg-emerald-600 hover:bg-emerald-700"
                            onClick={() => handleApprove(submission.id)}
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Approve
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              setSelectedSubmission(submission)
                              setRejectDialogOpen(true)
                            }}
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActions.map((action) => (
                    <div key={action.id} className="flex items-center justify-between rounded-lg border border-border p-4">
                      <div className="flex items-center gap-4">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                          action.action === "approved" ? "bg-emerald-500/10" : "bg-rose-500/10"
                        }`}>
                          {action.action === "approved" ? (
                            <CheckCircle className="h-5 w-5 text-emerald-600" />
                          ) : (
                            <XCircle className="h-5 w-5 text-rose-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{action.title}</p>
                          <p className="text-sm text-muted-foreground">{action.date}</p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          action.action === "approved"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-rose-200 bg-rose-50 text-rose-700"
                        }
                      >
                        {action.action === "approved" ? "Approved" : "Rejected"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Preview Dialog */}
      <Dialog open={!!selectedSubmission && !rejectDialogOpen} onOpenChange={() => setSelectedSubmission(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedSubmission?.title}</DialogTitle>
            <DialogDescription>
              Submitted by {selectedSubmission?.contributor} • {selectedSubmission?.submittedAt}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50 p-12">
              <div className="text-center">
                <FileText className="mx-auto h-16 w-16 text-muted-foreground" />
                <p className="mt-4 text-sm text-muted-foreground">Document Preview</p>
                <Button variant="outline" className="mt-4">
                  <Download className="mr-2 h-4 w-4" />
                  Download to Review
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedSubmission(null)}>
              Close
            </Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={() => handleApprove(selectedSubmission!.id)}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Approve
            </Button>
            <Button variant="destructive" onClick={() => setRejectDialogOpen(true)}>
              <XCircle className="mr-2 h-4 w-4" />
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Submission</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this submission. The contributor will be notified.
            </DialogDescription>
          </DialogHeader>
          <Textarea placeholder="Reason for rejection..." className="min-h-[100px]" />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => handleReject(selectedSubmission!.id)}>
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
