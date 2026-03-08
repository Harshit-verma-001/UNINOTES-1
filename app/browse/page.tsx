import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { DepartmentGrid } from "@/components/browse/department-grid"

export default function BrowsePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-background">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Browse Notes</h1>
            <p className="mt-2 text-muted-foreground">
              Select a department to start exploring study notes
            </p>
          </div>
          <DepartmentGrid />
        </div>
      </main>
      <Footer />
    </div>
  )
}
