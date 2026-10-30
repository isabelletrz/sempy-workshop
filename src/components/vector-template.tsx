/* eslint-disable @next/next/no-img-element */
import type { Product } from "@/data/products"
import { templateImageUrl, type TemplateScreen } from "@/lib/template-screens"
import { cn } from "@/lib/utils"

export function VectorTemplate({
  product,
  screen = "overlay",
  className,
  alt,
  loading = "lazy",
  style,
}: {
  product: Product
  screen?: TemplateScreen
  className?: string
  alt?: string
  loading?: "lazy" | "eager"
  style?: React.CSSProperties
}) {
  return (
    <img
      src={templateImageUrl(product.slug, screen)}
      alt={alt ?? `${product.name} — ${screen} template preview`}
      loading={loading}
      style={style}
      className={cn("aspect-video w-full object-cover", className)}
    />
  )
}
