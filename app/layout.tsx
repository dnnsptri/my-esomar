import type { Metadata } from "next";
import { Geist, Instrument_Serif } from "next/font/google";
import ChatProvider from "@/components/ChatProvider";
import SurveyQR from "@/components/SurveyQR";
import ResetDemo from "@/components/ResetDemo";
import CookieBar from "@/components/CookieBar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Serif is reserved for names and subjects (per the design brief),
// everything else stays in the sans.
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "my Esomar",
  description: "Conversational AI demo for the Esomar member portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* The conversational agent floats over every page — an "Ask me"
            pill that expands into a panel layer (see ChatProvider) */}
        <ChatProvider>{children}</ChatProvider>
        {/* Demo feedback "QR" — bottom-center, links to the questionnaire */}
        <SurveyQR />
        {/* Demo reset — bottom-left, on every page */}
        <ResetDemo />
        {/* Simplest functional-cookie consent bar */}
        <CookieBar />
      </body>
    </html>
  );
}
