/** Welcome discount handed out by the first-visit pop-up. Validated again on the server when an order is placed. */
export const WELCOME_CODE = "SEMPY10"
export const WELCOME_PERCENT = 10
export const DISCOUNT_STORAGE_KEY = "sempy-discount"

export function isValidDiscountCode(code: string | null | undefined): boolean {
  return Boolean(code) && code!.trim().toUpperCase() === WELCOME_CODE
}

export function applyDiscount(total: number, code: string | null | undefined): number {
  if (!isValidDiscountCode(code) || total <= 0) return total
  return Math.round(total * (100 - WELCOME_PERCENT)) / 100
}
