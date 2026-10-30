import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AnnouncementBar } from "@/components/announcement-bar"
import { OrderSuccessGuard } from "@/components/order-success-guard"
import { SetupGuide } from "@/components/setup-guide"
import { OrderSuccessDetails } from "@/components/order-success-details"

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16">
          <OrderSuccessGuard>
            <div className="max-w-md mx-auto text-center space-y-6">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
              <div>
                <h1 className="text-3xl font-bold mb-2">Order Confirmed</h1>
                <p className="text-muted-foreground">
                  Thank you for your purchase! (Development Mode)
                </p>
              </div>
              <OrderSuccessDetails />
              <div className="p-4 bg-secondary/50 rounded-lg text-left text-sm space-y-2">
                <p className="font-medium">What happens next:</p>
                <p className="text-muted-foreground">
                  Your email contains the full product list and download links for the overlay,
                  webcam frame, chat box, alerts, Starting Soon and Be Right Back screens.
                  The files work with OBS Studio, Streamlabs, StreamElements, Twitch, YouTube and Facebook.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <SetupGuide />
                <Button asChild>
                  <Link href="/shop">Continue Shopping</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/">Return Home</Link>
                </Button>
              </div>
            </div>
          </OrderSuccessGuard>
        </div>
      </main>
      <Footer />
    </div>
  )
}
