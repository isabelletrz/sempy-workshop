"use client"

import Link from "next/link"
import { collections } from "@/data/products"
import { Card, CardContent } from "@/components/ui/card"

export function SeasonalCollections() {
  const seasonalCollections = collections.filter(c => 
    ['halloween', 'christmas', 'valentine', 'summer'].includes(c.slug)
  )

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Seasonal Collections</h2>
          <p className="text-muted-foreground">Limited edition designs for special occasions</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {seasonalCollections.map((collection) => (
            <Link key={collection.slug} href={`/collections/${collection.slug}`}>
              <Card className="group overflow-hidden hover:border-accent transition-colors h-full">
                <div className="aspect-[4/3] bg-gradient-to-br from-accent/30 to-secondary relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-center px-4" style={{ fontFamily: 'var(--font-display)' }}>
                      {collection.name}
                    </span>
                  </div>
                </div>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">{collection.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
