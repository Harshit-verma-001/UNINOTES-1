"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { ChevronRight, Download, Star, FileText, Calendar, User, Upload, ThumbsUp } from "lucide-react"
import { api, type NoteDetail, type Comment } from "@/lib/api"
import { useAuth } from "@/contexts/AuthContext"
import { format, formatDistanceToNow } from "date-fns"

export default function NoteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [note, setNote] = useState<NoteDetail | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [commentText, setCommentText] = useState("")
  const [submittingComment, setSubmittingComment] = useState(false)
  const [rating, setRating] = useState(0)
  const { user } = useAuth()
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null)

  useEffect(() => {
    params.then(setResolvedParams)
  }, [params])

  useEffect(() => {
    if (!resolvedParams?.id) return
    const id = resolvedParams.id
    Promise.all([api.notes.get(id), api.notes.comments.list(id)])
      .then(([n, c]) => {
        setNote(n)
        setComments(c)
        setRating(Math.round(n.rating))
      })
      .catch(() => setNote(null))
      .finally(() => setLoading(false))
  }, [resolvedParams?.id])

  async function handleDownload() {
    if (!note) return
    try {
      await api.notes.download(note.id)
      if (note.fileUrl) window.open(note.fileUrl, "_blank")
      else alert("Download recorded. File URL not available for this note.")
    } catch (err) {
      alert(err instanceof Error ? err.message : "Download failed")
    }
  }

  async function handleRate(value: number) {
    if (!note || !user) return
    setRating(value)
    try {
      await api.notes.rate(note.id, value)
      const updated = await api.notes.get(note.id)
      setNote(updated)
    } catch {
      setRating(note.rating)
    }
  }

  async function handlePostComment(e: React.FormEvent) {
    e.preventDefault()
    if (!note || !commentText.trim() || !user) return
    setSubmittingComment(true)
    try {
      const newComment = await api.notes.comments.create(note.id, commentText.trim())
      setComments((prev) => [newComment, ...prev])
      setCommentText("")
      const updated = await api.notes.get(note.id)
      setNote(updated)
    } finally {
      setSubmittingComment(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 bg-background px-4 py-12">
          <div className="mx-auto max-w-5xl">Loading...</div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!note) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 bg-background px-4 py-12">
          <div className="mx-auto max-w-5xl">
            <p className="text-muted-foreground">Note not found.</p>
            <Link href="/browse" className="text-primary hover:underline">Back to Browse</Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-background">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm">
            <Link href="/browse" className="text-muted-foreground hover:text-primary transition-colors">
              Browse
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <Link href={`/browse/${note.departmentSlug}`} className="text-muted-foreground hover:text-primary transition-colors">
              {note.department}
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium text-foreground">{note.subject}</span>
          </nav>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary">{note.department}</Badge>
                  <Badge variant="outline">{note.yearLabel}</Badge>
                  <Badge variant="outline">Section {note.section}</Badge>
                </div>
                <h1 className="text-3xl font-bold text-foreground">{note.title}</h1>
                <p className="mt-2 text-lg text-muted-foreground">{note.subject}</p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line text-muted-foreground leading-relaxed">
                    {note.description}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Comments ({comments.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {user && (
                    <form onSubmit={handlePostComment} className="space-y-4">
                      <Textarea
                        placeholder="Write a comment..."
                        className="min-h-[100px]"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                      />
                      <Button type="submit" disabled={submittingComment || !commentText.trim()}>
                        Post Comment
                      </Button>
                    </form>
                  )}
                  <div className="border-t border-border pt-6 space-y-6">
                    {comments.map((comment) => (
                      <div key={comment.id} className="flex gap-4">
                        <Avatar className="h-10 w-10 border border-border">
                          <AvatarFallback className="bg-primary/10 text-primary text-sm">
                            {comment.author.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">{comment.author}</span>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(comment.date), { addSuffix: true })}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">{comment.content}</p>
                          <button className="mt-2 flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
                            <ThumbsUp className="h-3.5 w-3.5" />
                            <span>{comment.likes}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="sticky top-8">
                <CardContent className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Download className="h-5 w-5 text-muted-foreground" />
                      <span className="text-lg font-semibold text-foreground">{note.downloads.toLocaleString()}</span>
                      <span className="text-sm text-muted-foreground">downloads</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                      <span className="text-lg font-semibold text-foreground">{note.rating}</span>
                      <span className="text-sm text-muted-foreground">({note.reviews})</span>
                    </div>
                  </div>

                  {user && (
                    <div className="flex items-center justify-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className="p-1 hover:scale-110 transition-transform"
                          onClick={() => handleRate(star)}
                        >
                          <Star
                            className={`h-6 w-6 ${
                              star <= rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  )}

                  <Button className="w-full" size="lg" onClick={handleDownload}>
                    <Download className="mr-2 h-5 w-5" />
                    Download Notes
                  </Button>

                  <div className="space-y-4 pt-4 border-t border-border">
                    {note.host && (
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10">
                          <Upload className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Uploaded by</p>
                          <p className="font-medium text-foreground">{note.host}</p>
                        </div>
                      </div>
                    )}
                    {note.contributor && (
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Contributed by</p>
                          <p className="font-medium text-foreground">{note.contributor}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10">
                        <Calendar className="h-5 w-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Uploaded on</p>
                        <p className="font-medium text-foreground">{format(new Date(note.uploadedAt), "MMMM d, yyyy")}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
