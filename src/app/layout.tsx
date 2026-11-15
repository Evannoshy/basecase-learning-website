import type { Metadata, Viewport } from 'next';
import '@fontsource/plus-jakarta-sans/400.css';
import '@fontsource/plus-jakarta-sans/500.css';
import '@fontsource/plus-jakarta-sans/600.css';
import '@fontsource/plus-jakarta-sans/700.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/500.css';
import '@fontsource/jetbrains-mono/600.css';
import './globals.css';
import { siteConfig } from '@/config/siteConfig';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FloatingContactCta } from '@/components/layout/FloatingContactCta';
import { CookieBanner } from '@/components/layout/CookieBanner';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#FAF8F5',
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.brand.url),
  title: {
    default: `${siteConfig.brand.name} | ${siteConfig.brand.tagline}`,
    template: `%s | ${siteConfig.brand.name}`,
  },
  description: siteConfig.brand.description,
  applicationName: siteConfig.brand.name,
  category: 'education',
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: ['/icon.svg'],
    apple: [{ url: '/icon.svg', type: 'image/svg+xml' }],
  },
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
  authors: [{ name: siteConfig.brand.name, url: siteConfig.brand.url }],
  creator: siteConfig.brand.name,
  publisher: siteConfig.brand.name,
  keywords: [
    'BaseCase Learning',
    'coding tuition Singapore',
    'Python tuition Singapore',
    'secondary school coding classes Singapore',
    'JC computing tuition Singapore',
    'O-Level computing tuition Singapore',
    'A-Level H2 computing tuition',
    'NUS computing tutors',
    'coding classes for teens Singapore',
    'web development classes for students Singapore',
    'AI classes for secondary students Singapore',
    'Coding academy Singapore',
    'Computational thinking',
  ],
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_SG',
    url: siteConfig.brand.url,
    title: `${siteConfig.brand.name} | ${siteConfig.hero.headline}`,
    description: siteConfig.brand.description,
    siteName: siteConfig.brand.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.brand.name} | ${siteConfig.hero.headline}`,
    description: siteConfig.brand.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="scroll-smooth"
    >
      <body className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-green-100 selection:text-green-950">
        {/* WCAG AA Visible Skip-to-Main-Content Anchor */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-[#0B132B] focus:px-4 focus:py-2 focus:text-white focus:shadow-lg focus:ring-2 focus:ring-[#0D9488] focus:outline-none"
        >
          Skip to main content
        </a>

        {/* Semantic Flex Layout Shell */}
        <div className="flex min-h-screen flex-col">
          <Header />
          <main
            id="main-content"
            tabIndex={-1}
            className="flex-1 focus:outline-none"
          >
            {children}
          </main>
          <Footer />
          <FloatingContactCta />
          <CookieBanner />
        </div>
      </body>
    </html>
  );
}
