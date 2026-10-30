"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export function OrderSuccessGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem("noctra-order-placed") !== "1") {
      router.replace("/cart")
      return
    }
    setAllowed(true)
  }, [router])

  if (!allowed) return null
  return <>{children}</>
}
