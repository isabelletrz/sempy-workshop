import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AnnouncementBar } from "@/components/announcement-bar"
import { CheckoutContent } from "@/components/checkout-content"

export default function CheckoutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8">Checkout</h1>
          <CheckoutContent />
        </div>
      </main>
      <Footer />
    </div>
  )
}
