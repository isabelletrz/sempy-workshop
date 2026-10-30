import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AnnouncementBar } from "@/components/announcement-bar"
import { collections, products } from "@/data/products"
import { CollectionStack } from "@/components/collection-stack"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

export default function CollectionsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Collections</h1>
            <p className="text-muted-foreground">Curated sets of designs by aesthetic</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((collection) => {
              const items = products.filter(
                (p) => p.isActive && (p.collections.includes(collection.slug) || p.seasonalTags.includes(collection.slug))
              )
              return (
              <Link key={collection.slug} href={`/collections/${collection.slug}`}>
                <Card className="group overflow-hidden hover:border-accent transition-colors h-full">
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#0c0c0c]">
                    <CollectionStack products={items} name={collection.name} />
                    <span className="absolute inset-x-0 bottom-3 text-center font-display text-2xl text-foreground drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                      {collection.name}
                    </span>
                    <span className="absolute right-3 top-3 rounded-full border border-white/25 bg-black/50 px-2.5 py-1 text-[11px] uppercase tracking-[0.15em] text-white/75">
                      {items.length} {items.length === 1 ? "template" : "templates"}
                    </span>
                  </div>
                  <CardContent className="p-6">
                    <p className="text-muted-foreground">{collection.description}</p>
                  </CardContent>
                </Card>
              </Link>
              )
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
