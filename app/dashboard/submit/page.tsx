"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Upload, FileText, CheckCircle, Clock, X } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { api, type Submission } from "@/lib/api"
import { formatDistanceToNow } from "date-fns"

export default function SubmitNotesPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [department, setDepartment] = useState("")
  const [year, setYear] = useState("")
  const [section, setSection] = useState("")
  const [subject, setSubject] = useState("")
  const [description, setDescription] = useState("")
  const [fileUrl, setFileUrl] = useState("")
  const [fileName, setFileName] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [recentSubmissions, setRecentSubmissions] = useState<Submission[]>([])

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login")
      return
    }
    if (user) {
      api.dashboard.submissions().then(setRecentSubmissions).catch(() => [])
    }
  }, [user, authLoading, router])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFile(file)
      setFileName(file.name)
    } else {
      setFile(null)
      setFileName(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSubmitting(true)
    try {
      let uploadedUrl: string | undefined

      if (file) {
        const formData = new FormData()
        formData.append("file", file)

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
          credentials: "include",
        })

        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error((data as { error?: string }).error || "File upload failed")
        }

        const data = (await res.json()) as { url: string }
        uploadedUrl = data.url
      }

      await api.notes.create({
        title,
        description,
        department: department,
        year: parseInt(year, 10),
        section: section,
        subject: subject,
        fileUrl: uploadedUrl ?? (fileUrl || undefined),
      })
      setIsSubmitted(true)
      setRecentSubmissions((prev) => [
        { id: "", title, status: "pending", rejectionReason: null, submittedAt: new Date().toISOString() },
        ...prev,
      ])
      setTitle("")
      setDepartment("")
      setYear("")
      setSection("")
      setSubject("")
      setDescription("")
      setFileUrl("")
      setFile(null)
      setFileName(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed")
    } finally {
      setSubmitting(false)
    }
  }

  if (authLoading || !user) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Submit Notes</h1>
        <p className="mt-2 text-muted-foreground">
          Share your study notes with your classmates. Your submission will be reviewed by your section host.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Note Details</CardTitle>
              <CardDescription>
                Fill in the details about your notes. Make sure to select the correct subject and section.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isSubmitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
                    <CheckCircle className="h-8 w-8 text-emerald-600" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-foreground">Submission Successful!</h3>
                  <p className="mt-2 text-muted-foreground">
                    Your notes have been submitted for review. You&apos;ll be notified once they&apos;re approved.
                  </p>
                  <Button className="mt-6" onClick={() => setIsSubmitted(false)}>
                    Submit Another
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Data Structures - Arrays and Linked Lists"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Select value={department} onValueChange={setDepartment} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bca">BCA</SelectItem>
                          <SelectItem value="bba">BBA</SelectItem>
                          <SelectItem value="btech">BTech</SelectItem>
                          <SelectItem value="ba">BA</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="year">Year</Label>
                      <Select value={year} onValueChange={setYear} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1st Year</SelectItem>
                          <SelectItem value="2">2nd Year</SelectItem>
                          <SelectItem value="3">3rd Year</SelectItem>
                          <SelectItem value="4">4th Year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="section">Section</Label>
                      <Select value={section} onValueChange={setSection} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select section" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="a">Section A</SelectItem>
                          <SelectItem value="b">Section B</SelectItem>
                          <SelectItem value="c">Section C</SelectItem>
                          <SelectItem value="d">Section D</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        placeholder="e.g., Data Structures"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe what topics are covered in these notes..."
                      className="min-h-[120px]"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Upload File (optional)</Label>
                    <div className="relative">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.ppt,.pptx"
                        onChange={handleFileChange}
                        className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                      />
                      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50 p-8 transition-colors hover:border-primary/50 hover:bg-muted">
                        <Upload className="h-10 w-10 text-muted-foreground" />
                        <p className="mt-4 text-sm font-medium text-foreground">
                          {fileName || "Click to upload or drag and drop"}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                    PDF, DOC, DOCX, PPT, PPTX (max 10MB).
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Or add a link to your notes (Google Drive, etc.):
                    </p>
                    <Input
                      placeholder="https://..."
                      value={fileUrl}
                      onChange={(e) => setFileUrl(e.target.value)}
                    />
                    {fileName && (
                      <div className="flex items-center gap-2 mt-2">
                        <FileText className="h-4 w-4 text-primary" />
                        <span className="text-sm text-foreground">{fileName}</span>
                        <button
                          type="button"
                          onClick={() => setFileName(null)}
                          className="ml-auto text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={submitting}>
                    <Upload className="mr-2 h-5 w-5" />
                    {submitting ? "Submitting..." : "Submit Notes"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Submissions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentSubmissions.length === 0 ? (
                <p className="text-sm text-muted-foreground">No submissions yet.</p>
              ) : (
                recentSubmissions.slice(0, 5).map((s) => (
                  <div key={s.id || s.title + s.submittedAt} className="space-y-2 rounded-lg border border-border p-4">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium text-foreground text-sm">{s.title}</p>
                      {s.status === "approved" && (
                        <Badge variant="outline" className="shrink-0 border-emerald-200 bg-emerald-50 text-emerald-700">
                          <CheckCircle className="mr-1 h-3 w-3" /> Approved
                        </Badge>
                      )}
                      {s.status === "pending" && (
                        <Badge variant="outline" className="shrink-0 border-amber-200 bg-amber-50 text-amber-700">
                          <Clock className="mr-1 h-3 w-3" /> Pending
                        </Badge>
                      )}
                      {s.status === "rejected" && (
                        <Badge variant="outline" className="shrink-0 border-rose-200 bg-rose-50 text-rose-700">
                          <X className="mr-1 h-3 w-3" /> Rejected
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(s.submittedAt), { addSuffix: true })}
                    </p>
                    {s.rejectionReason && (
                      <p className="text-xs text-rose-600">Reason: {s.rejectionReason}</p>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Submission Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 mt-0.5 shrink-0 text-emerald-600" />
                  <span>Ensure your notes are clear and well-organized</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 mt-0.5 shrink-0 text-emerald-600" />
                  <span>Include diagrams and examples where relevant</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 mt-0.5 shrink-0 text-emerald-600" />
                  <span>Select the correct subject and section</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 mt-0.5 shrink-0 text-emerald-600" />
                  <span>Do not submit copyrighted material</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
