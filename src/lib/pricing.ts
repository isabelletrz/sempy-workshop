import { Product } from "@/data/products"
import { getActiveCampaign } from "@/lib/config"
import { calculateDiscount } from "@/lib/utils"

export interface ProductPricing {
  price: number
  compareAtPrice?: number
  discount: number | null
}

/**
 * Returns the price actually charged for a product, taking the active
 * campaign promotion into account.
 */
export function getProductPricing(product: Product): ProductPricing {
  const promotion = getActiveCampaign().promotion
  let price = product.price
  let compareAtPrice = product.compareAtPrice

  if (promotion) {
    const isEligible =
      product.collections.includes(promotion.collection) ||
      product.seasonalTags.includes(promotion.collection)

    if (isEligible) {
      price = Math.round(product.price * (100 - promotion.value)) / 100
      compareAtPrice = product.price
    }
  }

  return { price, compareAtPrice, discount: calculateDiscount(price, compareAtPrice) }
}
