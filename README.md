# NOCTRA STUDIO

A premium seasonal Twitch template marketplace built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- **Seasonal Theme Engine**: Dynamic visual identity that changes based on active campaigns (Halloween, Christmas, Valentine's Day, Summer)
- **E-commerce Functionality**: Product catalogue, search, filters, cart, wishlist, and checkout
- **18+ Seed Products**: Realistic product data for Twitch overlays, branding kits, screens, and more
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Dark Editorial Aesthetic**: Premium design with violet accents
- **Local Development**: Works without external services or credentials

## Tech Stack

- [Next.js 14](https://nextjs.org/) - React framework with App Router
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Lucide React](https://lucide.dev/) - Icons
- [Zod](https://zod.dev/) - Schema validation

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd "Default Project"
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment variables:
```bash
cp .env.example .env.local
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Seasonal Themes

The theme system automatically selects themes based on campaign dates (Europe/Paris timezone). You can override for development:

```env
NEXT_PUBLIC_ACTIVE_THEME=halloween  # or noctra, christmas, valentine, summer
```

### Campaign Schedule
- **NOCTRA (Default)**: Year-round
- **HAUNTED ARCHIVE (Halloween)**: Oct 1 - Nov 1
- **MIDNIGHT WINTER (Christmas)**: Dec 1 - Jan 1  
- **AFTER DARK (Valentine's)**: Feb 1 - Feb 15
- **DIGITAL HEAT (Summer)**: Jul 1 - Sep 1

## Project Structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # React components
│   ├── ui/          # shadcn/ui components
│   └── ...          # Feature components
├── data/            # Product and collection data
└── lib/             # Utilities, config, providers
```

## Adding Products

Edit `src/data/products.ts` to add new products. Each product requires:
- id, slug, name, descriptions
- category, price, images
- aesthetics, tags, collections
- flags (isActive, isFeatured, isNew, isAnimated)

## Adding Campaigns

Edit `src/lib/config.ts` to add new seasonal campaigns with:
- colors, campaign copy, dates
- banner configuration
- optional promotions

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Production Deployment

For production, you'll need to configure:
1. **Payment Provider** (Stripe recommended) - Add API keys
2. **Database** - For orders, users, inventory
3. **File Storage** - For downloadable products
4. **Email Service** - For order confirmations

See `.env.example` for required variables.

## Notes

- This is a development implementation with local cart/wishlist persistence
- Checkout is in development mode (no real payments)
- Product images use placeholders
- All prices in EUR
- Not affiliated with Twitch

## License

Copyright © 2026 NOCTRA STUDIO. All rights reserved.
