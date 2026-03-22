"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { api } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CheckCircle, XCircle, Clock, FileText, User, Building, Download } from "lucide-react"
import { format } from "date-fns"

// Define a more detailed type for the pending notes
type PendingNote = {
  id: string
  title: string
  description: string
  subject: string
  fileUrl: string | null
  createdAt: string
  contributor: {
    firstName: string
    lastName: string
  }
  department: {
    name: string
  }
}

export default function HostDashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [pendingNotes, setPendingNotes] = useState<PendingNote[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [rejectionReason, setRejectionReason] = useState("")

  useEffect(() => {
    if (!authLoading && (!user || (user.role !== "host" && user.role !== "admin"))) {
      router.replace("/login")
      return
    }
    if (user) {
      fetchPendingNotes()
    }
  }, [user, authLoading, router])

  const fetchPendingNotes = async () => {
    setLoading(true)
    try {
      const notes = await api.host.pendingNotes()
      setPendingNotes(notes)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load notes.")
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (noteId: string) => {
    try {
      await api.notes.approve(noteId)
      setPendingNotes((prev) => prev.filter((note) => note.id !== noteId))
    } catch (err) {
      alert("Failed to approve note: " + (err instanceof Error ? err.message : "Unknown error"))
    }
  }

  const handleReject = async (noteId: string) => {
    if (rejectionReason.trim().length < 5) {
      alert("Please provide a clear rejection reason (at least 5 characters).")
      return
    }
    try {
      await api.notes.reject(noteId, { reason: rejectionReason })
      setPendingNotes((prev) => prev.filter((note) => note.id !== noteId))
      setRejectionReason("") // Clear for next use
      document.getElementById(`close-reject-dialog-${noteId}`)?.click()
    } catch (err) {
      alert("Failed to reject note: " + (err instanceof Error ? err.message : "Unknown error"))
    }
  }

  if (authLoading || !user) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Host Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Review and approve notes submitted by students in your department.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Submissions</CardTitle>
          <CardDescription>
            {loading
              ? "Loading submissions..."
              : `You have ${pendingNotes.length} submission(s) to review.`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && <p className="text-destructive">{error}</p>}
          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-24 rounded-lg bg-muted animate-pulse" />
              ))}
            </div>
          ) : pendingNotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CheckCircle className="h-12 w-12 text-emerald-500" />
              <h3 className="mt-4 text-lg font-semibold">All Caught Up!</h3>
              <p className="text-muted-foreground">There are no pending submissions to review.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {pendingNotes.map((note) => (
                <div key={note.id} className="rounded-lg border p-4 sm:p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{note.title}</h3>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5"><User className="h-4 w-4" /> {note.contributor.firstName} {note.contributor.lastName}</span>
                        <span className="flex items-center gap-1.5"><Building className="h-4 w-4" /> {note.department.name}</span>
                        <span className="flex items-center gap-1.5"><FileText className="h-4 w-4" /> {note.subject}</span>
                        <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {format(new Date(note.createdAt), "dd MMM yyyy")}</span>
                      </div>
                    </div>
                    {note.fileUrl && (
                      <Button variant="outline" asChild className="shrink-0">
                        <a href={note.fileUrl} target="_blank" rel="noopener noreferrer">
                          <Download className="mr-2 h-4 w-4" />
                          View File
                        </a>
                      </Button>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">{note.description}</p>
                  <div className="flex justify-end gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <XCircle className="mr-2 h-4 w-4" />
                          Reject
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Reject Submission</DialogTitle>
                        </DialogHeader>
                        <div className="py-4 space-y-2">
                          <Label htmlFor="rejection-reason">Reason for Rejection</Label>
                          <Textarea
                            id="rejection-reason"
                            placeholder="e.g., The file is corrupted, contains incorrect information..."
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                          />
                        </div>
                        <DialogFooter>
                          <DialogClose asChild id={`close-reject-dialog-${note.id}`}>
                            <Button variant="ghost">Cancel</Button>
                          </DialogClose>
                          <Button variant="destructive" onClick={() => handleReject(note.id)}>
                            Confirm Rejection
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Button variant="default" size="sm" onClick={() => handleApprove(note.id)}>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Approve
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}