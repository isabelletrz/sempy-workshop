"use client"

import { useState, useMemo } from "react"
import { products } from "@/data/products"
import { ProductCard } from "@/components/product-card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function SearchContent() {
  const [query, setQuery] = useState("")

  const results = useMemo(() => {
    if (!query.trim()) return []
    
    return products.filter(p => 
      p.isActive && (
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase()) ||
        p.shortDescription.toLowerCase().includes(query.toLowerCase()) ||
        p.tags.some(t => t.toLowerCase().includes(query.toLowerCase())) ||
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        p.aesthetics.some(a => a.toLowerCase().includes(query.toLowerCase()))
      )
    )
  }, [query])

  return (
    <div className="space-y-6">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search for products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
          autoFocus
        />
      </div>

      {query.trim() && (
        <p className="text-sm text-muted-foreground">
          {results.length} {results.length === 1 ? 'result' : 'results'} for &quot;{query}&quot;
        </p>
      )}

      {query.trim() === '' ? (
        <p className="text-muted-foreground">Start typing to search products...</p>
      ) : results.length === 0 ? (
        <p className="text-muted-foreground">No products found for &quot;{query}&quot;</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
