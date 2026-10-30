import { notFound } from "next/navigation"
import { collections, products } from "@/data/products"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AnnouncementBar } from "@/components/announcement-bar"
import { ProductCard } from "@/components/product-card"

export function generateStaticParams() {
  return collections.map((collection) => ({
    slug: collection.slug,
  }))
}

export default function CollectionPage({ params }: { params: { slug: string } }) {
  const collection = collections.find((c) => c.slug === params.slug)
  
  if (!collection) {
    notFound()
  }

  const collectionProducts = products.filter(p =>
    p.isActive &&
    (p.collections.includes(collection.slug) || p.seasonalTags.includes(collection.slug))
  )

  return (
    <div className="min-h-screen flex flex-col">
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8 space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
              {collection.name}
            </h1>
            <p className="text-xl text-muted-foreground">{collection.description}</p>
          </div>
          
          {collectionProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No products in this collection yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {collectionProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
