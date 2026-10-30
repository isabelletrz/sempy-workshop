import { Suspense } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AnnouncementBar } from "@/components/announcement-bar"
import { ShopContent } from "@/components/shop-content"

export default function ShopPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Shop All</h1>
            <p className="text-muted-foreground">Browse our complete collection of Twitch templates and graphics</p>
          </div>
          <Suspense fallback={<p className="text-muted-foreground">Loading products...</p>}>
            <ShopContent />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  )
}
