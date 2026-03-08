import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/landing/hero-section"
import { DepartmentSection } from "@/components/landing/department-section"
import { TopNotesSection } from "@/components/landing/top-notes-section"
import { ContributorsSection } from "@/components/landing/contributors-section"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <DepartmentSection />
        <TopNotesSection />
        <ContributorsSection />
      </main>
      <Footer />
    </div>
  )
}
