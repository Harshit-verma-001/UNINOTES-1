"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Award, FileText, Download, Star } from "lucide-react"
import { api, type LeaderboardEntry } from "@/lib/api"

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}

export default function LeaderboardPage() {
  const [data, setData] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.leaderboard()
      .then(setData)
      .catch(() => [])
      .finally(() => setLoading(false))
  }, [])

  const topThree = data.slice(0, 3)
  const rest = data.slice(3)

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-background">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Contributor Leaderboard</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Recognizing the students who contribute the most to our community
            </p>
          </div>

          {loading ? (
            <p className="text-center text-muted-foreground">Loading...</p>
          ) : (
            <>
              {topThree.length >= 3 && (
                <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
                  <div className="order-2 sm:order-1">
                    <Card className="h-full bg-gradient-to-br from-slate-50 to-transparent border-slate-200">
                      <CardContent className="p-6 text-center">
                        <Medal className="mx-auto h-8 w-8 text-slate-400" />
                        <Avatar className="mx-auto mt-4 h-20 w-20 border-4 border-slate-200">
                          <AvatarFallback className="bg-slate-100 text-slate-600 text-xl font-semibold">
                            {getInitials(topThree[1].name)}
                          </AvatarFallback>
                        </Avatar>
                        <h3 className="mt-4 text-xl font-bold text-foreground">{topThree[1].name}</h3>
                        <Badge variant="secondary" className="mt-2">{topThree[1].department}</Badge>
                        <p className="mt-1 text-sm text-muted-foreground">{topThree[1].yearLabel ?? ""}</p>
                        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
                          <div>
                            <p className="font-bold text-foreground">{topThree[1].notesCount}</p>
                            <p className="text-xs text-muted-foreground">Notes</p>
                          </div>
                          <div>
                            <p className="font-bold text-foreground">{(topThree[1].downloads / 1000).toFixed(1)}k</p>
                            <p className="text-xs text-muted-foreground">Downloads</p>
                          </div>
                          <div>
                            <p className="font-bold text-foreground">{topThree[1].rating}</p>
                            <p className="text-xs text-muted-foreground">Rating</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="order-1 sm:order-2">
                    <Card className="h-full bg-gradient-to-br from-amber-50 to-transparent border-amber-200 shadow-lg">
                      <CardContent className="p-6 text-center">
                        <Trophy className="mx-auto h-10 w-10 text-amber-500" />
                        <Avatar className="mx-auto mt-4 h-24 w-24 border-4 border-amber-300 shadow-lg">
                          <AvatarFallback className="bg-amber-100 text-amber-700 text-2xl font-bold">
                            {getInitials(topThree[0].name)}
                          </AvatarFallback>
                        </Avatar>
                        <h3 className="mt-4 text-2xl font-bold text-foreground">{topThree[0].name}</h3>
                        <Badge className="mt-2 bg-amber-500">{topThree[0].department}</Badge>
                        <p className="mt-1 text-sm text-muted-foreground">{topThree[0].yearLabel ?? ""}</p>
                        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
                          <div>
                            <p className="text-lg font-bold text-foreground">{topThree[0].notesCount}</p>
                            <p className="text-xs text-muted-foreground">Notes</p>
                          </div>
                          <div>
                            <p className="text-lg font-bold text-foreground">{(topThree[0].downloads / 1000).toFixed(1)}k</p>
                            <p className="text-xs text-muted-foreground">Downloads</p>
                          </div>
                          <div>
                            <p className="text-lg font-bold text-foreground">{topThree[0].rating}</p>
                            <p className="text-xs text-muted-foreground">Rating</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="order-3">
                    <Card className="h-full bg-gradient-to-br from-amber-50/50 to-transparent border-amber-200/50">
                      <CardContent className="p-6 text-center">
                        <Award className="mx-auto h-8 w-8 text-amber-700" />
                        <Avatar className="mx-auto mt-4 h-20 w-20 border-4 border-amber-200/50">
                          <AvatarFallback className="bg-amber-50 text-amber-700 text-xl font-semibold">
                            {getInitials(topThree[2].name)}
                          </AvatarFallback>
                        </Avatar>
                        <h3 className="mt-4 text-xl font-bold text-foreground">{topThree[2].name}</h3>
                        <Badge variant="secondary" className="mt-2">{topThree[2].department}</Badge>
                        <p className="mt-1 text-sm text-muted-foreground">{topThree[2].yearLabel ?? ""}</p>
                        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
                          <div>
                            <p className="font-bold text-foreground">{topThree[2].notesCount}</p>
                            <p className="text-xs text-muted-foreground">Notes</p>
                          </div>
                          <div>
                            <p className="font-bold text-foreground">{(topThree[2].downloads / 1000).toFixed(1)}k</p>
                            <p className="text-xs text-muted-foreground">Downloads</p>
                          </div>
                          <div>
                            <p className="font-bold text-foreground">{topThree[2].rating}</p>
                            <p className="text-xs text-muted-foreground">Rating</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border bg-muted/50">
                          <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Rank</th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Contributor</th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Department</th>
                          <th className="px-6 py-4 text-center text-sm font-medium text-muted-foreground">Notes</th>
                          <th className="px-6 py-4 text-center text-sm font-medium text-muted-foreground">Downloads</th>
                          <th className="px-6 py-4 text-center text-sm font-medium text-muted-foreground">Rating</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rest.map((c) => (
                          <tr key={c.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                            <td className="px-6 py-4">
                              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-bold text-muted-foreground">
                                {c.rank}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10 border border-border">
                                  <AvatarFallback className="bg-primary/10 text-primary text-sm">
                                    {getInitials(c.name)}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="font-medium text-foreground">{c.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <Badge variant="outline">{c.department}</Badge>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <span className="text-foreground">{c.notesCount}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <Download className="h-4 w-4 text-muted-foreground" />
                                <span className="text-foreground">{(c.downloads / 1000).toFixed(1)}k</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                <span className="font-medium text-foreground">{c.rating}</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
