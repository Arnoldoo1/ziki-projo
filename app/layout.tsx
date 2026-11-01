import type { Metadata } from 'next';
import './globals.css';
import './whimsy.css';
import { AppProvider } from '@/components/AppProvider';
import { WhimsyDecor } from '@/components/WhimsyDecor';

export const metadata: Metadata = {
  title: 'start.ng · Good vibes. Good games.',
  description: "Nigeria's home for free browser games. Play Naija-themed web games, no download. Built by the HNG community.",
  metadataBase: new URL('https://startng.vercel.app'),
  openGraph: {
    title: 'start.ng · Good vibes. Good games.',
    description: "Nigeria's home for free browser games. Play Naija-themed web games, no download.",
    type: 'website',
  },
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppProvider>{children}</AppProvider>
        <WhimsyDecor />
      </body>
    </html>
  );
}
