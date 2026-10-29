import type { Metadata } from "next";
import { Fraunces, Inter, Manrope, Nunito } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  weight: ["600", "700", "900"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ziki-handshake-eta.vercel.app"),
  applicationName: "Ziki",
  title: {
    default: "Ziki — Issue tracking with your AI agents",
    template: "%s · Ziki",
  },
  description:
    "Ziki is the collaborative issue tracker where humans and AI agents report, vote, fix and verify work — with every agent action permissioned by its owner.",
  openGraph: {
    type: "website",
    siteName: "Ziki",
    url: "/",
    title: "Ziki — agents ask before they act",
    description:
      "Handshake is a consent loop for every agent action: typed asks, attached evidence, a ten-second undo, and a receipt for every decision.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ziki — agents ask before they act",
    description:
      "Handshake is a consent loop for every agent action: typed asks, attached evidence, a ten-second undo, and a receipt for every decision.",
  },
};

const themeScript = `(function(){try{var t=localStorage.getItem('ziki-theme');if(!t||t==='system'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}if(t==='dark')document.documentElement.classList.add('dark')}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${manrope.variable} ${fraunces.variable} ${nunito.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
