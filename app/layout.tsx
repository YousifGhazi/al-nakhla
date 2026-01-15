import type { Metadata } from "next";
import "./globals.css";

//FIXME: Update metadata contents
export const metadata: Metadata = {
  title: "Al Nakhla FM - Your Premier Radio Station",
  description:
    "Al Nakhla FM - Broadcasting the finest music and entertainment. Listen live to your favorite shows and stay connected with the community.",
  keywords: [
    "radio",
    "Al Nakhla FM",
    "music",
    "entertainment",
    "live radio",
    "broadcasting",
  ],
  authors: [{ name: "Al Nakhla FM" }],
  icons: {
    icon: "/logo.ico",
  },
  openGraph: {
    title: "Al Nakhla FM - Your Premier Radio Station",
    description:
      "Broadcasting the finest music and entertainment. Listen live now!",
    type: "website",
    locale: "en_US",
    siteName: "Al Nakhla FM",
  },
  twitter: {
    card: "summary_large_image",
    title: "Al Nakhla FM",
    description:
      "Broadcasting the finest music and entertainment. Listen live now!",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
