"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Star, FileText, Eye } from "lucide-react"
import { api, type NoteListItem } from "@/lib/api"
import { formatDistanceToNow } from "date-fns"

export function NotesList({
  subject,
  department,
  year,
  section,
}: {
  subject?: string
  department?: string
  year?: string
  section?: string
}) {
  const [notes, setNotes] = useState<NoteListItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const params: Record<string, string> = {}
    if (department) params.department = department
    if (year) params.year = year
    if (section) params.section = section
    if (subject) params.subject = subject
    api.notes
      .list(params)
      .then(setNotes)
      .catch(() => [])
      .finally(() => setLoading(false))
  }, [department, year, section, subject])

  async function handleDownload(noteId: string) {
    try {
      const res = await api.notes.download(noteId)
      if (res.fileUrl) window.open(res.fileUrl, "_blank")
      else alert("Download recorded. File URL not available for this note.")
    } catch (err) {
      alert(err instanceof Error ? err.message : "Download failed")
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (notes.length === 0) {
    return (
      <p className="py-8 text-center text-muted-foreground">
        No notes found for this selection. Be the first to submit!
      </p>
    )
  }

  return (
    <div className="space-y-4">
      {notes.map((note) => (
        <Card key={note.id} className="transition-all duration-300 hover:shadow-lg hover:border-primary/30">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4">
                <div className="hidden sm:flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <FileText className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <Link href={`/notes/${note.id}`}>
                    <h3 className="text-lg font-semibold text-foreground hover:text-primary transition-colors line-clamp-2">
                      {note.title}
                    </h3>
                  </Link>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Contributed by <span className="font-medium text-foreground">{note.contributor ?? "Unknown"}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {note.host ? `Uploaded by ${note.host} • ` : ""}
                    {formatDistanceToNow(new Date(note.uploadedAt), { addSuffix: true })}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 lg:gap-6">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Download className="h-4 w-4" />
                    <span>{note.downloads.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="font-medium text-foreground">{note.rating}</span>
                    <span className="text-muted-foreground">({note.reviews})</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/notes/${note.id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Link>
                  </Button>
                  <Button size="sm" onClick={() => handleDownload(note.id)}>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
