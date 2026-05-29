import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'CaptureFlow — Cognitive Offloading Primitive',
  description: 'Instant screen selection capturing and AI cognitive extraction system.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body className="antialiased text-slate-900 bg-[#F8FAFC]" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
