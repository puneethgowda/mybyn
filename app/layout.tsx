import clsx from "clsx";
import { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import "./globals.css";

import { Providers } from "./providers";

import { montserrat, moSans, onest } from "@/config/fonts";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "/"; // Use middleware to set x-pathname or parse from request

  const websiteRoutes = ["/", "/business", "/discover", "/creators"];
  const _isWebsiteRoute = websiteRoutes.includes(pathname);
  const _isLogin = ["/login"].includes(pathname);

  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "min-h-dvh text-foreground bg-background font-onest antialiased",
          onest.variable,
          moSans.variable,
          montserrat.variable
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
          <div className="relative flex flex-col h-dvh supports-[height:100dvh]:h-dvh">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
