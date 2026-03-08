const API = "/api"

export type UserRole = "student" | "host" | "admin"

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  department: { id: string; slug: string; name: string } | null
  year: number | null
  section: string | null
}

export interface Department {
  id: string
  slug: string
  name: string
  fullName: string
  description: string | null
  notesCount: number
}

export interface NoteListItem {
  id: string
  title: string
  description: string
  subject: string
  subjectSlug: string
  department: string
  year: number
  section: string
  contributor: string | null
  host: string | null
  downloads: number
  rating: number
  reviews: number
  uploadedAt: string
}

export interface NoteDetail {
  id: string
  title: string
  subject: string
  department: string
  departmentSlug: string
  year: number
  yearLabel: string
  section: string
  description: string
  fileUrl: string | null
  contributor: string | null
  host: string | null
  downloads: number
  rating: number
  reviews: number
  uploadedAt: string
}

export interface Comment {
  id: string
  author: string
  content: string
  likes: number
  date: string
}

export interface LeaderboardEntry {
  id: string
  name: string
  department: string
  year: number | null
  yearLabel: string | null
  notesCount: number
  downloads: number
  rating: number
  rank: number
}

export interface DashboardStats {
  notesSubmitted: number
  notesApproved: number
  totalDownloads: number
  avgRating: number
}

export interface Submission {
  id: string
  title: string
  status: "pending" | "approved" | "rejected"
  rejectionReason: string | null
  submittedAt: string
}

async function fetchApi<T>(
  path: string,
  options?: RequestInit & { params?: Record<string, string> }
): Promise<T> {
  const { params, ...init } = options ?? {}
  const url = params ? `${API}${path}?${new URLSearchParams(params)}` : `${API}${path}`
  const res = await fetch(url, {
    ...init,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...init.headers },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error((err as { error?: string }).error || "Request failed")
  }
  return res.json() as Promise<T>
}

export const api = {
  auth: {
    me: () => fetchApi<{ user: User | null }>("/auth/me"),
    login: (email: string, password: string) =>
      fetchApi<{ user: User }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),
    register: (data: {
      email: string
      password: string
      firstName: string
      lastName: string
      department?: string
      year?: number
      section?: string
    }) =>
      fetchApi<{ user: User }>("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    logout: () => fetchApi<{ ok: boolean }>("/auth/logout", { method: "POST" }),
  },
  departments: () => fetchApi<Department[]>("/departments"),
  notes: {
    list: (params: { department?: string; year?: string; section?: string; subject?: string }) =>
      fetchApi<NoteListItem[]>("/notes", { params: params as Record<string, string> }),
    get: (id: string) => fetchApi<NoteDetail>(`/notes/${id}`),
    create: (data: {
      title: string
      description: string
      department: string
      year: number
      section: string
      subject: string
      fileUrl?: string
    }) =>
      fetchApi<{ id: string; title: string; status: string; createdAt: string }>("/notes", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    download: (id: string) =>
      fetchApi<{ ok: boolean; fileUrl: string | null }>(`/notes/${id}/download`, {
        method: "POST",
      }),
    rate: (id: string, value: number) =>
      fetchApi<{ ok: boolean }>(`/notes/${id}/rate`, {
        method: "POST",
        body: JSON.stringify({ value }),
      }),
    comments: {
      list: (id: string) => fetchApi<Comment[]>(`/notes/${id}/comments`),
      create: (id: string, content: string) =>
        fetchApi<Comment>(`/notes/${id}/comments`, {
          method: "POST",
          body: JSON.stringify({ content }),
        }),
    },
  },
  leaderboard: () => fetchApi<LeaderboardEntry[]>("/leaderboard"),
  dashboard: {
    stats: () => fetchApi<DashboardStats>("/dashboard/stats"),
    submissions: () => fetchApi<Submission[]>("/dashboard/submissions"),
    recentDownloads: () =>
      fetchApi<{ id: string; title: string; subject: string; downloadedAt: string }[]>(
        "/dashboard/recent-downloads"
      ),
  },
}
