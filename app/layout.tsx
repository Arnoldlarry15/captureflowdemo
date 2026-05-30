import type {Metadata} from 'next';
import { Inter, JetBrains_Mono, Outfit } from 'next/font/google';
import './globals.css'; // Global styles

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-display',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'CaptureFlow — Cognitive Offloading Primitive',
  description: 'Instant screen selection capturing and AI cognitive extraction system.',
  icons: {
    icon: 'https://github.com/user-attachments/assets/cb40b5ab-815c-40d1-87e5-70abf7e91e38',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased text-slate-900 bg-[#F8FAFC]" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
