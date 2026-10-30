/**
 * Small gothic ornaments drawn as thin chrome-white line work.
 * Decorative only (aria-hidden).
 */

const STROKE = "rgba(232,232,240,0.85)"

/** Corner flourish for the top-left corner; flip with CSS transforms for the other corners. */
export function CornerFlourish({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden width="46" height="46" viewBox="0 0 46 46" fill="none" className={className}>
      <path d="M2 42 C2 18 18 2 42 2" stroke={STROKE} strokeWidth="1.3" strokeLinecap="round" />
      <path d="M9 34 C9 20 20 9 34 9 C41 9 43 17 37 19 C33 20 31 16 34 14" stroke={STROKE} strokeWidth="1.1" strokeLinecap="round" />
      <path d="M3 30 C8 28 12 24 14 19" stroke={STROKE} strokeOpacity="0.55" strokeWidth="1" strokeLinecap="round" />
      <circle cx="43" cy="2.5" r="2" fill={STROKE} />
      <circle cx="2.5" cy="43" r="2" fill={STROKE} />
    </svg>
  )
}

/** Small centered ornament (diamond with side tendrils) used on the top and bottom edge of the nav. */
export function EdgeOrnament({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden width="78" height="14" viewBox="0 0 78 14" fill="none" className={className}>
      <path d="M2 7 H26 C30 7 31 3 34 3 M76 7 H52 C48 7 47 3 44 3" stroke={STROKE} strokeWidth="1" strokeLinecap="round" />
      <path d="M39 1 L45 7 L39 13 L33 7 Z" stroke={STROKE} strokeWidth="1.2" fill="rgba(7,7,7,0.9)" />
      <circle cx="39" cy="7" r="1.4" fill={STROKE} />
    </svg>
  )
}

/** Vertical dagger, a quiet punctuation mark under the hero. */
export function Dagger({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden width="26" height="96" viewBox="0 0 26 96" fill="none" className={className}>
      <path d="M13 94 L9.5 40 H16.5 Z" stroke={STROKE} strokeWidth="1.2" fill="rgba(255,255,255,0.06)" strokeLinejoin="round" />
      <path d="M13 94 V40" stroke={STROKE} strokeOpacity="0.5" strokeWidth="1" />
      <path d="M2 38 C6 33 9 36 13 36 C17 36 20 33 24 38" stroke={STROKE} strokeWidth="1.3" strokeLinecap="round" />
      <path d="M13 36 V14" stroke={STROKE} strokeWidth="2" strokeLinecap="round" />
      <circle cx="13" cy="9" r="4.5" stroke={STROKE} strokeWidth="1.3" fill="rgba(7,7,7,0.9)" />
      <circle cx="13" cy="9" r="1.4" fill={STROKE} />
    </svg>
  )
}

/** Section divider: hairline, diamond, short hairline. */
export function DiamondRule({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`flex items-center gap-4 ${className}`}>
      <div className="h-px flex-1 bg-gradient-to-r from-white/70 to-white/10" />
      <div className="h-2.5 w-2.5 rotate-45 border border-white/80" />
      <div className="h-px w-16 bg-white/30" />
    </div>
  )
}
