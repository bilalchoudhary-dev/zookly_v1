import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionWrapper from "@/Components/SessionWrapper";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", 
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap", 
});




export const metadata = {
  metadataBase: new URL("https://zookly.vercel.app"),

  title: {
    default: "Zookly - Your Link in Bio Solution",
    template: "%s | Zookly", 
  },
  description: "One link for everything., Consolidate your online presence with Zookly.",
  
  keywords: ["link in bio", "social media tools", "creator tools", "zookly", "bio link"],

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "Zookly",
    description: "One link for everything.",
    url: "https://zookly.vercel.app",
    siteName: "Zookly",
    locale: "en_US",
    type: "website",
  },
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-title" content="Zookly" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionWrapper>
          <Toaster position="top-center" richColors />
          {children}
        </SessionWrapper>
      </body>
    </html>
  );
}