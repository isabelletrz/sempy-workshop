import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

export function Categories() {
  const displayCategories = [
    { name: "Overlays", href: "/shop?category=Overlays" },
    { name: "Stream Screens", href: "/shop?category=Stream%20Screens" },
    { name: "Full Branding Kits", href: "/shop?category=Full%20Branding%20Kits" },
    { name: "Panels", href: "/shop?category=Panels" },
    { name: "Alerts", href: "/shop?category=Alerts" },
    { name: "Animated Assets", href: "/shop?category=Animated%20Assets" },
  ]

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Shop by Category</h2>
          <p className="text-muted-foreground">Find the perfect assets for your stream</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {displayCategories.map((category) => (
            <Link key={category.name} href={category.href}>
              <Card className="hover:border-accent transition-colors cursor-pointer h-full">
                <CardContent className="p-6 text-center">
                  <p className="font-medium">{category.name}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
