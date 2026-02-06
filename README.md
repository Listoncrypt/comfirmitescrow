# Confirmedit - Secure Escrow Platform

A premium fintech escrow service platform built with Next.js 16, React 19, Supabase, and Tailwind CSS.

## Features

- **Secure Escrow Transactions** - Hold funds safely between buyers and sellers
- **Real-time Deal Management** - Track deal status from start to completion
- **User Dashboard** - View balance, active deals, and transaction history
- **Admin Panel** - Manage all platform operations and disputes
- **Premium UI** - Teal and green fintech design with smooth scroll animations
- **Glass Morphism** - Modern glassmorphic cards and components
- **Responsive Design** - Works perfectly on mobile, tablet, and desktop

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **Backend**: Supabase (Auth, Database, RLS)
- **Icons**: Phosphor Icons, Lucide Icons
- **UI Effects**: Custom animations, glass morphism, scroll effects

## Installation

### Using shadcn CLI

```bash
npx shadcn-cli@latest init -d
npx shadcn-cli@latest add button card input form
```

### With npm

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── page.tsx              # Landing page with background & animations
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Global styles, animations, theme colors
│   ├── dashboard/            # User dashboard
│   ├── admin/                # Admin panel
│   └── auth/                 # Authentication pages
├── components/
│   ├── sections/             # Landing page sections
│   │   ├── hero.tsx
│   │   ├── benefits.tsx
│   │   ├── features.tsx
│   │   ├── how-it-works.tsx
│   │   ├── security.tsx
│   │   ├── testimonials.tsx
│   │   ├── faq.tsx
│   │   ├── blog.tsx
│   │   ├── contact.tsx
│   │   └── cta.tsx
│   ├── ui/                   # shadcn/ui components
│   ├── header.tsx            # Navigation header
│   └── footer.tsx            # Footer
├── public/
│   └── images/
│       └── teal-coins-bg.jpg # Background image
└── lib/                      # Utilities & database types
```

## Key Features

### Teal & Green Theme
The landing page uses a premium teal color palette (primary color: `oklch(0.6 0.18 180)`) with a beautiful background image of gold coins on teal.

### Scroll Animations
All sections feature smooth fade-in, slide, and scale animations triggered on scroll:
- `fade-in-up` - Elements fade in and move up
- `fade-in-left` / `fade-in-right` - Side animations
- `scale-in` - Elements scale up while appearing
- `blur-in` - Blur effect disappears on scroll

### Glass Morphism
Modern glass effect cards with backdrop blur:
```css
.glass-dark {
  background: rgba(13, 78, 91, 0.7);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(167, 243, 208, 0.2);
}
```

## Environment Variables

The application requires Supabase configuration. Create a `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

## Deployment

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FListoncrypt%2Fcomfirmitescrow)

Or push to GitHub and connect to Vercel for automatic deployments.

## Important Notes

- **Background Image**: Stored in `public/images/teal-coins-bg.jpg` - included in git repo
- **Animations**: All CSS animations are defined in `app/globals.css`
- **Colors**: Theme colors use OKLCH color format for better color management
- **Mobile**: All sections are responsive and mobile-optimized

## File Structure for Download

When downloading as ZIP or cloning from GitHub, ensure these critical files are included:

✅ `public/images/teal-coins-bg.jpg` - Background image  
✅ `app/globals.css` - All animations and theme colors  
✅ `app/page.tsx` - Landing page with background setup  
✅ `package.json` - All dependencies  
✅ All component files in `components/sections/`  

The `.gitignore` file does NOT exclude the `public/` folder, so the background image and all assets will be included when cloning from GitHub or downloading as ZIP.

## License

MIT
