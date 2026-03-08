"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { GraduationCap, Briefcase, Cpu, BookText, ArrowRight, FileText } from "lucide-react"
import { api, type Department } from "@/lib/api"

const iconMap: Record<string, typeof Cpu> = {
  bca: Cpu,
  bba: Briefcase,
  btech: GraduationCap,
  ba: BookText,
}

const colorMap: Record<string, string> = {
  bca: "bg-blue-500/10 text-blue-600",
  bba: "bg-emerald-500/10 text-emerald-600",
  btech: "bg-amber-500/10 text-amber-600",
  ba: "bg-rose-500/10 text-rose-600",
}

const borderMap: Record<string, string> = {
  bca: "hover:border-blue-300",
  bba: "hover:border-emerald-300",
  btech: "hover:border-amber-300",
  ba: "hover:border-rose-300",
}

export function DepartmentGrid() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.departments().then(setDepartments).catch(() => []).finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="h-48 animate-pulse">
            <CardContent className="p-8" />
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {departments.map((dept) => {
        const Icon = iconMap[dept.slug] ?? Cpu
        const color = colorMap[dept.slug] ?? "bg-primary/10 text-primary"
        const borderColor = borderMap[dept.slug] ?? ""
        return (
          <Link key={dept.id} href={`/browse/${dept.slug}`}>
            <Card className={`group h-full transition-all duration-300 hover:shadow-xl ${borderColor}`}>
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ${color}`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-foreground">{dept.name}</h2>
                      <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">{dept.fullName}</p>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {dept.description ?? ""}
                    </p>
                    <div className="mt-4 flex items-center gap-6">
                      <div className="flex items-center gap-2 text-sm">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-foreground">{dept.notesCount.toLocaleString()}</span>
                        <span className="text-muted-foreground">notes</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
