import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AnnouncementBar } from "@/components/announcement-bar"
import { Hero } from "@/components/hero"
import { CollectionPlates } from "@/components/collection-plates"
import { Reviews } from "@/components/reviews"
import { Newsletter } from "@/components/newsletter"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        <Hero />
        <CollectionPlates />
        <Reviews />
        <Newsletter />
      </main>
      <Footer />
    </div>
  )
}
