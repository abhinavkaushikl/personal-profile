import type { Metadata, Viewport } from 'next';
import { Inter, Instrument_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const sans = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });
const lendhub = Instrument_Sans({ subsets: ['latin'], weight: '700', variable: '--font-lendhub', display: 'swap' });

const description =
  'Senior Applied Scientist building production LLM, multi-agent and RAG systems across Healthcare, Telecom and AIOps.';

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000');
const ogImage = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/abhinav.jpg`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Abhinav Kaushik — Senior Applied Scientist',
  description,
  openGraph: {
    title: 'Abhinav Kaushik — Senior Applied Scientist',
    description,
    images: [ogImage],
    type: 'website',
  },
  twitter: { card: 'summary', title: 'Abhinav Kaushik', description, images: [ogImage] },
};

export const viewport: Viewport = {
  themeColor: '#05060A',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable} ${lendhub.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
