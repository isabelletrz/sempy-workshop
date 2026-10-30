import { products } from "@/data/products"
import { ProductCard } from "@/components/product-card"

export function NewArrivals() {
  const newProducts = products.filter(p => p.isNew && p.isActive).slice(0, 4)

  if (newProducts.length === 0) return null

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">New Arrivals</h2>
          <p className="text-muted-foreground">Fresh designs just added</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
