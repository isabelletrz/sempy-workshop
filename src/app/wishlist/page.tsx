import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AnnouncementBar } from "@/components/announcement-bar"
import { WishlistContent } from "@/components/wishlist-content"

export default function WishlistPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8">My Wishlist</h1>
          <WishlistContent />
        </div>
      </main>
      <Footer />
    </div>
  )
}
