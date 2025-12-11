import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MyFellowPet — Trusted Pet Boarding, Grooming, Vet Care & More",
  description:
    "MyFellowPet is a one-stop digital platform that connects pet parents with a curated network of trusted service providers — covering boarding, grooming, veterinary care, retail supplies, and compassionate farewell services. Seamless bookings, verified reviews and personalized support make it effortless to find the right care for every stage of your pet’s life.",
  keywords: [
    "pet boarding",
    "pet grooming",
    "pet walking",
    "pet care services",
    "pet sitting",
    "veterinary services",
    "pet supplies",
    "MyFellowPet",
    "pet services India",
  ],
  openGraph: {
    title: "MyFellowPet — Trusted Pet Services Platform",
    description:
      "Find verified and reliable pet services: boarding, grooming, vet care, pet products and more — all in one trusted platform.",
    url: "https://myfellowpet.com",
    siteName: "MyFellowPet",
    images: [
      {
        url: "https://myfellowpet.com/assets/myfellowpet_web_logo.jpg", // update if needed
        width: 1200,
        height: 630,
        alt: "MyFellowPet — Pet Services Platform",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
