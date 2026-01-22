# Stralendezorg Website

Modern, bilingual (Dutch/English) website for Stralendezorg, a home care company in the Netherlands.

## Features

- 🎨 Modern, responsive design with smooth animations
- 🌍 Bilingual support (Dutch/English)
- 📱 Mobile-first responsive layout
- ✨ Framer Motion animations throughout
- 📝 Contact form with validation
- 🖼️ Image galleries for each service
- 🎯 Strategic CTA buttons on every page
- ♿ Accessible and WCAG compliant

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod validation
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
zorgstralende/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Homepage
│   ├── about/              # About page
│   ├── services/           # Services pages
│   │   ├── page.tsx        # Services overview
│   │   ├── persoonlijke-verzorging/
│   │   ├── begeleiding/
│   │   └── huishoudelijke-hulp/
│   ├── contact/            # Contact page
│   └── api/                # API routes
├── components/             # React components
├── lib/                    # Utilities and translations
├── public/                 # Static assets
│   └── images/            # Image assets
└── types/                 # TypeScript types
```

## Adding Images

Place your images in the following directories:

- `/public/images/services/persoonlijke-verzorging/` - Personal care service images
- `/public/images/services/begeleiding/` - Guidance service images
- `/public/images/services/huishoudelijke-hulp/` - Household help service images
- `/public/images/general/` - General website images

## Contact Form

The contact form is set up with API route at `/api/contact`. To enable email sending:

1. Set up an email service (Resend, SendGrid, etc.)
2. Add your API keys to environment variables
3. Update the API route to send emails

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in Vercel
3. Deploy automatically

### Other Platforms

Build the project:
```bash
npm run build
```

Start production server:
```bash
npm start
```

## Language Switching

The website supports Dutch (NL) and English (EN). Language switching is available in the navigation bar. The language state is managed client-side.

## Customization

- **Colors**: Edit `tailwind.config.ts` to customize the color scheme
- **Content**: Update translations in `lib/translations.ts`
- **Animations**: Modify Framer Motion animations in components

## License

© 2024 Stralendezorg. All rights reserved.
