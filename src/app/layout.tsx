import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const instrument = localFont({
  src: [
    { path: "../fonts/instrument-sans.ttf", weight: "400 700", style: "normal" },
    { path: "../fonts/instrument-sans-italic.ttf", weight: "400 700", style: "italic" },
  ],
  variable: "--font-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "Orpheus — Ad-Free Cross-Platform Music Player",
  description:
    "Open-source YouTube Music and local audio player for Windows, macOS, Linux, and Android. Word-by-word synced lyrics, 10-band AutoEq, dual Liquid Glass & Material 3 UI, and zero ads.",
  applicationName: "Orpheus",
  icons: {
    icon: [
      { url: "/images/circle-app-icon.png", type: "image/png", sizes: "256x256" },
    ],
    apple: { url: "/images/rounded-app-icon.png", type: "image/png", sizes: "256x256" },
  },
  openGraph: {
    title: "Orpheus — Ad-Free Cross-Platform Music Player",
    description:
      "Word-synced lyrics, AutoEq presets, Listen Together rooms, Desktop Mini Player, and native builds for Windows, macOS, Linux, and Android.",
    images: ["/images/rounded-app-icon.png"],
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#07090f" },
  ],
};

const THEME_INIT_SCRIPT = `
(function () {
  try {
    var saved = localStorage.getItem('orpheus-theme');
    var mode = (saved === 'light' || saved === 'dark') ? saved : 'dark';
    var root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(mode);
    root.style.colorScheme = mode;
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`dark ${instrument.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
