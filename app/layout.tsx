import type { Metadata } from "next";
import { headers } from "next/headers";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "Clips.ID - Performance-based Clipping Marketplace",
  description: "A marketplace connecting content creators with video clippers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nonce = headers().get("x-nonce") ?? undefined;
  return (
    <html lang="en" className={dmSans.variable}>
      <head>
        <Script
          src="https://app.midtrans.com/snap/snap.js"
          stretegy="beforeInteractive"
          nonce={nonce}
        />
        <Script
          id=""
          nonce={nonce}
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `console.log("Hydration jalan dengan nonce")`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
